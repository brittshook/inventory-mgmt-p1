import "./Sidebar.css";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import warehouseIcon from "../../assets/icons/warehouse.svg";
import productIcon from "../../assets/icons/items.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import inventoryIcon from "../../assets/icons/inventory.svg";
import profileImage from "/sample_user.webp";
import { Logo } from "../logo/Logo";
import { Link } from "react-router-dom";
import { useScreenSize } from "../../context/ScreenSizeContext";

type props = {
  testId?: string;
};

export const Sidebar = ({ testId }: props) => {
  const { isSmallerThan900 } = useScreenSize(); // Get screen size info from context

  return (
    <nav
      id="sidebar"
      data-testid={testId}
      className={isSmallerThan900 ? "collapsed" : "expanded"} // Render collapsed view when screen size < 900px
    >
      <div id="menu">
        <Link to="/">
          {/* Render short-form logo when screen size < 900px */}
          {isSmallerThan900 ? <Logo type="short" /> : <Logo type="full" />}
        </Link>
        <hr aria-hidden />
        {!isSmallerThan900 && <h2>General</h2>}
        <ul role="menubar">
          <li role="none">
            <Link id={"dashboard"} to="/" role="menuitem">
              <img
                src={dashboardIcon}
                alt={isSmallerThan900 ? "dashboard" : ""}
              />
              {/* Render only icons (no labels) in collapsed view */}
              {!isSmallerThan900 && "Dashboard"}
            </Link>
          </li>
          <li role="none">
            <Link id={"products"} to="/products" role="menuitem">
              <img src={productIcon} alt={isSmallerThan900 ? "products" : ""} />
              {!isSmallerThan900 && "Products"}
            </Link>
          </li>
          <li role="none">
            <Link id={"warehouses"} to="/warehouses" role="menuitem">
              <img
                src={warehouseIcon}
                alt={isSmallerThan900 ? "warehouses" : ""}
              />
              {!isSmallerThan900 && "Warehouses"}
            </Link>
          </li>
          <li role="none">
            <Link
              id="all-inventory"
              to="inventory?category=all"
              role="menuitem"
            >
              <img
                src={inventoryIcon}
                alt={isSmallerThan900 ? "inventory" : ""}
              />
              {!isSmallerThan900 && "Inventory"}
            </Link>
          </li>
        </ul>
      </div>
      <div id="user-account">
        {/* Do not render user details in collapsed view */}
        {!isSmallerThan900 && (
          <div id="user-details">
            <img id="profile" src={profileImage} alt="profile picture" />
            <div className="text">
              <h3>Jo Klein</h3>
              <p>Administrator</p>
            </div>
          </div>
        )}
        <img src={logoutIcon} alt="Logout" />
      </div>
    </nav>
  );
};
