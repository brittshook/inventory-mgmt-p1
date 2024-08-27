import { render, screen } from "@testing-library/react";
import { Warehouses } from "../Warehouses";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/warehouse");

describe("Warehouses Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should display loading state initially", async () => {
    render(
      <MemoryRouter>
        <Warehouses />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeDefined();
  });
});
