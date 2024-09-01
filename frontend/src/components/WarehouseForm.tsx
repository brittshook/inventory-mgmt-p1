import { Form, FormInstance, Input, Select, Space } from "antd";
import { US_STATES_AND_DC } from "../utils/states";

type props = {
  form: FormInstance<any>;
  initialValues?: {
    name?: string;
    maxCapacity?: number;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  testId?: string;
};

export const WarehouseForm = ({ form, initialValues, testId }: props) => {
  return (
    <Form
      data-testid={testId}
      layout="vertical"
      form={form}
      initialValues={initialValues}
    >
      <Form.Item
        label="Warehouse Name"
        name="name"
        rules={[{ required: true, message: "Please input the warehouse name" }]}
      >
        <Input
          id="form_in_modal_name"
          addonBefore="Warehouse"
          data-testid={testId && "warehouse-modal-name-field"}
          maxLength={50}
        />
      </Form.Item>
      <Form.Item
        label="Max Capacity"
        name="maxCapacity"
        rules={[
          { required: true, message: "Please input the maximum capacity" },
          {
            validator: (_, value) => {
              if (value !== undefined && value !== null) {
                return value >= 1 ? Promise.resolve() : Promise.reject();
              }
            },
            message: "Maximum capacity must be at least 1",
          },
        ]}
      >
        <Input
          id="form_in_modal_maxCapacity"
          type="number"
          data-testid={testId && "warehouse-modal-max-capacity-field"}
          min={1}
        />
      </Form.Item>
      <Form.Item
        label="Street Address"
        name="streetAddress"
        rules={[{ required: true, message: "Please input the street address" }]}
      >
        <Input
          id="form_in_modal_streetAddress"
          data-testid={testId && "warehouse-modal-street-address-field"}
          maxLength={255}
        />
      </Form.Item>
      <Space.Compact>
        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: "Please input the city" }]}
        >
          <Input
            id="form_in_modal_city"
            style={{ width: 150 }}
            data-testid={testId && "warehouse-modal-city-field"}
            maxLength={50}
          />
        </Form.Item>
        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: "Please select the state" }]}
        >
          <Select
            id="form_in_modal_state"
            style={{ width: 170, marginLeft: 15, marginRight: 15 }}
            placeholder="State"
            showSearch
            data-testid={testId && "warehouse-modal-state-select"}
            filterOption={(input, option) =>
              `${option?.label}`.toLowerCase().includes(input.toLowerCase())
            }
            options={US_STATES_AND_DC.map((state) => ({
              key: state.value,
              value: state.value,
              label: state.label,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Zip Code"
          name="zipCode"
          rules={[
            { required: true, message: "Please input the zip code" },
            {
              pattern: /^[0-9]{5}(-[0-9]{4})?$/,
              message: "Please enter a valid zip code",
            },
          ]}
        >
          <Input
            id="form_in_modal_zipCode"
            style={{ width: 120 }}
            data-testid={testId && "warehouse-modal-zip-code-field"}
            maxLength={10}
          />
        </Form.Item>
      </Space.Compact>
    </Form>
  );
};
