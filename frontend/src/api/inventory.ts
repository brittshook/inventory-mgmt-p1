import axiosInstance from "./api";
import { getCategoryByName } from "./category";
import {
  getProductByBrandAndName,
  getProductById,
  postProduct,
  putProduct,
} from "./product";
import { getWarehouseByName } from "./warehouse";

export type InventoryDataType = {
  id: number;
  product: number;
  warehouse: string;
  size: string;
  quantity: number;
};

export type InventoryFormValues = {
  id?: number;
  brand: string;
  name: string;
  description: string;
  price: number;
  size: string | "N/A";
  quantity: number;
  categoryName: string;
  warehouseName: string;
};

const API_ENDPOINT = "/inventory";

export const getInventory = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT);
    return response.data;
  } catch (e) {
    console.error("Error fetching data", e);
    throw e;
  }
};

export const putInventory = async (data: InventoryFormValues) => {
  try {
    let product;

    try {
      product = await getProductByBrandAndName(data.brand, data.name);

      const isProductUpdated =
        product.description !== data.description ||
        product.price !== data.price ||
        product.category.name !== data.categoryName;

      if (isProductUpdated) {
        const category = await getCategoryByName(data.categoryName);
        await putProduct(product.id, {
          brand: data.brand,
          name: data.name,
          description: data.description,
          price: data.price,
          category: category,
        });
        product = await getProductById(product.id);
      }
    } catch (e) {
      const category = await getCategoryByName(data.categoryName);
      product = await postProduct({
        brand: data.brand,
        name: data.name,
        description: data.description,
        price: data.price,
        category: category,
      });
    }

    const warehouse = await getWarehouseByName(data.warehouseName);

    const response = await axiosInstance.put(`${API_ENDPOINT}/${data.id}`, {
      product: product,
      warehouse: warehouse,
      size: data.size,
      quantity: data.quantity,
    });
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

export const postInventory = async (data: InventoryFormValues) => {
  try {
    let product;

    try {
      product = await getProductByBrandAndName(data.brand, data.name);
    } catch (e) {
      const category = await getCategoryByName(data.categoryName);
      product = await postProduct({
        brand: data.brand,
        name: data.name,
        description: data.description,
        price: data.price,
        category: category,
      });
    }

    const warehouse = await getWarehouseByName(data.warehouseName);

    const response = await axiosInstance.post(API_ENDPOINT, {
      product: product,
      warehouse: warehouse,
      size: data.size,
      quantity: data.quantity,
    });
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};

export const deleteInventoryById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error posting data", e);
    throw e;
  }
};
