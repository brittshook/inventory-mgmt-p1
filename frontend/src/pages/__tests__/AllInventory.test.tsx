import "@testing-library/jest-dom";
import "@guidepup/jest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AllInventory } from "../AllInventory";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { getWarehouses } from "../../api/warehouse";
import { getCategories } from "../../api/category";
import { getProductsWithInventory } from "../../api/product";
import { generateMockAxiosError } from "../../test/__mocks__/axiosMock";
import { deleteInventoryById } from "../../api/inventory";

// Set up mocks
jest.mock("../../context/ScreenSizeContext", () => ({
  useScreenSize: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
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

jest.mock("../../api/inventory", () => ({
  putInventory: jest.fn(),
  deleteInventoryById: jest.fn(),
}));

describe("All Inventory Page", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock data
    (useLocation as jest.Mock).mockReturnValue({
      pathname: "/inventory",
      search: "?warehouse=all",
    });
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
        name: "NY1",
        currentCapacity: 100,
        maxCapacity: 1000,
        streetAddress: "123 Main St.",
        city: "Albany",
        state: "NY",
        zipCode: "12345",
      },
      {
        id: 2,
        name: "CA1",
        maxCapacity: 1000,
        streetAddress: "312 Main St.",
        city: "San Diego",
        state: "CA",
        zipCode: "82042",
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
        inventory: [{ id: 1, product: 1, warehouse: "CA1", quantity: 200 }],
      },
      {
        id: 2,
        brand: "SummitKing",
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

  test("should display an error if fetching items fails", async () => {
    (getProductsWithInventory as jest.Mock).mockRejectedValue(
      generateMockAxiosError()
    );

    render(
      <MemoryRouter>
        <AllInventory testId="all-inventory" />
      </MemoryRouter>
    );

    // Check that the error overlay is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });

  test("should be able to delete inventory", async () => {
    render(
      <MemoryRouter>
        <AllInventory testId="all-inventory" />
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
      (getProductsWithInventory as jest.Mock).mockResolvedValue([]);
      fireEvent.click(confirmDeleteButton!);
    });

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
        <AllInventory testId="all-inventory" />
      </MemoryRouter>
    );

    // Click delete button
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

    // Check for error overlay
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });

  test("should render page's breadcrumb with aria-current", () => {
    render(
      <MemoryRouter>
        <AllInventory testId="all-inventory" />
      </MemoryRouter>
    );

    // Check that the breadcrumb is displayed
    const pageBreadcrumb = screen.getByRole("link", { current: "page" });
    expect(pageBreadcrumb).toBeInTheDocument();
  });

  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    render(
      <MemoryRouter>
        <AllInventory testId="all-inventory" />
      </MemoryRouter>
    );

    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "navigation, breadcrumb",
    "list",
    "listitem, level 1, position 1, set size 1",
    "link, All Inventory",
    "link, All Inventory, current page",
    "All Inventory",
    "end of link, All Inventory, current page",
    "end of link, All Inventory",
    "end of listitem, level 1, position 1, set size 1",
    "end of list",
    "end of navigation, breadcrumb",
    "region",
    "heading, Inventory, level 1",
    "button, Add Inventory",
    "table",
    "rowgroup",
    "row, Name Description Product Type Price Size Quantity Warehouse Action",
    "columnheader, Brand, sorted in ascending order",
    "columnheader, Name",
    "columnheader, Description",
    "columnheader, Product Type",
    "columnheader, Price",
    "columnheader, Size",
    "columnheader, Quantity",
    "columnheader, Warehouse",
    "columnheader, Action",
    "end of row, Name Description Product Type Price Size Quantity Warehouse Action",
    "end of rowgroup",
    "rowgroup",
    "row, PeakPro Titanium Ascend Rope 60m Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing. Ropes 199.99 N/A 200 CA1 Edit Delete",
    "cell, PeakPro",
    "PeakPro",
    "end of cell, PeakPro",
    "cell, Titanium Ascend Rope 60m",
    "Titanium Ascend Rope 60m",
    "end of cell, Titanium Ascend Rope 60m",
    "cell, Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.",
    "Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.",
    "end of cell, Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.",
    "cell, Ropes",
    "cell, 199.99",
    "cell, N/A",
    "cell, 200",
    "cell, CA1",
    "cell, Edit Delete",
    "button, Edit",
    "button, Delete",
    "end of cell, Edit Delete",
    "end of row, PeakPro Titanium Ascend Rope 60m Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing. Ropes 199.99 N/A 200 CA1 Edit Delete",
    "row, SummitKing Peak Performance Climbing Shoes High-performance climbing shoes with excellent grip and comfort. Climbing Shoes 129.99 42 100 NY1 Edit Delete",
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
    "cell, NY1",
    "cell, Edit Delete",
    "button, Edit",
    "button, Delete",
    "end of cell, Edit Delete",
    "end of row, SummitKing Peak Performance Climbing Shoes High-performance climbing shoes with excellent grip and comfort. Climbing Shoes 129.99 42 100 NY1 Edit Delete",
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
