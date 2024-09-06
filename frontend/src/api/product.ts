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

// GET request to fetch all products (without inventory)
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

// GET request to fetch a single product by specified brand and name
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

// GET request to fetch all products (with inventory)
export const getProductsWithInventory = async () => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/detailed`);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

// GET request to fetch all products (with inventory) within specified category
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

// GET request to fetch a single product by specified id
export const getProductById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

// POST request to create a new products
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

// PUT request to update an existing product by its id
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
