import { useState, useEffect } from "react";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Route, Routes, useLocation } from "react-router-dom";
import { Login } from "./pages/Login";
import { Warehouses } from "./pages/Warehouses";
import { Inventory } from "./pages/Inventory";
import { Products } from "./pages/Products";
import { Sidebar } from "./components/sidebar/Sidebar";

function App() {
  // TODO: set to false once implementing users
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 900);

  const handleResize = () => {
    setIsCollapsed(window.innerWidth < 900);
  };

  useEffect(() => {
    setIsCollapsed(window.innerWidth < 900);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isLoggedIn && (
        <>
          <Sidebar isCollapsed={isCollapsed} />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </main>
        </>
      )}
      {!isLoggedIn && <Route path="/" element={<Login />} />}
    </>
  );
}

export default App;
