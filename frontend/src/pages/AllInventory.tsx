import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { DataTable, DataType } from "../components/DataTable";
import { ProductDataType, getProductsWithInventory } from "../api/product";

export const AllInventory = () => {
  const [inventory, setInventory] = useState<DataType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProductsWithInventory();

        if (result) {
          const inventory = result.flatMap((product: ProductDataType) => {
            return product.inventory.map((item) => ({
              key: product.id,
              brand: product.brand,
              name: product.name,
              description: product.description,
              price: product.price,
              warehouseName: item.warehouse,
              size: item.size ?? "N/A",
              quantity: item.quantity,
            }));
          });

          setInventory(inventory);
        }
      } catch (e) {
        e instanceof Error && setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(inventory);

  // TODO: make error message an alert
  if (error) return <>{console.log(error.message)}</>;

  return (
    <section id="inventory">
      <div className="section-heading">
        <h1>Inventory</h1>
        <Button type="primary">Add Inventory</Button>
      </div>
      <DataTable
        loading={loading}
        showWarehouses
        showCategories
        data={inventory}
      />
    </section>
  );
};
