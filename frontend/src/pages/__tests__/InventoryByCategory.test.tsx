import { render, screen, waitFor } from "@testing-library/react";
import { InventoryByCategory } from "../InventoryByCategory";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { getCategoryById } from "../../api/category";
import { getProductsWithInventory } from "../../api/product";

// Set up mocks
jest.mock("../../context/ScreenSizeContext", () => ({
  useScreenSize: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../../api/category", () => ({
  getCategoryById: jest.fn(),
}));

jest.mock("../../api/product", () => ({
  getProductsWithInventory: jest.fn(),
}));

describe("Inventory By Category Page", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock data
    (useLocation as jest.Mock).mockReturnValue({
      pathname: "/inventory",
      search: "?category=1",
    });
    (useScreenSize as jest.Mock).mockReturnValue({ isLargerThan1250: true });
    (getCategoryById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Climbing Shoes",
    });
    (getProductsWithInventory as jest.Mock).mockResolvedValue({
      id: 2,
      brand: "SummtKing",
      name: "Peak Performance Climbing Shoes",
      description:
        "High-performance climbing shoes with excellent grip and comfort.",
      price: 129.99,
      category: "Climbing Shoes",
      inventory: [
        { id: 2, product: 2, warehouse: "NY1", size: "42", quantity: 100 },
      ],
    });
  });

  test("should display loading state initially", () => {
    render(
      <MemoryRouter>
        <InventoryByCategory />
      </MemoryRouter>
    );

    // Verify loading spinner is displayed
    const spinner = document.querySelector(".ant-spin");
    expect(spinner).toBeInTheDocument();
  });

  test("should display inventory by category page", async () => {
    render(
      <MemoryRouter>
        <InventoryByCategory testId="inventory-by-category" />
      </MemoryRouter>
    );

    // Verify page component is displayed
    expect(screen.getByTestId("inventory-by-category")).toBeInTheDocument();

    // Verify table data rows are visible
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // 1 result + 1 header row
    });
  });
});
