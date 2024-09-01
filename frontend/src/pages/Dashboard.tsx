import { useEffect, useState } from "react";
import { Card } from "antd";
import { getWarehouses, WarehouseDataType } from "../api/warehouse";
import { ErrorPage } from "./ErrorPage";

export const Dashboard = () => {
  const [currentCapacity, setCurrentCapacity] = useState<number>(0);
  const [totalCapacity, setTotalCapacity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
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
      e instanceof Error && setError(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorPage messageText={error.message} />;
  return (
    <section id="dashboard">
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
    </section>
  );
};
