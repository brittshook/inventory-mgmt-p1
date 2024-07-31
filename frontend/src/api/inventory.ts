import axiosInstance from "./api";

export type InventoryDataType = {
  id: number;
  product: number;
  warehouse: string;
  size: string;
  quantity: number;
};

const API_ENDPOINT = "/inventory";

export const getInventory = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

export const postInventory = async (data: InventoryDataType) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};
