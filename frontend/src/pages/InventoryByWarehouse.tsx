import { useEffect, useState } from "react";
import { DataTable, DataType } from "../components/DataTable";
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
import { Form, Input, Select, Space } from "antd";
import { CategoryDataType, getCategories } from "../api/category";
import { ErrorPage } from "./ErrorPage";

export const InventoryByWarehouse = () => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const id = search.match(/\d+/)![0];

  const [form] = Form.useForm();
  const { TextArea } = Input;

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

  const formItems = (
    <>
      <Form.Item
        label="Brand"
        name="brand"
        rules={[
          {
            required: true,
            message: "Please input the brand name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Product Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input the product name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Please input the product description!",
          },
        ]}
      >
        <TextArea rows={3} />
      </Form.Item>
      <Space.Compact>
        <Form.Item
          style={{ marginRight: 7.5 }}
          label="Product Type"
          name="categoryName"
          rules={[
            {
              required: true,
              message: "Please select the product type!",
            },
          ]}
        >
          <Select
            style={{ width: 250 }}
            placeholder="Product Type"
            showSearch
            filterOption={(input, option) =>
              (`${option?.label}` ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={categories?.map((category) => {
              return {
                key: category.id,
                value: category.name,
                label: category.name,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          style={{ marginLeft: 7.5 }}
          label="Warehouse"
          name="warehouseName"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            style={{ width: 207 }}
            disabled
            value={warehouse}
            options={[{ value: warehouse, label: warehouse }]}
          />
        </Form.Item>
      </Space.Compact>
      <Space.Compact>
        <Form.Item
          style={{ width: 148 }}
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input the product price!",
            },
          ]}
        >
          <Input type="number" step="0.01" min="0" />
        </Form.Item>
        <Form.Item
          style={{ width: 148, marginLeft: 15, marginRight: 15 }}
          label="Size"
          name="size"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{ width: 147 }}
          label="Quantity"
          name="quantity"
          rules={[
            {
              required: true,
              message: "Please input the product price!",
            },
          ]}
        >
          <Input type="number" step="1" min="1" />
        </Form.Item>
      </Space.Compact>
    </>
  );

  if (error) return <ErrorPage messageText={error.message} />;

  return (
    <>
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
              <div
                id={`breadcrumb-warehouse-name`}
                className="breadcrumb-item"
              >
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
            <Form
              layout="vertical"
              form={form}
              name="form_in_modal"
              initialValues={{ warehouseName: warehouse }}
            >
              {formItems}
            </Form>
          </ButtonWithModal>
        </div>
        <DataTable
          loading={loading}
          showCategories
          showWarehouses={false}
          initialData={inventory}
          updateHandler={handlePut}
          editModalFormItems={formItems}
          warehouseName={warehouse}
        />
      </section>
    </>
  );
};
