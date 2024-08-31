import { useEffect, useState } from "react";
import { DataTable, DataType } from "../components/dataTable/DataTable";
import { useLocation } from "react-router-dom";
import { getWarehouseById } from "../api/warehouse";
import { getProductById, ProductDataType } from "../api/product";
import {
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

type props = {
  testId?: string;
};

export const InventoryByWarehouse = ({ testId }: props) => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const id = search.match(/\d+/)![0];

  const [form] = Form.useForm();

  const [warehouse, setWarehouse] = useState<string | null>(null);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [inventory, setInventory] = useState<DataType[]>();
  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (id) {
      try {
        const result = await getWarehouseById(Number(id));

        if (result) {
          setWarehouse(result.name);
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
        e instanceof Error && setError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateTotalCapacity = (data: DataType[]) => {
    const total = data.reduce((sum, item) => sum + item.quantity, 0);
    setTotalCapacity(total);
  };

  useEffect(() => {
    if (inventory && inventory.length > 0) {
      calculateTotalCapacity(inventory);
    }
  }, [inventory]);

  const handlePost = async (data: InventoryFormValues) => {
    try {
      await postInventory(data);
      await fetchData();
    } catch (e) {
      e instanceof Error && setError(e);
    }
  };

  const handlePut = async (data: InventoryFormValues) => {
    try {
      await putInventory(data);
      await fetchData();
    } catch (e) {
      e instanceof Error && setError(e);
    }
  };

  if (error) return <ErrorPage messageText={error.message} />;

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
            Inventory ({totalCapacity}/{maxCapacity})
          </h1>

          <ButtonWithModal
            buttonText="Add Inventory"
            modalButtonText="Create"
            buttonType="primary"
            title="New Inventory Item"
            confirmHandler={handlePost}
            form={form}
            disabled={totalCapacity >= maxCapacity}
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
    </div>
  );
};
