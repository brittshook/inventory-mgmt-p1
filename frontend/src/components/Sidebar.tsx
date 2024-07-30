import { useState } from "react";
import "./Sidebar.css";
import dashboardIcon from "../assets/icons/dashboard.svg";
import warehouseIcon from "../assets/icons/warehouse.svg";
import { Logo } from "./Logo";

type props = {};
export const Sidebar = ({}: props) => {
  const [selectedListItem, setSelectedListItem] = useState(null);

  return (
    <aside>
      <div id="top">
        <Logo />
        <hr />
        <h2>General</h2>
        <ul>
          <li>
            <img src={dashboardIcon} />
            Dashboard
          </li>
          <li>
            <img src={warehouseIcon} />
            Warehouses
            <ul className="sublist">
              <li>
                <img />
                Products
              </li>
              <li>
                <img />
                Inventory
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div id="user-account">
        <img />
        {/* TODO: grab name &  role from DB */}
        <h3>Example name</h3>
        <p>Example role</p>
      </div>
    </aside>
  );
};
