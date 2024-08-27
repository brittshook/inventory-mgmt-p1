import { render, screen } from "@testing-library/react";
import { Dashboard } from "../Dashboard";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/inventory");
jest.mock("../../api/warehouse");

describe("Dashboard Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should display loading state initially", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeDefined();
  });

  test("should display total inventory and total capacity", async () => {});

  test("should display 'N/A' if API calls fail", async () => {});
});
