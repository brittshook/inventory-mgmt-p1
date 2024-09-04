import axiosInstance from "./api";
import { InventoryDataType } from "./inventory";

export type ProductDataType = {
  id: number;
  brand: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: InventoryDataType[];
};

const API_ENDPOINT = "/product";

export const getProducts = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const getProductByBrandAndName = async (brand: string, name: string) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/byProps`, {
      params: {
        brand: brand,
        name: name,
      },
    });
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const getProductsWithInventory = async () => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/detailed`);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const getProductsWithInventoryByCategoryId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINT}/detailed?categoryId=${id}`
    );
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const postProduct = async (data: {
  brand: string;
  name: string;
  description: string;
  price: number;
  category: number;
}) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

export const putProduct = async (
  id: number,
  data: {
    brand: string;
    name: string;
    description: string;
    price: number;
    category: number;
  }
) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};
