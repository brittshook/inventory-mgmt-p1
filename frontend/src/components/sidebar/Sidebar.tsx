import "./Sidebar.css";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import warehouseIcon from "../../assets/icons/warehouse.svg";
import productIcon from "../../assets/icons/items.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import profileImage from "/sample_user.webp";
import { Logo } from "../Logo";
import { Link, useLocation } from "react-router-dom";

type props = { isCollapsed?: boolean };

export const Sidebar = ({ isCollapsed }: props) => {
  const path = useLocation().pathname;
  const search = useLocation().search;

  return (
    <aside className={isCollapsed ? "collapsed" : "expanded"}>
      <nav>
        <Link to="/">
          {isCollapsed ? <Logo type="short" /> : <Logo type="full" />}
        </Link>
        <hr />
        {!isCollapsed && <h2>General</h2>}
        <ul>
          <li>
            <Link id={"dashboard"} to="/">
              <img src={dashboardIcon} alt="dashboard" title="dashboard" />
              {!isCollapsed && "Dashboard"}
            </Link>
          </li>
          <li>
            <Link id={"products"} to="/products">
              <img src={productIcon} alt="products" title="products" />
              {!isCollapsed && "Products"}
            </Link>
            {!isCollapsed &&
              /(products|inventory\?category=)/.test(path + search) && (
                <ul className="sublist">
                  <li>
                    <Link id={"inventory-products"} to="inventory?category=all">
                      <svg
                        width="20"
                        height="33"
                        viewBox="0 0 20 33"
                        fill={
                          /category=/.test(search)
                            ? "var(--accent-color-blue)"
                            : "none"
                        }
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 0V18M1 18H10.0278M14.5 13C13.3065 13 12.1619 13.4741 11.318 14.318C10.4741 15.1619 10 16.3065 10 17.5C10 18.6935 10.4741 19.8381 11.318 20.682C12.1619 21.5259 13.3065 22 14.5 22C15.6935 22 16.8381 21.5259 17.682 20.682C18.5259 19.8381 19 18.6935 19 17.5C19 16.3065 18.5259 15.1619 17.682 14.318C16.8381 13.4741 15.6935 13 14.5 13Z"
                          stroke="#60646A"
                        />
                      </svg>
                      Inventory
                    </Link>
                  </li>
                </ul>
              )}
          </li>
          <li>
            <Link id={"warehouses"} to="/warehouses">
              <img src={warehouseIcon} />
              {!isCollapsed && "Warehouses"}
            </Link>
            {!isCollapsed &&
              /(warehouses|inventory\?warehouse=)/.test(path + search) && (
                <ul className="sublist">
                  <li>
                    <Link
                      id={"inventory-warehouses"}
                      to="inventory?warehouse=all"
                    >
                      <svg
                        width="20"
                        height="33"
                        viewBox="0 0 20 33"
                        fill={
                          /warehouse=/.test(search)
                            ? "var(--accent-color-blue)"
                            : "none"
                        }
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 0V18M1 18H10.0278M14.5 13C13.3065 13 12.1619 13.4741 11.318 14.318C10.4741 15.1619 10 16.3065 10 17.5C10 18.6935 10.4741 19.8381 11.318 20.682C12.1619 21.5259 13.3065 22 14.5 22C15.6935 22 16.8381 21.5259 17.682 20.682C18.5259 19.8381 19 18.6935 19 17.5C19 16.3065 18.5259 15.1619 17.682 14.318C16.8381 13.4741 15.6935 13 14.5 13Z"
                          stroke="#60646A"
                        />
                      </svg>
                      Inventory
                    </Link>
                  </li>
                </ul>
              )}
          </li>
        </ul>
      </nav>
      <div id="user-account">
        {!isCollapsed && (
          <div id="user-details">
            <img id="profile" src={profileImage} />
            {/* TODO: grab name &  role from DB */}
            <div className="text">
              <h3>Jo Klein</h3>
              <p>Administrator</p>
            </div>
          </div>
        )}
        <img src={logoutIcon} alt="Logout" />
      </div>
    </aside>
  );
};
