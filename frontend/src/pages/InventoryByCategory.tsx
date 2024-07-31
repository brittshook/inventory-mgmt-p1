import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { DataTable, DataType } from "../components/DataTable";
import { useLocation } from "react-router-dom";
import { getCategoryById } from "../api/category";
import { ProductDataType } from "../api/product";

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
          const result = await getCategoryById(Number(id));

          if (result && result.products) {
            const inventory = result.products.flatMap(
              (product: ProductDataType) => {
                return product.inventory.map((item) => ({
                  key: product.id,
                  brand: product.brand,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  warehouseName: item.warehouse,
                  size: item.size,
                  quantity: item.quantity,
                }));
              }
            );

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
        showCategories={false}
        data={inventory}
      />
    </section>
  );
};
