import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Products } from "../Products";
import { MemoryRouter } from "react-router-dom";
import {
  getCategories,
  postCategory,
  putCategory,
  deleteCategoryById,
} from "../../api/category";
import userEvent from "@testing-library/user-event";

jest.mock("../../api/category");

describe("Products Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should display loading state initially", () => {
    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  test("should display product categories", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
      { id: 2, name: "Ropes" },
    ]);

    render(
      <MemoryRouter>
        <Products testId="products" />
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

  test("should display an error if fetching product categories fails", async () => {
    (getCategories as jest.Mock).mockRejectedValue(new Error());

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const text = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(text).toBeDefined();
    });
  });

  test("should be able to create categories", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
    ]);

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    let cardsSection: HTMLElement;

    await waitFor(() => {
      cardsSection = screen.getByTestId("category-cards-section");
    });

    await waitFor(() => {
      const addCategoryButton = screen.getByText("Add Category");
      userEvent.click(addCategoryButton);
      const nameField = screen.getByTestId("create-category-name-field");
      userEvent.type(nameField, "Backpacks");
    });

    await waitFor(() => {
      const submitButton = screen.getByText("Create");
      (getCategories as jest.Mock).mockResolvedValue([
        { id: 1, name: "Climbing Shoes" },
        { id: 2, name: "Backpacks" },
      ]);
      userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(postCategory).toHaveBeenCalled();
      expect(cardsSection.children.length).toBe(2);
      expect(within(cardsSection).getByText("Backpacks")).toBeDefined();
    });
  });

  test("should show an error if creating categories fails", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
    ]);
    (postCategory as jest.Mock).mockRejectedValue(new Error());

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const addCategoryButton = screen.getByText("Add Category");
      userEvent.click(addCategoryButton);
      const nameField = screen.getByTestId("create-category-name-field");
      userEvent.type(nameField, "Backpacks");
    });

    await waitFor(() => {
      const submitButton = screen.getByText("Create");
      userEvent.click(submitButton);
    });

    await waitFor(() => {
      const errorText = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(errorText).toBeDefined();
    });
  });

  test("should be able to edit categories", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
    ]);

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      const categoryCard = within(cardsSection).getByTestId("edit-card-button");
      userEvent.click(categoryCard);
      const nameField = screen.getByTestId("edit-category-name-field");
      userEvent.type(nameField, "Penguin Shoes");
      const submitButton = screen.getByText("Save");
      // mock expected new getCategories fetch
      (getCategories as jest.Mock).mockResolvedValue([
        { id: 1, name: "Penguin Shoes" },
      ]);
      userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(putCategory).toHaveBeenCalled();
      expect(screen.getByText("Penguin Shoes")).toBeDefined();
    });
  });

  test("should show an error if editing categories fails", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
    ]);
    (putCategory as jest.Mock).mockRejectedValue(new Error());

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      const categoryCard = within(cardsSection).getByTestId("edit-card-button");
      userEvent.click(categoryCard);
      const nameField = screen.getByTestId("edit-category-name-field");
      userEvent.type(nameField, "Penguin Shoes");
      const submitButton = screen.getByText("Save");
      userEvent.click(submitButton);
    });

    await waitFor(() => {
      const errorText = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(errorText).toBeDefined();
    });
  });

  test("should be able to delete categories", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
    ]);

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      expect(cardsSection).toBeDefined();
    });
    const cardsSection = screen.getByTestId("category-cards-section");
    const ellipsisButton = within(cardsSection).getByTestId(
      "card-ellipsis-button"
    );
    // simulate hover action
    fireEvent.mouseOver(ellipsisButton);

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      // mock expected new getCategories fetch
      (getCategories as jest.Mock).mockResolvedValue([]);
      userEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteCategoryById).toHaveBeenCalled();
      expect(cardsSection.children.length).toBe(0);
    });
  });

  test("should show an error if deleting categories fails", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
    ]);
    (deleteCategoryById as jest.Mock).mockRejectedValue(new Error());

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      expect(cardsSection).toBeDefined();
    });
    const cardsSection = screen.getByTestId("category-cards-section");
    const ellipsisButton = within(cardsSection).getByTestId(
      "card-ellipsis-button"
    );
    // simulate hover action
    fireEvent.mouseOver(ellipsisButton);

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      // mock expected new getCategories fetch
      (getCategories as jest.Mock).mockResolvedValue([]);
      userEvent.click(deleteButton);
    });

    await waitFor(() => {
      const errorText = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(errorText).toBeDefined();
    });
  });
});
