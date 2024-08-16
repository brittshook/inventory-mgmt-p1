import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "http://crag-supply-co-env.eba-es8xkrpa.us-east-1.elasticbeanstalk.com/api",
  timeout: 10000,
});

axiosInstance.defaults.headers.common["Content-Type"] = "application/json";

export default axiosInstance;
