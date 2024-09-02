import {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const generateMockAxiosError = (): AxiosError<unknown, any> => {
  const message = "Request failed with status code 400";
  const code = "400";
  const config: InternalAxiosRequestConfig = {
    url: "https://test.com/api/data",
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
  return new AxiosError<unknown, any>(message, code, config, {}, response);
};
