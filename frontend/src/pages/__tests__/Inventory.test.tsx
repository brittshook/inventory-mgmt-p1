import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Inventory } from "../Inventory";
import { useLocation } from "react-router-dom";

// Set up mocks
jest.mock("../InventoryByWarehouse", () => ({
  InventoryByWarehouse: () => <div>Mocked InventoryByWarehouse</div>,
}));
jest.mock("../InventoryByCategory", () => ({
  InventoryByCategory: () => <div>Mocked InventoryByCategory</div>,
}));
jest.mock("../AllInventory", () => ({
  AllInventory: () => <div>Mocked AllInventory</div>,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("Inventory Component", () => {
  afterEach(() => {
    // Reset mocks after each test
    jest.clearAllMocks();
  });

  test("should render InventoryByWarehouse when query string contains 'warehouse'", () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: "?warehouse=1",
    });

    render(<Inventory />);

    expect(screen.getByText("Mocked InventoryByWarehouse")).toBeInTheDocument();
  });

  test("should render InventoryByCategory when query string contains 'category'", () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: "?category=2",
    });

    render(<Inventory />);

    expect(screen.getByText("Mocked InventoryByCategory")).toBeInTheDocument();
  });

  test("should render AllInventory when query string does not match any pattern", () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: "?invalid=3",
    });

    render(<Inventory />);

    expect(screen.getByText("Mocked AllInventory")).toBeInTheDocument();
  });

  test("should render AllInventory when there is no query string", () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: "",
    });

    render(<Inventory />);

    expect(screen.getByText("Mocked AllInventory")).toBeInTheDocument();
  });
});
