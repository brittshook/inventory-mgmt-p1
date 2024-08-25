pipeline {
    agent any

    environment {
        MAJOR_VERSION = '0'
        MINOR_VERSION = '1'
        PATCH_VERSION = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Prepare Version') {
            steps {
                script {
                    def newPatchVersion = PATCH_VERSION.toInteger() + 1
                    env.VERSION = "${MAJOR_VERSION}.${MINOR_VERSION}.${newPatchVersion}"
                    echo "Updated version to: ${env.VERSION}"
                }
            }
        }

        stage('Build and Analyze Frontend') {
            steps {
                script {
                    withSonarQubeEnv('SonarCloud') {
                        dir('frontend') {
                            sh '''
                            npm install
                            npm run build
                            npm run test -- --coverage
                            npx sonar-scanner \
                                -Dsonar.projectKey=mgmt-p1 \
                                -Dsonar.projectName=inventory-mgmt-p1-frontend \
                                -Dsonar.sources=src \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS') {
                    sh 'aws s3 sync frontend/dist s3://crag-supply-co-client'
                }
            }
        }

        stage('Build and Analyze Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean verify -Pcoverage -Dspring.profiles.active=build'

                    withSonarQubeEnv('SonarCloud') {
                        sh '''
                        mvn sonar:sonar \
                            -Dsonar.projectKey=brittshook_inventory-mgmt-p1 \
                            -Dsonar.projectName=inventory-mgmt-p1-backend \
                            -Dsonar.java.binaries=target/classes \
                            -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
                        '''
                    }
                }
                sh 'cd backend && mvn clean install -DskipTests=true -Dspring.profiles.active=build'
            }
        }

        stage('Test Backend') {
            steps {
                sh 'cd backend && mvn test -Dspring.profiles.active=test'
            }
        }

        stage('Perform Functional Tests') {
            steps {
                script {
                    sh 'rm -rf project-two-functional-tests'

                    // capture id's to later terminate pipeline project test servers
                    def backendPid
                    def frontendPid
                    withCredentials([
                        string(credentialsId: 'TEST_DB_USER', variable: 'DB_USER'),
                        string(credentialsId: 'TEST_DB_PWD', variable: 'DB_PWD'),
                        string(credentialsId: 'TEST_DB_URL', variable: 'DB_URL')]) {
                        dir('backend') {
                            backendPid = sh(script: '''
                                mvn spring-boot:run -Dspring-boot.run.arguments="--DB_URL=${DB_URL} --DB_USER=${DB_USER} --DB_PWD=${DB_PWD}" &
                                echo \$!
                            ''', returnStdout: true).trim()
                        }
                    }

                    dir('frontend') {
                        frontendPid = sh(script: '''
                            npm install && npx vite --mode test &
                            echo $!
                        ''', returnStdout: true).trim()
                    }

                    sh '''
                        until curl --output /dev/null --silent http://localhost:5000; do
                            echo 'waiting for backend...'
                            sleep 5
                        done
                        echo "***backend is ready***"
                    '''

                    sh '''
                        until curl --output /dev/null --silent http://localhost:5173; do
                            echo 'waiting for frontend...'
                            sleep 5
                        done
                        echo "***frontend is ready***"
                    '''

                    sh '''
                        git clone https://github.com/daniel413x/project-two-functional-tests.git
                        cd project-two-functional-tests
                    '''
                    withCredentials(string(credentialsId: 'CUCUMBER_PUBLISH_TOKEN', variable: 'CUCUMBER_TOKEN')) {
                        sh '''
                        echo 'cucumber.publish.token=${CUCUMBER_TOKEN}' >> src/test/resources/junit-platform.properties
                        mvn test -Dheadless=true
                        '''
                    }

                    sh "kill ${backendPid} || true"
                    sh "kill ${frontendPid} || true"
                    sh 'rm -rf project-two-functional-tests'
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS') {
                    sh '''
                    JAR_FILE=$(ls backend/target/*.jar | head -n 1)
                    aws s3 cp $JAR_FILE s3://crag-supply-co-backend/
                    JAR_FILENAME=$(basename $JAR_FILE)
                    echo "Deploying $JAR_FILENAME"
                    aws elasticbeanstalk create-application-version \
                        --application-name crag-supply-co \
                        --version-label ${VERSION} \
                        --source-bundle S3Bucket=crag-supply-co-backend,S3Key=$JAR_FILENAME
                    aws elasticbeanstalk update-environment --environment-name Crag-supply-co-env-4 --version-label ${VERSION}
                    '''
                }
            }
        }
    }
}
