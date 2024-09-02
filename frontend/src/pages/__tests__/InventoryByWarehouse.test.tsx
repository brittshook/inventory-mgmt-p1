import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InventoryByWarehouse } from "../InventoryByWarehouse";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { getProductById } from "../../api/product";
import { getWarehouseById } from "../../api/warehouse";
import { generateMockAxiosError } from "../../test/__mocks__/axiosMock";
import { getCategories } from "../../api/category";
import { deleteInventoryById } from "../../api/inventory";

jest.mock("../../context/ScreenSizeContext", () => ({
  useScreenSize: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../../api/warehouse", () => ({
  getWarehouseById: jest.fn(),
}));

jest.mock("../../api/category", () => ({
  getCategories: jest.fn(),
}));

jest.mock("../../api/product", () => ({
  getProductById: jest.fn(),
}));

jest.mock("../../api/inventory", () => ({
  deleteInventoryById: jest.fn(),
}));

describe("Inventory By Warehouse Page", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock data
    (useLocation as jest.Mock).mockReturnValue({
      pathname: "/inventory",
      search: "?warehouse=1",
    });
    (useScreenSize as jest.Mock).mockReturnValue({ isLargerThan1250: true });
    (getWarehouseById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "NY1",
      currentCapacity: 100,
      maxCapacity: 1000,
      streetAddress: "123 Main St.",
      city: "Albany",
      state: "NY",
      zipCode: "12345",
      inventory: [
        { id: 2, product: 2, warehouse: "NY1", size: "42", quantity: 100 },
      ],
    });
    (getProductById as jest.Mock).mockResolvedValue({
      id: 2,
      brand: "SummitKing",
      name: "Peak Performance Climbing Shoes",
      description:
        "High-performance climbing shoes with excellent grip and comfort.",
      price: 129.99,
      category: "Climbing Shoes",
    });
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
  });

  test("should display loading state initially", () => {
    render(
      <MemoryRouter>
        <InventoryByWarehouse testId="inventory-by-warehouse" />
      </MemoryRouter>
    );

    // Verify loading spinner is displayed
    const spinner = document.querySelector(".ant-spin");
    expect(spinner).toBeInTheDocument();
  });

  test("should display inventory by warehouse page", async () => {
    render(
      <MemoryRouter>
        <InventoryByWarehouse testId="inventory-by-warehouse" />
      </MemoryRouter>
    );

    // Verify page component is displayed
    expect(screen.getByTestId("inventory-by-warehouse")).toBeInTheDocument();

    // Verify table data rows are visible
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // 1 result + 1 header row
    });
  });

  test("should display an error if fetching items fails", async () => {
    (getWarehouseById as jest.Mock).mockRejectedValue(generateMockAxiosError());

    render(
      <MemoryRouter>
        <InventoryByWarehouse testId="inventory-by-warehouse" />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });

  test("should be able to delete inventory", async () => {
    render(
      <MemoryRouter>
        <InventoryByWarehouse testId="inventory-by-warehouse" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const deleteButton = screen.getAllByText("Delete");
      fireEvent.click(deleteButton[0]);
    });

    await waitFor(() => {
      const confirmDeleteButton = document.querySelector(
        "#confirm-delete-inventory-0"
      );
      (getWarehouseById as jest.Mock).mockResolvedValue({
        id: 1,
        name: "NY1",
        currentCapacity: 100,
        maxCapacity: 1000,
        streetAddress: "123 Main St.",
        city: "Albany",
        state: "NY",
        zipCode: "12345",
        inventory: [],
      });
      fireEvent.click(confirmDeleteButton!);
    });

    (getWarehouseById as jest.Mock).mockResolvedValue([]);
    (getProductById as jest.Mock).mockResolvedValue([]);

    await waitFor(() => {
      expect(screen.getByText("No data")).toBeDefined();
      expect(deleteInventoryById).toHaveBeenCalled();
    });
  });

  test("should show an error if deleting inventory fails", async () => {
    (deleteInventoryById as jest.Mock).mockRejectedValue(
      generateMockAxiosError()
    );

    render(
      <MemoryRouter>
        <InventoryByWarehouse testId="inventory-by-warehouse" />
      </MemoryRouter>
    );

    await waitFor(() => {
      // index-based (not id!)
      const deleteButton = screen.getAllByText("Delete");
      fireEvent.click(deleteButton[0]);
    });

    await waitFor(() => {
      const confirmDeleteButton = document.querySelector(
        "#confirm-delete-inventory-0"
      );
      fireEvent.click(confirmDeleteButton!);
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });
});
