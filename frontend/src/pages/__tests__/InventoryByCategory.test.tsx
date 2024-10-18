import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { InventoryByCategory } from "../InventoryByCategory";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { getCategoryById } from "../../api/category";
import { getProductsWithInventoryByCategoryId } from "../../api/product";
import { generateMockAxiosError } from "../../test/__mocks__/axiosMock";
import { deleteInventoryById } from "../../api/inventory";
import { getWarehouses } from "../../api/warehouse";

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
  getProductsWithInventoryByCategoryId: jest.fn(),
}));

jest.mock("../../api/inventory", () => ({
  deleteInventoryById: jest.fn(),
}));

jest.mock("../../api/warehouse", () => ({
  getWarehouses: jest.fn(),
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
    ]);
    (getProductsWithInventoryByCategoryId as jest.Mock).mockResolvedValue([
      {
        id: 1,
        brand: "SummitKing",
        name: "Peak Performance Climbing Shoes",
        description:
          "High-performance climbing shoes with excellent grip and comfort.",
        price: 129.99,
        category: "Climbing Shoes",
        inventory: [
          { id: 1, product: 1, warehouse: "NY1", size: "42", quantity: 100 },
        ],
      },
    ]);
  });

  test("should display loading state initially", async () => {
    render(
      <MemoryRouter>
        <InventoryByCategory testId="inventory-by-category" />
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
      expect(screen.getByText("Peak Performance Climbing Shoes")).toBeDefined();
      expect(getCategoryById).toHaveBeenCalled();
      expect(getProductsWithInventoryByCategoryId).toHaveBeenCalled();
    });
  });

  test("should display an error if fetching items fails", async () => {
    (getCategoryById as jest.Mock).mockRejectedValue(generateMockAxiosError());

    render(
      <MemoryRouter>
        <InventoryByCategory testId="inventory-by-category" />
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
        <InventoryByCategory testId="inventory-by-category" />
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
      (getProductsWithInventoryByCategoryId as jest.Mock).mockResolvedValue([]);
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
        <InventoryByCategory testId="inventory-by-category" />
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

  test("should render page's breadcrumb with aria-current", async () => {
    render(
      <MemoryRouter>
        <InventoryByCategory testId="inventory-by-category" />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check that the breadcrumb is displayed
      const pageBreadcrumb = screen.getByRole("link", { current: "page" });
      expect(pageBreadcrumb).toBeInTheDocument();
      expect(pageBreadcrumb).toHaveTextContent("Climbing Shoes");
    });
  });
});
