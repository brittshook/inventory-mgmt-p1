import { render, screen } from "@testing-library/react";
import { Products } from "../Products";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/product");

describe("Products Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should display loading state initially", async () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeDefined();
  });
});
