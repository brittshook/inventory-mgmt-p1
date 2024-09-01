import { render, screen, waitFor } from "@testing-library/react";
import { Dashboard } from "../Dashboard";
import { MemoryRouter } from "react-router-dom";
import { getWarehouses } from "../../api/warehouse";

jest.mock("../../api/warehouse");

describe("Dashboard Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should display loading state initially", () => {
    render(
      <MemoryRouter>
        <Dashboard />
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
        <Dashboard />
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
    (getWarehouses as jest.Mock).mockRejectedValue(new Error());

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      const text = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(text).toBeDefined();
    });
  });
});
