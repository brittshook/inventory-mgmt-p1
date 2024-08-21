import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "http://localhost:5000/api",
  // "http://crag-supply-co-env-4.eba-ndsnmqsj.us-east-1.elasticbeanstalk.com/api",
  timeout: 10000,
});

axiosInstance.defaults.headers.common["Content-Type"] = "application/json";

export default axiosInstance;
