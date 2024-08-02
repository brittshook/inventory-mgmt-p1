import { useEffect, useState } from "react";
import { DataTable, DataType } from "../components/DataTable";
import { useLocation } from "react-router-dom";
import {
  ProductDataType,
  getProductsWithInventoryByCategoryId,
} from "../api/product";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import productIcon from "../assets/icons/items.svg";
import { getCategoryById } from "../api/category";
import { ButtonWithModal } from "../components/ButtonWithModal";
import { Form, Input, Select, Space } from "antd";
import { getWarehouses, WarehouseDataType } from "../api/warehouse";
import {
  InventoryFormValues,
  postInventory,
  putInventory,
} from "../api/inventory";

export const InventoryByCategory = () => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const id = search.match(/\d+/)![0];

  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [category, setCategory] = useState<string | null>(null);
  const [inventory, setInventory] = useState<DataType[]>();
  const [warehouses, setWarehouses] = useState<WarehouseDataType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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
        e instanceof Error && setError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePost = async (data: InventoryFormValues) => {
    try {
      await postInventory(data);
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
              required: false,
            },
          ]}
        >
          <Select
            style={{ width: 250 }}
            placeholder="Product Type"
            disabled
            options={[{ value: category, label: category }]}
          />
        </Form.Item>
        <Form.Item
          style={{ marginLeft: 7.5 }}
          label="Warehouse"
          name="warehouseName"
          rules={[
            {
              required: true,
              message: "Please select the Warehouse!",
            },
          ]}
        >
          <Select
            style={{ width: 207 }}
            placeholder="Warehouse"
            showSearch
            filterOption={(input, option) =>
              (`${option?.label}` ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={warehouses?.map((warehouse) => {
              return {
                key: warehouse.id,
                value: warehouse.name,
                label: warehouse.name,
              };
            })}
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

  // TODO: make error message an alert
  if (error) return <>{console.log(error.message)}</>;

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/products",
            title: (
              <div className="breadcrumb-item">
                <img src={productIcon} alt="product" />
                <span>{"Products"}</span>
              </div>
            ),
          },
          {
            href: `${path + search}`,
            title: category ?? "",
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
            <Form
              layout="vertical"
              form={form}
              name="form_in_modal"
              initialValues={{ categoryName: category }}
            >
              {formItems}
            </Form>
          </ButtonWithModal>
        </div>
        <DataTable
          loading={loading}
          showWarehouses
          showCategories={false}
          initialData={inventory}
          updateHandler={(data) => putInventory(data.key, data)}
          editModalFormItems={formItems}
        />
      </section>
    </>
  );
};
