import {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Function to generate a mock AxiosError for testing purposes
export const generateMockAxiosError = (): AxiosError<unknown, any> => {
  const message = "Request failed with status code 400";
  const code = "400";
  const config: InternalAxiosRequestConfig = {
    url: "http://localhost:5000/api/category",
    method: "get",
    headers: new AxiosHeaders({
      "Content-Type": "application/json",
    }),
  };

  const response: AxiosResponse = {
    data: "Test",
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: config,
  };
  // Return a new AxiosError instance with the mock data
  return new AxiosError<unknown, any>(message, code, config, {}, response);
};
