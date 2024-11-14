import "@testing-library/jest-dom";
import "@guidepup/jest";
import { render, screen, waitFor } from "@testing-library/react";
import { Dashboard } from "../Dashboard";
import { MemoryRouter } from "react-router-dom";
import { getWarehouses } from "../../api/warehouse";
import { generateMockAxiosError } from "../../test/__mocks__/axiosMock";

// Mock API call
jest.mock("../../api/warehouse");

describe("Dashboard Page", () => {
  afterEach(() => {
    // Reset mocks after each test
    jest.clearAllMocks();
  });

  test("should display loading state initially", () => {
    render(
      <MemoryRouter>
        <Dashboard testId="dashboard" />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  test("should display total inventory and total capacity", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([
      { id: 1, name: "Warehouse 1", maxCapacity: 100, currentCapacity: 10 },
      { id: 2, name: "Warehouse 2", maxCapacity: 200, currentCapacity: 5 },
    ]);

    render(
      <MemoryRouter>
        <Dashboard testId="dashboard" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const text15 = screen.getByText("15");
      expect(text15).toBeDefined();
      const text300 = screen.getByText("300");
      expect(text300).toBeDefined();
    });
  });

  test("should display error if API calls fail", async () => {
    (getWarehouses as jest.Mock).mockRejectedValue(generateMockAxiosError());

    render(
      <MemoryRouter>
        <Dashboard testId="dashboard" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });

  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([
      { id: 1, name: "Warehouse 1", maxCapacity: 100, currentCapacity: 10 },
      { id: 2, name: "Warehouse 2", maxCapacity: 200, currentCapacity: 5 },
    ]);

    render(
      <MemoryRouter>
        <Dashboard testId="dashboard" />
      </MemoryRouter>
    );

    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "region",
    "heading, Dashboard, level 1",
    "Total Items in Inventory",
    "heading, 15, level 1",
    "Total Max Capacity",
    "heading, 300, level 1",
    "end of region",
    "end of document",
  ]
  `);
  });
});
