import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from "../App";
import "@testing-library/jest-dom";

// Mock API call
jest.mock("../api/warehouse");

describe("App", () => {
  test("renders Sidebar component", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const sidebarElement = screen.getByRole("navigation");
    expect(sidebarElement).toBeInTheDocument();
  });

  test("renders SkipNavigation component", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const skipNavElement = screen.getByText("Skip to main content");
    expect(skipNavElement).toBeInTheDocument();
  });

  test("should skip to main content when skip nav link is clicked", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const skipNavLink = screen.getByText("Skip to main content");
    const mainContent = document.querySelector("#main-content");

    fireEvent.focus(skipNavLink);
    skipNavLink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe("#main-content");

      const scrollPosition = window.scrollY;
      expect(scrollPosition).toBeGreaterThanOrEqual(
        (mainContent as HTMLElement)?.offsetTop ?? 0
      );
    });
  });

  test("renders Dashboard component by default", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const dashboardElement = screen.getByText("Dashboard");
    expect(dashboardElement).toBeInTheDocument();
  });

  test("renders Warehouses component when navigating to /warehouses", () => {
    window.history.pushState({}, "Warehouses", "/warehouses");
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const warehousesElement = screen.getByText("Warehouses");
    expect(warehousesElement).toBeInTheDocument();
  });

  test("renders Inventory component when navigating to /inventory?warehouse=all", () => {
    window.history.pushState({}, "Inventory", "/inventory?warehouse=all");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const inventoryElement = document.querySelector("h1");
    expect(inventoryElement).toBeInTheDocument();
    expect(inventoryElement?.textContent).toContain("Inventory");
  });

  test("renders Products component when navigating to /products", () => {
    window.history.pushState({}, "Products", "/products");
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const productsElement = screen.getByText("Products");
    expect(productsElement).toBeInTheDocument();
  });
});
