import { useState, useEffect } from "react";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import { Warehouses } from "./pages/Warehouses";
import { Inventory } from "./pages/Inventory";
import { Products } from "./pages/Products";
import { Sidebar } from "./components/sidebar/Sidebar";

function App() {
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
  );
}

export default App;
