import { Form, FormInstance, Input, Select, Space } from "antd";
import { CategoryDataType } from "../api/category";
import { WarehouseDataType } from "../api/warehouse";

type props = {
  includeParentForm?: boolean;
  form?: FormInstance<any>;
  categories?: CategoryDataType[] | null;
  warehouses?: WarehouseDataType[] | null;
  defaultCategory?: string | null;
  defaultWarehouse?: string | null;
  disableCategory?: boolean;
  disableWarehouse?: boolean;
  initialValues?:
    | { categoryName: string | null }
    | { warehouseName: string | null };
};

export const InventoryForm = ({
  includeParentForm,
  form,
  categories,
  warehouses,
  defaultCategory,
  defaultWarehouse,
  disableWarehouse,
  disableCategory,
  initialValues,
}: props) => {
  const { TextArea } = Input;

  const formItems = (
    <>
      <Form.Item
        label="Brand"
        name="brand"
        rules={[
          {
            required: true,
            message: "Please input the brand name",
          },
        ]}
      >
        <Input id="form_in_modal_brand" maxLength={255} />
      </Form.Item>
      <Form.Item
        label="Product Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input the product name",
          },
        ]}
      >
        <Input id="form_in_modal_name" maxLength={255} />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Please input the product description",
          },
        ]}
      >
        <TextArea id="form_in_modal_description" rows={3} maxLength={1000} />
      </Form.Item>
      <Space.Compact>
        <Form.Item
          style={{ marginRight: 7.5 }}
          label="Product Type"
          name="categoryName"
          rules={
            disableCategory
              ? [{ required: false }]
              : [
                  {
                    required: true,
                    message: "Please select the product type",
                  },
                ]
          }
        >
          {disableCategory ? (
            <Select
              id="form_in_modal_categoryName"
              style={{ width: 250 }}
              placeholder="Product Type"
              disabled
              defaultValue={defaultCategory}
              options={[{ value: defaultCategory, label: defaultCategory }]}
            />
          ) : (
            <Select
              id="form_in_modal_categoryName"
              style={{ width: 250 }}
              placeholder="Product Type"
              showSearch
              filterOption={(input, option) =>
                `${option?.label}`.toLowerCase().includes(input.toLowerCase())
              }
              options={categories?.map((category) => {
                return {
                  key: category.id,
                  value: category.name,
                  label: category.name,
                };
              })}
            />
          )}
        </Form.Item>
        <Form.Item
          style={{ marginLeft: 7.5 }}
          label="Warehouse"
          name="warehouseName"
          rules={
            disableWarehouse
              ? [{ required: false }]
              : [
                  {
                    required: true,
                    message: "Please select the warehouse",
                  },
                ]
          }
        >
          {disableWarehouse ? (
            <Select
              id="form_in_modal_warehouseName"
              style={{ width: 207 }}
              disabled
              value={defaultWarehouse}
              options={[{ value: defaultWarehouse, label: defaultWarehouse }]}
            />
          ) : (
            <Select
              id="form_in_modal_warehouseName"
              style={{ width: 207 }}
              placeholder="Warehouse"
              showSearch
              filterOption={(input, option) =>
                `${option?.label}`.toLowerCase().includes(input.toLowerCase())
              }
              options={warehouses?.map((warehouse) => {
                return {
                  key: warehouse.id,
                  value: warehouse.name,
                  label: warehouse.name,
                };
              })}
            />
          )}
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
              message: "Please input the product price",
            },
            {
              validator: (_, value) => {
                if (value !== undefined && value !== null) {
                  return value >= 0.0 ? Promise.resolve() : Promise.reject();
                }
              },
              message: "Price must be at least 0.00",
            },
          ]}
        >
          <Input id="form_in_modal_price" type="number" step="0.01" min="0" />
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
          <Input id="form_in_modal_size" maxLength={20} />
        </Form.Item>
        <Form.Item
          style={{ width: 148 }}
          label="Quantity"
          name="quantity"
          rules={[
            { required: true, message: "" },
            {
              validator: (_, value) => {
                // Trim the value and check if it's empty
                const trimmedValue = value?.toString().trim();
                if (!trimmedValue) {
                  return Promise.reject(
                    new Error("Please input the quantity")
                  );
                }

                // Validate if the number is at least 1
                return value >= 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Quantity must be at least 0"));
              },
            },
          ]}
        >
          <Input id="form_in_modal_quantity" type="number" step="1" min="0" />
        </Form.Item>
      </Space.Compact>
    </>
  );

  return includeParentForm ? (
    <Form
      layout="vertical"
      form={form}
      name="form_in_modal"
      initialValues={initialValues}
    >
      {formItems}
    </Form>
  ) : (
    <>{formItems}</>
  );
};
