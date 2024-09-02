import { useEffect, useState } from "react";
import { DataTable, DataType } from "../components/dataTable/DataTable";
import { ProductDataType, getProductsWithInventory } from "../api/product";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import productIcon from "../assets/icons/items.svg";
import warehouseIcon from "../assets/icons/warehouse.svg";
import { useLocation } from "react-router-dom";
import { ButtonWithModal } from "../components/ButtonWithModal";
import { Form } from "antd";
import { CategoryDataType, getCategories } from "../api/category";
import { getWarehouses, WarehouseDataType } from "../api/warehouse";
import {
  deleteInventoryById,
  InventoryFormValues,
  postInventory,
  putInventory,
} from "../api/inventory";
import { ErrorPage } from "./ErrorPage";
import { InventoryForm } from "../components/InventoryForm";
import { ErrorOverlay } from "../components/ErrorOverlay";
import { AxiosError } from "axios";

type props = {
  testId?: string;
};

export const AllInventory = ({ testId }: props) => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const source = /category/.test(search) ? "/products" : "/warehouses";

  const [form] = Form.useForm();

  const [inventory, setInventory] = useState<DataType[]>();
  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [warehouses, setWarehouses] = useState<WarehouseDataType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const productResult = await getProductsWithInventory();

      if (productResult) {
        const inventory = productResult.flatMap((product: ProductDataType) => {
          return product.inventory.map((item) => ({
            key: item.id,
            brand: product.brand,
            name: product.name,
            description: product.description,
            price: product.price,
            warehouseName: item.warehouse,
            categoryName: product.category,
            size: item.size ?? "N/A",
            quantity: item.quantity,
          }));
        });

        setInventory(inventory);
      }

      const categoriesResult = await getCategories();
      if (categoriesResult) setCategories(categoriesResult);

      const warehousesResult = await getWarehouses();
      if (warehousesResult) setWarehouses(warehousesResult);
    } catch (e) {
      e instanceof AxiosError && setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      setShowErrorOverlay(true);
      setTimeout(() => {
        setShowErrorOverlay(false);
      }, 1600);
    }
  }, [error]);

  const handlePost = async (data: InventoryFormValues) => {
    try {
      await postInventory(data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  const handlePut = async (data: InventoryFormValues) => {
    try {
      await putInventory(data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteInventoryById(id);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  if (error?.message.includes("404"))
    return <ErrorPage testId={testId && "error-page"} />;

  return (
    <div data-testid={testId}>
      <Breadcrumb
        items={[
          {
            href: source,
            title: (
              <div className="breadcrumb-item">
                <img
                  src={source == "/warehouses" ? warehouseIcon : productIcon}
                  alt={source.substring(1)}
                />
                <span style={{ textTransform: "capitalize" }}>
                  {source.substring(1)}
                </span>
              </div>
            ),
          },
          {
            href: `${path + search}`,
            title: "All",
          },
        ]}
      />
      <section id="inventory">
        <div className="section-heading">
          <h1>Inventory</h1>
          <ButtonWithModal
            buttonText="Add Inventory"
            modalButtonText="Create"
            buttonType="primary"
            title="New Inventory Item"
            confirmHandler={handlePost}
            form={form}
          >
            <InventoryForm
              includeParentForm={true}
              form={form}
              categories={categories}
              warehouses={warehouses}
            />
          </ButtonWithModal>
        </div>
        <DataTable
          loading={loading}
          showWarehouses
          showCategories
          initialData={inventory}
          updateHandler={handlePut}
          deleteHandler={handleDelete}
          editModalFormItems={
            <InventoryForm categories={categories} warehouses={warehouses} />
          }
        />
      </section>
      {showErrorOverlay && !error?.message.includes("404") && (
        <div data-testid="error-overlay">
          <ErrorOverlay
            messageText={
              error?.message.includes("500")
                ? "Server Error. Please try again later."
                : JSON.stringify(error?.response?.data)
                ? JSON.stringify(error?.response?.data).replace(/"/g, "")
                : "Error occurred. Please try again."
            }
          />
        </div>
      )}
    </div>
  );
};
