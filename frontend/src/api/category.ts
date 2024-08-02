import axiosInstance from "./api";
import { ProductDataType } from "./product";

export type CategoryDataType = {
  id: number;
  name: string;
  products: ProductDataType[];
};

export type CategoryFormValues = {
  name: string;
};

const API_ENDPOINT = "/category";

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const getCategoryByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/byProps`, {
      params: {
        name: name,
      },
    });
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const postCategory = async (data: CategoryFormValues) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

export const deleteCategoryById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};
