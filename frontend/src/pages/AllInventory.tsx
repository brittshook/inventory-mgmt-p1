import { useEffect, useState } from "react";
import { DataTable, DataType } from "../components/DataTable";
import { ProductDataType, getProductsWithInventory } from "../api/product";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import productIcon from "../assets/icons/items.svg";
import warehouseIcon from "../assets/icons/warehouse.svg";
import { useLocation } from "react-router-dom";
import { ButtonWithModal } from "../components/ButtonWithModal";
import { Form, Input, Select, Space } from "antd";
import { CategoryDataType, getCategories } from "../api/category";
import { getWarehouses, WarehouseDataType } from "../api/warehouse";
import { InventoryFormValues, postInventory } from "../api/inventory";

export const AllInventory = () => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const source = /category/.test(search) ? "/products" : "/warehouses";

  const { TextArea } = Input;

  const [inventory, setInventory] = useState<DataType[]>();
  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [warehouses, setWarehouses] = useState<WarehouseDataType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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
      e instanceof Error && setError(e);
    } finally {
      setLoading(false);
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

  // TODO: make error message an alert
  if (error) return <>{console.log(error.message)}</>;

  return (
    <>
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
            addItem={handlePost}
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
          </ButtonWithModal>
        </div>
        <DataTable
          loading={loading}
          showWarehouses
          showCategories
          initialData={inventory}
        />
      </section>
    </>
  );
};
