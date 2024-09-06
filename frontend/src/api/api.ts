import axios from "axios";

let baseURL = "http://localhost:5000/api"; // Set localhost as base URL in local development environment

// Set base URL to deployed backend in production environment
const env = import.meta.env.MODE;
if (env === "production") {
  baseURL =
    "http://crag-supply-co-env-4.eba-ndsnmqsj.us-east-1.elasticbeanstalk.com/api";
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // 10 sec
});

axiosInstance.defaults.headers.common["Content-Type"] = "application/json";

export default axiosInstance;
