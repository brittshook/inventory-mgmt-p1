import { Form, Input, Select } from "antd";
import {
  WarehouseDataType,
  WarehouseFormValues,
  deleteWarehouseById,
  getWarehouses,
  postWarehouse,
} from "../api/warehouse";
import { ButtonWithModal } from "../components/ButtonWithModal";
import { Card } from "../components/card/Card";
import { useEffect, useState } from "react";
import { US_STATES_AND_DC } from "../utils/states";

export const Warehouses = () => {
  const [form] = Form.useForm();

  const [warehouses, setWarehouses] = useState<WarehouseDataType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      const result = await getWarehouses();
      setWarehouses(result);
    } catch (e) {
      e instanceof Error && setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteWarehouseById(id);
      await fetchData();
    } catch (e) {
      e instanceof Error && setError(e);
    }
  };

  const handlePost = async (data: WarehouseFormValues) => {
    try {
      await postWarehouse(data);
      await fetchData();
    } catch (e) {
      e instanceof Error && setError(e);
    }
  };
  // TODO: make error message an alert
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section id="warehouses">
      <div className="section-heading">
        <h1>Warehouses</h1>
        <ButtonWithModal
          buttonText="Add Warehouse"
          buttonType="primary"
          title="New Warehouse"
          modalButtonText="Create"
          confirmHandler={handlePost}
          form={form}
        >
          <Form layout="vertical" form={form} name="form_in_modal">
            <Form.Item
              label="Warehouse Name"
              name="name"
              rules={[
                { required: true, message: "Please input the warehouse name!" },
              ]}
            >
              <Input addonBefore="Warehouse" />
            </Form.Item>
            <Form.Item
              label="Max Capacity"
              name="maxCapacity"
              rules={[
                {
                  required: true,
                  message: "Please input the maximum capacity!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Street Address"
              name="streetAddress"
              rules={[
                { required: true, message: "Please input the street address!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Input.Group compact>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please input the city!" }]}
              >
                <Input style={{ width: 150 }} />
              </Form.Item>
              <Form.Item
                label="State"
                name="state"
                rules={[
                  { required: true, message: "Please select the state!" },
                ]}
              >
                <Select
                  style={{ width: 170, marginLeft: 15, marginRight: 15 }}
                  placeholder="State"
                  showSearch
                  filterOption={(input, option) =>
                    (`${option?.label}` ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={US_STATES_AND_DC.map((state) => {
                    return {
                      key: state.value,
                      value: state.value,
                      label: state.label,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item
                label="Zip Code"
                name="zipCode"
                rules={[
                  { required: true, message: "Please input the zip code!" },
                ]}
              >
                <Input style={{ width: 120 }} />
              </Form.Item>
            </Input.Group>
          </Form>
        </ButtonWithModal>
      </div>
      <section className="cards">
        {warehouses?.map((warehouse) => (
          <Card
            key={warehouse.id}
            loaded={loading}
            path={`/inventory?warehouse=${warehouse.id}`}
            title={`Warehouse ${warehouse.name}`}
            id={warehouse.id}
            deleteItem={handleDelete}
            subtitle={`${warehouse.city}, ${warehouse.state}`}
          ></Card>
        ))}
      </section>
    </section>
  );
};
