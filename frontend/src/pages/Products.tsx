import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import warehouseIcon from "../assets/icons/warehouse.svg";

type props = {
  warehouseName?: string;
};

export const Products = ({ warehouseName }: props) => {
  return (
    <Breadcrumb
      items={[
        {
          href: "/warehouses",
          title: (
            <div className="breadcrumb-item">
              <img src={warehouseIcon} alt="warehouse" />
              <span>{warehouseName || "Warehouses"}</span>
            </div>
          ),
        },
        {
          href: `/products?warehouse=${warehouseName || "all"}`,
          title: "Products",
        },
      ]}
    />
  );
};
