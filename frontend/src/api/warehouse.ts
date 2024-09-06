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

// GET request to fetch all warehouses
export const getWarehouses = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

// GET request to fetch a single warehouse by specified id
export const getWarehouseById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

// GET request to fetch a single warehouse by specified name
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

// POST request to create a new warehouse
export const postWarehouse = async (data: WarehouseFormValues) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

// PUT request to update an existing warehouse by its id
export const putWarehouse = async (id: number, data: WarehouseFormValues) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, data);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

// DELETE request to remove a warehouse by its id
export const deleteWarehouseById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};
