import { render, screen, waitFor } from "@testing-library/react";
import { AllInventory } from "../AllInventory";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { getWarehouses } from "../../api/warehouse";
import { getCategories } from "../../api/category";
import { getProductsWithInventory } from "../../api/product";

// Set up mocks
jest.mock("../../context/ScreenSizeContext", () => ({
  useScreenSize: jest.fn(),
}));

jest.mock("../../api/category", () => ({
  getCategories: jest.fn(),
}));

jest.mock("../../api/warehouse", () => ({
  getWarehouses: jest.fn(),
}));

jest.mock("../../api/product", () => ({
  getProductsWithInventory: jest.fn(),
}));

describe("All Inventory Page", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock data
    (useScreenSize as jest.Mock).mockReturnValue({ isLargerThan1250: true });
    (getCategories as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: "Climbing Shoes",
      },
      {
        id: 2,
        name: "Ropes",
      },
    ]);
    (getWarehouses as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: "CA1",
        maxCapacity: 1000,
        streetAddress: "123 Main St.",
        city: "San Diego",
        state: "CA",
        zipCode: "82042",
        inventory: [
          { id: 1, product: 1, warehouse: "CA1", size: "N/A", quantity: 200 },
        ],
      },
      {
        id: 2,
        name: "NY1",
        maxCapacity: 2000,
        streetAddress: "4500 B Ave.",
        city: "Long Island",
        state: "NY",
        zipCode: "10042",
        inventory: [
          { id: 2, product: 2, warehouse: "NY1", size: "42", quantity: 100 },
        ],
      },
    ]);
    (getProductsWithInventory as jest.Mock).mockResolvedValue([
      {
        id: 1,
        brand: "PeakPro",
        name: "Titanium Ascend Rope 60m",
        description:
          "Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.",
        price: 199.99,
        category: "Ropes",
        inventory: [
          { id: 1, product: 1, warehouse: "CA1", size: "N/A", quantity: 200 },
        ],
      },
      {
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
      },
    ]);
  });

  test("should display loading state initially", () => {
    render(
      <MemoryRouter>
        <AllInventory testId="all-inventory" />
      </MemoryRouter>
    );

    // Verify loading spinner is displayed
    const spinner = document.querySelector(".ant-spin");
    expect(spinner).toBeInTheDocument();
  });

  test("should display all inventory page", async () => {
    render(
      <MemoryRouter>
        <AllInventory testId="all-inventory" />
      </MemoryRouter>
    );

    // Verify page component is displayed
    expect(screen.getByTestId("all-inventory")).toBeInTheDocument();

    // Verify table data rows are visible
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(3); // 2 results + 1 header row
    });
  });
});
