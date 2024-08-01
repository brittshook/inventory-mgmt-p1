import axiosInstance from "./api";
import { InventoryDataType } from "./inventory";

export type WarehouseDataType = {
  id: number;
  name: string;
  maxCapacity: number;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  inventory: InventoryDataType[];
};

const API_ENDPOINT = "/warehouse";

export const getWarehouses = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

export const getWarehouseById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

export const postWarehouses = async (data: WarehouseDataType) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};

export const deleteWarehouseById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};
