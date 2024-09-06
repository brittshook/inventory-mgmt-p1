import { useEffect, useState } from "react";
import { Card } from "antd";
import { getWarehouses, WarehouseDataType } from "../api/warehouse";
import { ErrorPage } from "./ErrorPage";
import { AxiosError } from "axios";
import { ErrorOverlay } from "../components/ErrorOverlay";

type props = {
  testId?: string;
};
export const Dashboard = ({ testId }: props) => {
  const [currentCapacity, setCurrentCapacity] = useState<number>(0);
  const [totalCapacity, setTotalCapacity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(false);

  // Fetch warehouse data and calculate total capacities
  const fetchData = async () => {
    try {
      const warehouseResult = await getWarehouses();

      const current = warehouseResult.reduce(
        (sum: number, warehouse: WarehouseDataType) =>
          sum + warehouse.currentCapacity,
        0
      );
      setCurrentCapacity(current);

      const capacity = warehouseResult.reduce(
        (sum: number, warehouse: WarehouseDataType) =>
          sum + warehouse.maxCapacity,
        0
      );
      setTotalCapacity(capacity);
    } catch (e) {
      e instanceof AxiosError && setError(e);
    } finally {
      setLoading(false); // Reset loading state after data fetch
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

  if (loading) return <div>Loading...</div>;

  // Render an error page if a 404 error occurs
  if (error?.message.includes("404"))
    return <ErrorPage testId={testId && "error-page"} />;

  return (
    <section data-testid={testId} id="dashboard">
      <h1>Dashboard</h1>
      <Card
        style={{ marginTop: 16 }}
        type="inner"
        title="Total Items in Inventory"
        extra={<a href="#">More</a>}
      >
        <h1 style={{ padding: 20 }}>{currentCapacity}</h1>
      </Card>
      <Card
        style={{ marginTop: 16 }}
        type="inner"
        title="Total Max Capacity"
        extra={<a href="#">More</a>}
      >
        <h1 style={{ padding: 20 }}>{totalCapacity}</h1>
      </Card>
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
