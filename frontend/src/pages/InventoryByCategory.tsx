import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { DataTable, DataType } from "../components/DataTable";
import { useLocation } from "react-router-dom";
import { ProductDataType, getProductsWithInventoryByCategoryId } from "../api/product";

export const InventoryByCategory = () => {
  const search = useLocation().search;
  const id = search.match(/\d+/)![0];

  const [inventory, setInventory] = useState<DataType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const result = await getProductsWithInventoryByCategoryId(Number(id));

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
      }
    };

    fetchData();
  }, [id]);

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
        showCategories={false}
        data={inventory}
      />
    </section>
  );
};
