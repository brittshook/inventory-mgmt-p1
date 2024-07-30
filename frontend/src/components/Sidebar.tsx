import { useState } from "react";
import "./Sidebar.css";
import dashboardIcon from "../assets/icons/dashboard.svg";
import warehouseIcon from "../assets/icons/warehouse.svg";
import logoutIcon from "../assets/icons/logout.svg";
import sublistItem from "../assets/sublist_li.svg";
import lastSublistItem from "../assets/sublist_li_last.svg";
import profileImage from "/sample_user.webp";
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
            <span>
              <img src={warehouseIcon} />
              Warehouses
            </span>
            <ul className="sublist">
              <li>
                <img src={sublistItem} />
                Products
              </li>
              <li>
                <img src={lastSublistItem} />
                Inventory
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div id="user-account">
        <div id="user-details">
          <img id="profile" src={profileImage} />
          {/* TODO: grab name &  role from DB */}
          <div className="text">
            <h3>Jo Klein</h3>
            <p>Administrator</p>
          </div>
        </div>
        <img src={logoutIcon} alt="Logout" />
      </div>
    </aside>
  );
};
