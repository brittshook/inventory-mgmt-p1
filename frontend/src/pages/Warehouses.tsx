import { Form } from "antd";
import {
  WarehouseDataType,
  WarehouseFormValues,
  deleteWarehouseById,
  getWarehouses,
  postWarehouse,
  putWarehouse,
} from "../api/warehouse";
import { ButtonWithModal } from "../components/ButtonWithModal";
import { Card } from "../components/card/Card";
import { useEffect, useState } from "react";
import { ErrorPage } from "./ErrorPage";
import { WarehouseForm } from "../components/WarehouseForm";

type props = {
  testId?: string;
};
export const Warehouses = ({ testId }: props) => {
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

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

  const handlePut = async (id: number) => {
    try {
      const data = updateForm.getFieldsValue();
      await putWarehouse(id, data);
      await fetchData();
    } catch (e) {
      e instanceof Error && setError(e);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorPage messageText={error.message} />;

  return (
    <section data-testid={testId} id="warehouses">
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
          <WarehouseForm
            testId={testId && "warehouse-create-form"}
            form={form}
          />
        </ButtonWithModal>
      </div>
      <section
        className="cards"
        data-testid={testId && "warehouse-cards-section"}
      >
        {warehouses?.map((warehouse) => (
          <Card
            testId={testId && `warehouse-card-${warehouse.id}`}
            key={warehouse.id}
            loaded={loading}
            path={`/inventory?warehouse=${warehouse.id}`}
            title={`Warehouse ${warehouse.name}`}
            id={warehouse.id}
            updateItem={handlePut}
            deleteItem={handleDelete}
            form={updateForm}
            initialValues={warehouse}
            editForm={
              <WarehouseForm
                testId={testId && "warehouse-edit-form"}
                form={updateForm}
                initialValues={warehouse}
              />
            }
            subtitle={`${warehouse.city}, ${warehouse.state}`}
          ></Card>
        ))}
      </section>
    </section>
  );
};
