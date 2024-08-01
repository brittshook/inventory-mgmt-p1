import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { DataTable, DataType } from "../components/DataTable";
import { useLocation } from "react-router-dom";
import {
  ProductDataType,
  getProductsWithInventoryByCategoryId,
} from "../api/product";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import productIcon from "../assets/icons/items.svg";
import { getCategoryById } from "../api/category";

export const InventoryByCategory = () => {
  const path = useLocation().pathname;
  const search = useLocation().search;
  const id = search.match(/\d+/)![0];

  const [category, setCategory] = useState<string | null>(null);
  const [inventory, setInventory] = useState<DataType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const categoryResult = await getCategoryById(Number(id));
          if (categoryResult) setCategory(categoryResult.name);

          const productResult = await getProductsWithInventoryByCategoryId(
            Number(id)
          );

          if (productResult) {
            const inventory = productResult.flatMap(
              (product: ProductDataType) => {
                return product.inventory.map((item) => ({
                  key: item.id,
                  brand: product.brand,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  warehouseName: item.warehouse,
                  size: item.size ?? "N/A",
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
  }, [id]);

  // TODO: make error message an alert
  if (error) return <>{console.log(error.message)}</>;

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/products",
            title: (
              <div className="breadcrumb-item">
                <img src={productIcon} alt="product" />
                <span>{"Products"}</span>
              </div>
            ),
          },
          {
            href: `${path + search}`,
            title: category ?? "",
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
          showCategories={false}
          data={inventory}
          handleDelete={() => console.log("delete")}
        />
      </section>
    </>
  );
};
