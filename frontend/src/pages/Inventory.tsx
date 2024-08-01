
import { useLocation } from "react-router-dom";
import { InventoryByWarehouse } from "./InventoryByWarehouse";
import { InventoryByCategory } from "./InventoryByCategory";
import { AllInventory } from "./AllInventory";

export const Inventory = () => {
  const search = useLocation().search;

  if (/warehouse=\d+/.test(search)) {
    return <InventoryByWarehouse />;
  } else if (/category=\d+/.test(search)) {
    return <InventoryByCategory />;
  } else return <AllInventory />;
};
