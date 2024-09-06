import { useLocation } from "react-router-dom";
import { InventoryByWarehouse } from "./InventoryByWarehouse";
import { InventoryByCategory } from "./InventoryByCategory";
import { AllInventory } from "./AllInventory";

export const Inventory = () => {
  const search = useLocation().search;

  // Determine which inventory component to render based on search parameters
  if (/warehouse=\d+/.test(search)) {
    return <InventoryByWarehouse />; // Render Inventory By Warehouse page if URL matches '?warehouse=\d+'
  } else if (/category=\d+/.test(search)) {
    return <InventoryByCategory />; // Render Inventory By Category page if URL matches '?category=\d+'
  } else return <AllInventory />; // Otherwise, render All Inventory page
};
