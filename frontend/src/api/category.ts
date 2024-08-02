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
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

export const postCategory = async (data: CategoryFormValues) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};

export const deleteCategoryById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};
