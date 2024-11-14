import "@testing-library/jest-dom";
import "@guidepup/jest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InventoryByWarehouse } from "../InventoryByWarehouse";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { getProductById } from "../../api/product";
import { getWarehouseById } from "../../api/warehouse";
import { generateMockAxiosError } from "../../test/__mocks__/axiosMock";
import { getCategories } from "../../api/category";
import { deleteInventoryById } from "../../api/inventory";

// Set up mocks
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

    // Check error overlay is displayed
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

    // Click delete button on first row
    await waitFor(() => {
      const deleteButton = screen.getAllByText("Delete");
      fireEvent.click(deleteButton[0]);
    });

    // Confirm delete
    await waitFor(() => {
      const confirmDeleteButton = document.querySelector(
        "#confirm-delete-inventory-0"
      );
      // Mock API response
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

    // Mock API response
    (getWarehouseById as jest.Mock).mockResolvedValue([]);
    (getProductById as jest.Mock).mockResolvedValue([]);

    // Check for no data message and delete function was called
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

    // Click delete button on first row
    await waitFor(() => {
      // index-based (not id!)
      const deleteButton = screen.getAllByText("Delete");
      fireEvent.click(deleteButton[0]);
    });

    // Confirm delete
    await waitFor(() => {
      const confirmDeleteButton = document.querySelector(
        "#confirm-delete-inventory-0"
      );
      fireEvent.click(confirmDeleteButton!);
    });

    // Check error overlay is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });

  test("should render page's breadcrumb with aria-current and aria-label", async () => {
    render(
      <MemoryRouter>
        <InventoryByWarehouse testId="inventory-by-warehouse" />
      </MemoryRouter>
    );

    // Check that the breadcrumb is displayed
    await waitFor(() => {
      const pageBreadcrumb = screen.getByRole("link", { current: "page" });
      expect(pageBreadcrumb).toBeInTheDocument();
      expect(pageBreadcrumb).toHaveAttribute("aria-label", "Warehouse NY1");
    });
  });


  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    render(
      <MemoryRouter>
        <InventoryByWarehouse testId="inventory-by-warehouse" />
      </MemoryRouter>
    );

    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "navigation, breadcrumb",
    "list",
    "listitem, level 1, position 1, set size 2",
    "link, Warehouses",
    "link, Warehouses",
    "Warehouses",
    "end of link, Warehouses",
    "end of link, Warehouses",
    "end of listitem, level 1, position 1, set size 2",
    "listitem, level 1, position 2, set size 2",
    "link, Warehouse NY1",
    "link, Warehouse NY1, current page",
    "NY1",
    "end of link, Warehouse NY1, current page",
    "end of link, Warehouse NY1",
    "end of listitem, level 1, position 2, set size 2",
    "end of list",
    "end of navigation, breadcrumb",
    "region",
    "heading, Inventory with current capacity of 100 and maximum capacity of 1000, level 1",
    "Inventory (",
    "100",
    "/",
    "1000",
    ")",
    "end of heading, Inventory with current capacity of 100 and maximum capacity of 1000, level 1",
    "button, Add Inventory",
    "table",
    "rowgroup",
    "row, Name Description Product Type Price Size Quantity Action",
    "columnheader, Brand, sorted in ascending order",
    "columnheader, Name",
    "columnheader, Description",
    "columnheader, Product Type",
    "columnheader, Price",
    "columnheader, Size",
    "columnheader, Quantity",
    "columnheader, Action",
    "end of row, Name Description Product Type Price Size Quantity Action",
    "end of rowgroup",
    "rowgroup",
    "row, SummitKing Peak Performance Climbing Shoes High-performance climbing shoes with excellent grip and comfort. Climbing Shoes 129.99 42 100 Edit Delete",
    "cell, SummitKing",
    "SummitKing",
    "end of cell, SummitKing",
    "cell, Peak Performance Climbing Shoes",
    "Peak Performance Climbing Shoes",
    "end of cell, Peak Performance Climbing Shoes",
    "cell, High-performance climbing shoes with excellent grip and comfort.",
    "High-performance climbing shoes with excellent grip and comfort.",
    "end of cell, High-performance climbing shoes with excellent grip and comfort.",
    "cell, Climbing Shoes",
    "cell, 129.99",
    "cell, 42",
    "cell, 100",
    "cell, Edit Delete",
    "button, Edit",
    "button, Delete",
    "end of cell, Edit Delete",
    "end of row, SummitKing Peak Performance Climbing Shoes High-performance climbing shoes with excellent grip and comfort. Climbing Shoes 129.99 42 100 Edit Delete",
    "end of rowgroup",
    "end of table",
    "list",
    "listitem, Previous Page, level 1, position 1, set size 3",
    "button, left, disabled",
    "img, left",
    "end of button, left, disabled",
    "end of listitem, Previous Page, level 1, position 1, set size 3",
    "listitem, 1, level 1, position 2, set size 3",
    "1",
    "end of listitem, 1, level 1, position 2, set size 3",
    "listitem, Next Page, level 1, position 3, set size 3",
    "button, right, disabled",
    "img, right",
    "end of button, right, disabled",
    "end of listitem, Next Page, level 1, position 3, set size 3",
    "end of list",
    "end of region",
    "end of document",
  ]
  `);
  });
});
