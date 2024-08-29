import { render, screen, waitFor } from "@testing-library/react";
import { Products } from "../Products";
import { MemoryRouter } from "react-router-dom";
import { getCategories } from "../../api/category";

jest.mock("../../api/category");

describe("Products Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should display product categories", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
      { id: 2, name: "Ropes" },
    ]);

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      expect(cardsSection.children.length).toBeGreaterThan(0);
      const categoryCardOne = screen.getByText("Climbing Shoes");
      const categoryCardTwo = screen.getByText("Ropes");
      expect(categoryCardOne).toBeDefined();
      expect(categoryCardTwo).toBeDefined();
    });
  });
});
