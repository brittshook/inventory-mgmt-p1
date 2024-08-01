import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { DataTable, DataType } from "../components/DataTable";
import { useLocation } from "react-router-dom";
import { getWarehouseById } from "../api/warehouse";
import { getProductById, ProductDataType } from "../api/product";
import { InventoryDataType } from "../api/inventory";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import warehouseIcon from "../assets/icons/warehouse.svg";

export const InventoryByWarehouse = () => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const id = search.match(/\d+/)![0];

  const [warehouse, setWarehouse] = useState<string | null>(null);
  const [inventory, setInventory] = useState<DataType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const result = await getWarehouseById(Number(id));

          if (result) {
            setWarehouse(result.name);

            if (result.inventory) {
              const inventory = await Promise.all(
                result.inventory.map(async (item: InventoryDataType) => {
                  const productId = item.product;
                  const product: ProductDataType = await getProductById(
                    productId
                  );
                  return {
                    key: item.id,
                    size: item.size ?? "N/A",
                    quantity: item.quantity,
                    brand: product.brand,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    categoryName: product.category,
                  };
                })
              );
              setInventory(inventory);
            }
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
    <>
      <Breadcrumb
        items={[
          {
            href: "/warehouses",
            title: (
              <div className="breadcrumb-item">
                <img src={warehouseIcon} alt="warehouse" />
                <span>{"Warehouses"}</span>
              </div>
            ),
          },
          {
            href: `${path + search}`,
            title: warehouse ?? "",
          },
        ]}
      />
      <section id="inventory">
        <div className="section-heading">
          <h1>Inventory</h1>
          <Button type="primary">Add Inventory</Button>
        </div>
        <DataTable
          loading={loading}
          showCategories
          showWarehouses={false}
          data={inventory}
          handleDelete={() => console.log("delete")}
        />
      </section>
    </>
  );
};
