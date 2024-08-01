import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { DataTable, DataType } from "../components/DataTable";
import { ProductDataType, getProductsWithInventory } from "../api/product";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import productIcon from "../assets/icons/items.svg";
import warehouseIcon from "../assets/icons/warehouse.svg";
import { useLocation } from "react-router-dom";

export const AllInventory = () => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const source = /category/.test(search) ? "/products" : "/warehouses";

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
              key: item.id,
              brand: product.brand,
              name: product.name,
              description: product.description,
              price: product.price,
              warehouseName: item.warehouse,
              categoryName: product.category,
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

  console.log(source);

  // TODO: make error message an alert
  if (error) return <>{console.log(error.message)}</>;

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: source,
            title: (
              <div className="breadcrumb-item">
                <img
                  src={source == "/warehouses" ? warehouseIcon : productIcon}
                  alt={source.substring(1)}
                />
                <span style={{ textTransform: "capitalize" }}>
                  {source.substring(1)}
                </span>
              </div>
            ),
          },
          {
            href: `${path + search}`,
            title: "All",
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
          showWarehouses
          showCategories
          data={inventory}
          handleDelete={() => console.log("delete")}
        />
      </section>
    </>
  );
};
