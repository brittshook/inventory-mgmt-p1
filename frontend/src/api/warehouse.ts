import axiosInstance from "./api";
import { InventoryDataType } from "./inventory";

export type WarehouseDataType = {
  id: number;
  name: string;
  maxCapacity: number;
  currentCapacity: number;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  inventory: InventoryDataType[];
};

export type WarehouseFormValues = {
  name: string;
  maxCapacity: number;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

const API_ENDPOINT = "/warehouse";

export const getWarehouses = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const getWarehouseById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const getWarehouseByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/byProps`, {
      params: {
        name: name,
      },
    });
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

export const postWarehouse = async (data: WarehouseFormValues) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

export const putWarehouse = async (id: number, data: WarehouseFormValues) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

export const deleteWarehouseById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};
