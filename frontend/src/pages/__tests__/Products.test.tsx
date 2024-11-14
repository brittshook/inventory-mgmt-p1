import "@testing-library/jest-dom";
import "@guidepup/jest";
import {
  findByTestId,
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
import { generateMockAxiosError } from "../../test/__mocks__/axiosMock";

// Mock API call
jest.mock("../../api/category");

describe("Products Page", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("should display loading state initially", () => {
    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    // Check for loading indicator
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
      // Cards should be displayed
      expect(cardsSection.children.length).toBeGreaterThan(0);
      // Check for categories by text
      const categoryCardOne = screen.getByText("Climbing Shoes");
      const categoryCardTwo = screen.getByText("Ropes");
      expect(categoryCardOne).toBeDefined();
      expect(categoryCardTwo).toBeDefined();
    });
  });

  test("should display an error if fetching product categories fails", async () => {
    (getCategories as jest.Mock).mockRejectedValue(generateMockAxiosError());

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    // Check error overlay is displayed
    const container = await screen.findByTestId("products");
    expect(await findByTestId(container, "error-overlay")).toBeInTheDocument();
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

    // Click "Add Category" button and fill in form
    await waitFor(() => {
      const addCategoryButton = screen.getByText("Add Category");
      userEvent.click(addCategoryButton);
      const nameField = screen.getByTestId("create-category-name-field");
      userEvent.type(nameField, "Backpacks");
    });

    // Submit form and mock API response
    await waitFor(() => {
      const submitButton = screen.getByText("Create");
      (getCategories as jest.Mock).mockResolvedValue([
        { id: 1, name: "Climbing Shoes" },
        { id: 2, name: "Backpacks" },
      ]);
      userEvent.click(submitButton);
    });

    // Verify create function was called and card to be visible
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
    (postCategory as jest.Mock).mockRejectedValue(generateMockAxiosError());

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    // Click "Add Category" button and fill in form
    await waitFor(() => {
      const addCategoryButton = screen.getByText("Add Category");
      userEvent.click(addCategoryButton);
      const nameField = screen.getByTestId("create-category-name-field");
      userEvent.type(nameField, "Backpacks");
    });

    // Submit form
    await waitFor(() => {
      const submitButton = screen.getByText("Create");
      userEvent.click(submitButton);
    });

    // Check error overlay is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
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

    // Click edit button on a card, fill and submit form
    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      const categoryCard = within(cardsSection).getByTestId("edit-card-button");
      userEvent.click(categoryCard);
      const nameField = screen.getByTestId("edit-category-name-field");
      userEvent.type(nameField, "Penguin Shoes");
      const submitButton = screen.getByText("Save");
      // Mock API response
      (getCategories as jest.Mock).mockResolvedValue([
        { id: 1, name: "Penguin Shoes" },
      ]);
      userEvent.click(submitButton);
    });

    // Verify update function was called and card is visible
    await waitFor(() => {
      expect(putCategory).toHaveBeenCalled();
      expect(screen.getByText("Penguin Shoes")).toBeDefined();
    });
  });

  test("should show an error if editing categories fails", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
    ]);
    (putCategory as jest.Mock).mockRejectedValue(generateMockAxiosError());

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    // Click edit button on a card, fill and submit form
    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      const categoryCard = within(cardsSection).getByTestId("edit-card-button");
      userEvent.click(categoryCard);
      const nameField = screen.getByTestId("edit-category-name-field");
      userEvent.type(nameField, "Penguin Shoes");
      const submitButton = screen.getByText("Save");
      userEvent.click(submitButton);
    });

    // Check error overlay is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
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

    // Click delete button on a card
    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      expect(cardsSection).toBeDefined();
    });
    const cardsSection = screen.getByTestId("category-cards-section");
    const deleteButton = within(cardsSection).getByTestId(
      "delete-card-button"
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      // mock expected new getCategories fetch
      (getCategories as jest.Mock).mockResolvedValue([]);
    });

    // Verify delete function was called and card is not visible
    await waitFor(() => {
      expect(deleteCategoryById).toHaveBeenCalled();
      expect(cardsSection.children.length).toBe(0);
    });
  });

  test("should show an error if deleting categories fails", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
    ]);
    (deleteCategoryById as jest.Mock).mockRejectedValue(
      generateMockAxiosError()
    );

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    // Click delete button on a card
    await waitFor(() => {
      const cardsSection = screen.getByTestId("category-cards-section");
      expect(cardsSection).toBeDefined();
    });
    const cardsSection = screen.getByTestId("category-cards-section");
    const deleteButton = within(cardsSection).getByTestId(
      "delete-card-button"
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      // mock expected new getCategories fetch
      (getCategories as jest.Mock).mockResolvedValue([]);
    });

    // Check error overlay is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });

  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    (getCategories as jest.Mock).mockResolvedValue([
      { id: 1, name: "Climbing Shoes" },
      { id: 2, name: "Ropes" },
    ]);

    render(
      <MemoryRouter>
        <Products testId="products" />
      </MemoryRouter>
    );

    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "region",
    "heading, Products, level 1",
    "button, Add Category",
    "region",
    "link, Climbing Shoes",
    "Climbing Shoes",
    "paragraph",
    "end of link, Climbing Shoes",
    "list",
    "listitem, level 1, position 1, set size 2",
    "button, Edit Climbing Shoes category",
    "end of listitem, level 1, position 1, set size 2",
    "listitem, level 1, position 2, set size 2",
    "button, Delete Climbing Shoes category",
    "end of listitem, level 1, position 2, set size 2",
    "end of list",
    "link, Ropes",
    "Ropes",
    "paragraph",
    "end of link, Ropes",
    "list",
    "listitem, level 1, position 1, set size 2",
    "button, Edit Ropes category",
    "end of listitem, level 1, position 1, set size 2",
    "listitem, level 1, position 2, set size 2",
    "button, Delete Ropes category",
    "end of listitem, level 1, position 2, set size 2",
    "end of list",
    "end of region",
    "end of region",
    "end of document",
  ]
  `);
  });
});
