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

        stage('Build Frontend') {
            steps {
                sh 'echo Building Stage 1'
                sh 'cd frontend && npm install && npm run build'
            }
        }

        stage('Deploy Frontend') {
            steps {
                withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS') {
                    sh 'aws s3 sync frontend/dist s3://crag-supply-co-client'
                }
            }
        }

        stage('Build Backend') {
            steps {
                sh 'cd backend && mvn clean install -DskipTests=true -Dspring.profiles.active=build'
            }
        }

        stage('SonarCloud Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner'
                    withSonarQubeEnv('SonarCloud') {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=brittshook_inventory-mgmt-p1 -Dsonar.projectName=backend"
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                sh 'cd backend && mvn test -Dspring.profiles.active=test'
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
