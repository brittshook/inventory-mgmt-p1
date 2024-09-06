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
import { WarehouseForm } from "../components/WarehouseForm";
import { AxiosError } from "axios";
import { ErrorOverlay } from "../components/ErrorOverlay";
import { ErrorPage } from "./ErrorPage";

type props = {
  testId?: string;
};
export const Warehouses = ({ testId }: props) => {
  // Initialize forms using Ant Design's Form hook
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [warehouses, setWarehouses] = useState<WarehouseDataType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(false);

  // Fetch data for warehouses
  const fetchData = async () => {
    try {
      const result = await getWarehouses();
      setWarehouses(result);
    } catch (e) {
      e instanceof AxiosError && setError(e);
    } finally {
      setLoading(false);
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

  // Handle deleting warehouse
  const handleDelete = async (id: number) => {
    try {
      await deleteWarehouseById(id);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  // Handle adding new warehouse
  const handlePost = async (data: WarehouseFormValues) => {
    try {
      await postWarehouse(data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  // Handle updating existing warehouse
  const handlePut = async (id: number) => {
    try {
      const data = updateForm.getFieldsValue();
      await putWarehouse(id, data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  if (loading) return <div>Loading...</div>;

  // Render an error page if a 404 error occurs
  if (error?.message.includes("404"))
    return <ErrorPage testId={testId && "error-page"} />;

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
      {/* Display error overlay if an error occurs and it's not a 404 error */}
      {showErrorOverlay && !error?.message.includes("404") && (
        <div data-testid="error-overlay">
          <ErrorOverlay
            messageText={
              error?.message.includes("500")
                ? "Server Error. Please try again later."
                : JSON.stringify(error?.response?.data)
                ? JSON.stringify(error?.response?.data).replace(/"/g, "")
                : "Error occurred. Please try again."
            }
          />
        </div>
      )}
    </section>
  );
};
