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
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

export const postProducts = async (data: ProductDataType) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};
