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

// GET request to fetch all categories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

// GET request to fetch a single category by specified id
export const getCategoryById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

// GET request to fetch a single category by specified name
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

// POST request to create a new category
export const postCategory = async (data: CategoryFormValues) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

// PUT request to update an existing category by its id
export const putCategory = async (id: number, data: CategoryFormValues) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

// DELETE request to remove a category by its id
export const deleteCategoryById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};
