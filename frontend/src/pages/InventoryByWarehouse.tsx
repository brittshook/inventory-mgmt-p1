import { useEffect, useState } from "react";
import { DataTable, DataType } from "../components/dataTable/DataTable";
import { useLocation } from "react-router-dom";
import { getWarehouseById } from "../api/warehouse";
import { getProductById, ProductDataType } from "../api/product";
import {
  deleteInventoryById,
  InventoryDataType,
  InventoryFormValues,
  postInventory,
  putInventory,
} from "../api/inventory";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import warehouseIcon from "../assets/icons/warehouse.svg";
import { ButtonWithModal } from "../components/ButtonWithModal";
import { Form } from "antd";
import { CategoryDataType, getCategories } from "../api/category";
import { ErrorPage } from "./ErrorPage";
import { InventoryForm } from "../components/InventoryForm";
import { AxiosError } from "axios";
import { ErrorOverlay } from "../components/ErrorOverlay";

type props = {
  testId?: string;
};

export const InventoryByWarehouse = ({ testId }: props) => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const id = search.match(/\d+/)![0]; // Set id based on search param in URL

  const [form] = Form.useForm(); // Initialize form using Ant Design's Form hook

  const [warehouse, setWarehouse] = useState<string | null>(null);
  const [currentCapacity, setCurrentCapacity] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [inventory, setInventory] = useState<DataType[]>();
  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(false);

  // Fetch data for warehouse, inventory, and products
  const fetchData = async () => {
    if (id) {
      try {
        const result = await getWarehouseById(Number(id));

        if (result) {
          setWarehouse(result.name);
          setCurrentCapacity(result.currentCapacity);
          setMaxCapacity(result.maxCapacity);

          if (result.inventory) {
            const inventory = await Promise.all(
              result.inventory.map(async (item: InventoryDataType) => {
                const productId = item.product;
                const product: ProductDataType = await getProductById(
                  productId
                );

                return {
                  key: item.id,
                  size: item.size ?? "N/A",
                  quantity: item.quantity,
                  brand: product.brand,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  categoryName: product.category,
                  warehouseName: warehouse,
                };
              })
            );
            setInventory(inventory);
          }
        }

        const categoriesResult = await getCategories();

        if (categoriesResult) setCategories(categoriesResult);
      } catch (e) {
        e instanceof AxiosError && setError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle error display and error overlay
  useEffect(() => {
    if (error) {
      setShowErrorOverlay(true);
      setTimeout(() => {
        setShowErrorOverlay(false);
      }, 1600);
    }
  }, [error]);

  // Handle adding new inventory
  const handlePost = async (data: InventoryFormValues) => {
    try {
      await postInventory(data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  // Handle updating existing inventory
  const handlePut = async (data: InventoryFormValues) => {
    try {
      await putInventory(data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  // Handle deleting inventory item
  const handleDelete = async (id: number) => {
    try {
      await deleteInventoryById(id);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
    }
  };

  // Render an error page if a 404 error occurs
  if (error?.message.includes("404"))
    return <ErrorPage testId={testId && "error-page"} />;

  return (
    <div data-testid={testId}>
      <Breadcrumb
        items={[
          {
            href: "/warehouses",
            title: (
              <div id="breadcrumb-warehouses" className="breadcrumb-item">
                <img src={warehouseIcon} alt="warehouse" />
                <span>{"Warehouses"}</span>
              </div>
            ),
          },
          {
            href: `${path + search}`,
            title: (
              <div id={`breadcrumb-warehouse-name`} className="breadcrumb-item">
                {warehouse}
              </div>
            ),
          },
        ]}
      />
      <section id="inventory">
        <div className="section-heading">
          <h1>
            Inventory ({currentCapacity}/{maxCapacity})
          </h1>

          <ButtonWithModal
            buttonText="Add Inventory"
            modalButtonText="Create"
            buttonType="primary"
            title="New Inventory Item"
            confirmHandler={handlePost}
            form={form}
            disabled={currentCapacity >= maxCapacity}
          >
            <InventoryForm
              includeParentForm={true}
              form={form}
              categories={categories}
              initialValues={{ warehouseName: warehouse }}
              disableWarehouse
              defaultWarehouse={warehouse}
            />
          </ButtonWithModal>
        </div>
        <DataTable
          loading={loading}
          showCategories
          showWarehouses={false}
          initialData={inventory}
          updateHandler={handlePut}
          deleteHandler={handleDelete}
          editModalFormItems={
            <InventoryForm
              categories={categories}
              disableWarehouse
              defaultWarehouse={warehouse}
            />
          }
          warehouseName={warehouse}
        />
      </section>
      {/* Display error overlay if an error occurs and it's not a 404 error */}
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
