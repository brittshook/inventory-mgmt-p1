import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import { Warehouses } from "./pages/Warehouses";
import { Inventory } from "./pages/Inventory";
import { Products } from "./pages/Products";
import { Sidebar } from "./components/sidebar/Sidebar";
import { ScreenSizeProvider } from "./context/ScreenSizeContext";
import { SkipNavigation } from "./components/SkipNavigation";

function App() {
  return (
    <ScreenSizeProvider>
      <SkipNavigation section="#main-content" />
      <div id="app">
        <Sidebar />
        <main className="#main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>
      </div>
    </ScreenSizeProvider>
  );
}

export default App;
