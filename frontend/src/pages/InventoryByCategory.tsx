import { useEffect, useState } from "react";
import { DataTable, DataType } from "../components/dataTable/DataTable";
import { useLocation } from "react-router-dom";
import {
  ProductDataType,
  getProductsWithInventoryByCategoryId,
} from "../api/product";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import productIcon from "../assets/icons/items.svg";
import { getCategoryById } from "../api/category";
import { ButtonWithModal } from "../components/ButtonWithModal";
import { Form } from "antd";
import { getWarehouses, WarehouseDataType } from "../api/warehouse";
import {
  deleteInventoryById,
  InventoryFormValues,
  postInventory,
  putInventory,
} from "../api/inventory";
import { ErrorPage } from "./ErrorPage";
import { InventoryForm } from "../components/InventoryForm";
import { AxiosError } from "axios";
import { ErrorOverlay } from "../components/ErrorOverlay";

type props = {
  testId?: string;
};

export const InventoryByCategory = ({ testId }: props) => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const id = search.match(/\d+/)![0]; // Set id based on search param in URL

  const [form] = Form.useForm(); // Initialize form using Ant Design's Form hook

  const [category, setCategory] = useState<string | null>(null);
  const [inventory, setInventory] = useState<DataType[]>();
  const [warehouses, setWarehouses] = useState<WarehouseDataType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(false);

  // Fetch data for category, products (with inventory), and warehouses
  const fetchData = async () => {
    if (id) {
      try {
        const categoryResult = await getCategoryById(Number(id));
        if (categoryResult) setCategory(categoryResult.name);

        const productResult = await getProductsWithInventoryByCategoryId(
          Number(id)
        );

        if (productResult) {
          const inventory = productResult.flatMap(
            (product: ProductDataType) => {
              return product.inventory.map((item) => ({
                key: item.id,
                brand: product.brand,
                name: product.name,
                description: product.description,
                price: product.price,
                categoryName: category,
                warehouseName: item.warehouse,
                size: item.size ?? "N/A",
                quantity: item.quantity,
              }));
            }
          );

          setInventory(inventory);
        }

        const warehousesResult = await getWarehouses();
        if (warehousesResult) setWarehouses(warehousesResult);
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
            href: "/products",
            title: (
              <div id="breadcrumb-products" className="breadcrumb-item">
                <img src={productIcon} alt="product" />
                <span>{"Products"}</span>
              </div>
            ),
          },
          {
            href: `${path + search}`,
            title: (
              <div
                id={`breadcrumb-product-type`}
                className="breadcrumb-item"
                aria-current="page"
              >
                {category}
              </div>
            ),
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
              warehouses={warehouses}
              initialValues={{ categoryName: category }}
              disableCategory
              defaultCategory={category}
            />
          </ButtonWithModal>
        </div>
        <DataTable
          loading={loading}
          showWarehouses
          showCategories={false}
          initialData={inventory}
          updateHandler={handlePut}
          deleteHandler={handleDelete}
          categoryName={category}
          editModalFormItems={
            <InventoryForm
              warehouses={warehouses}
              disableCategory
              defaultCategory={category}
            />
          }
        />
      </section>
      {/* Display error overlay if an error occurs and it's not a 404 error */}
      {showErrorOverlay && !error?.message.includes("404") && (
        <div data-testid="error-overlay">
          <ErrorOverlay
            messageText={
              error?.message.includes("500")
                ? "Server Error. Please try again later."
                : error?.message.includes("500")
                ? JSON.stringify(error?.response?.data).replace(/"/g, "")
                : "Error occurred. Please try again."
            }
          />
        </div>
      )}
    </div>
  );
};
