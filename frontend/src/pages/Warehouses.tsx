import { Button } from "../components/Button";
import { WarehouseDataType, getWarehouses } from "../api/warehouse";
import { Card } from "../components/card/Card";
import { useEffect, useState } from "react";

export const Warehouses = () => {
  const [warehouses, setWarehouses] = useState<WarehouseDataType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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

    fetchData();
  }, []);
  // TODO: make error message an alert
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section id="warehouses">
      <div className="section-heading">
        <h1>Warehouses</h1>
        <Button type="primary">Add Warehouse</Button>
      </div>
      <section className="cards">
        {warehouses?.map((warehouse) => (
          <Card
            key={warehouse.id}
            loaded={loading}
            path={`/inventory?warehouse=${warehouse.id}`}
            title={warehouse.name}
          ></Card>
        ))}
      </section>
    </section>
  );
};
