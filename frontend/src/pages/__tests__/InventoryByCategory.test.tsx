import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InventoryByCategory } from "../InventoryByCategory";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { getCategoryById } from "../../api/category";
import { getProductsWithInventoryByCategoryId } from "../../api/product";
import { deleteInventoryById } from "../../api/inventory";

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
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: "/inventory",
      search: "?category=1",
    });
    (useScreenSize as jest.Mock).mockReturnValue({ isLargerThan1250: true });
    (getCategoryById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Climbing Shoes",
    });
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
      }
    ]);
  });

  test("should display loading state initially", () => {
    render(
      <MemoryRouter>
        <InventoryByCategory />
      </MemoryRouter>
    );

    const spinner = document.querySelector(".ant-spin");
    expect(spinner).toBeInTheDocument();
  });

  test("should display inventory by category page", async () => {
    render(
      <MemoryRouter>
        <InventoryByCategory />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Peak Performance Climbing Shoes")).toBeDefined();
      expect(getCategoryById).toHaveBeenCalled();
      expect(getProductsWithInventoryByCategoryId).toHaveBeenCalled();
    });
  });

  test("should display an error if fetching items fails", async () => {
    (getCategoryById as jest.Mock).mockRejectedValue(
      new Error()
    );

    render(
      <MemoryRouter>
        <InventoryByCategory />
      </MemoryRouter>
    );
    await waitFor(() => {
      const text = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(text).toBeInTheDocument();
    });
  });

  test("should be able to delete inventory", async () => {

    render(
      <MemoryRouter>
        <InventoryByCategory />
      </MemoryRouter>
    );

    await waitFor(() => {
      // index-based (not id!)
      const deleteButton = screen.getByTestId("delete-inventory-0");
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      const confirmDeleteButton = screen.getByTestId("confirm-delete-inventory-0");
      (getProductsWithInventoryByCategoryId as jest.Mock).mockResolvedValue([]);
      fireEvent.click(confirmDeleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText("No data")).toBeDefined();
      expect(deleteInventoryById).toHaveBeenCalled();
    });
  });

  test("should show an error if deleting inventory fails", async () => {
    (deleteInventoryById as jest.Mock).mockRejectedValue(
      new Error()
    );

    render(
      <MemoryRouter>
        <InventoryByCategory />
      </MemoryRouter>
    );

    await waitFor(() => {
      // index-based (not id!)
      const deleteButton = screen.getByTestId("delete-inventory-0");
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      const confirmDeleteButton = screen.getByTestId("confirm-delete-inventory-0");
      fireEvent.click(confirmDeleteButton);
    });

    await waitFor(() => {
      const text = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(text).toBeInTheDocument();
      expect(deleteInventoryById).toHaveBeenCalled();
    });
  });
});
