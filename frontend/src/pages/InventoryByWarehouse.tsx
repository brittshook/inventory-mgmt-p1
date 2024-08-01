import { useEffect, useState } from "react";
import { DataTable, DataType } from "../components/DataTable";
import { useLocation } from "react-router-dom";
import { getWarehouseById } from "../api/warehouse";
import { getProductById, ProductDataType } from "../api/product";
import { InventoryDataType } from "../api/inventory";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import warehouseIcon from "../assets/icons/warehouse.svg";
import { ButtonWithModal } from "../components/ButtonWithModal";
import { Form, Input, Select, Space } from "antd";
import { CategoryDataType, getCategories } from "../api/category";

export const InventoryByWarehouse = () => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const id = search.match(/\d+/)![0];

  const { TextArea } = Input;

  const [warehouse, setWarehouse] = useState<string | null>(null);
  const [inventory, setInventory] = useState<DataType[]>();
  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const result = await getWarehouseById(Number(id));

          if (result) {
            setWarehouse(result.name);

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

    fetchData();
  }, [id]);

  console.log(inventory);

  // TODO: make error message an alert
  if (error) return <>{console.log(error.message)}</>;

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/warehouses",
            title: (
              <div className="breadcrumb-item">
                <img src={warehouseIcon} alt="warehouse" />
                <span>{"Warehouses"}</span>
              </div>
            ),
          },
          {
            href: `${path + search}`,
            title: warehouse ?? "",
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
            onCreate={(values) => console.log(values)}
          >
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
                  name="warehouse"
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
                    disabled
                    defaultValue={warehouse}
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
          </ButtonWithModal>
        </div>
        <DataTable
          loading={loading}
          showCategories
          showWarehouses={false}
          initialData={inventory}
        />
      </section>
    </>
  );
};
