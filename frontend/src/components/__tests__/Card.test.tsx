import "@guidepup/jest";
import { render, screen } from "@testing-library/react";
import { Card } from "../card/Card";
import { MemoryRouter } from "react-router-dom";
import { fireEvent } from "@testing-library/react";

describe("Card Component", () => {
  test("renders Card component with title and subtitle", () => {
    render(
      <MemoryRouter>
        <Card
          title="Test Title"
          subtitle="Test Subtitle"
          loaded={false}
          path="/test-path"
          updateItem={jest.fn()}
          deleteItem={jest.fn()}
          id={1}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Title")).toBeDefined();
    expect(screen.getByText("Test Subtitle")).toBeDefined();
  });

  test("opens the edit modal", () => {
    const { getByTestId, queryByRole } = render(
      <MemoryRouter>
        <Card
          title="Test Title"
          subtitle="Test Subtitle"
          loaded={false}
          path="/test-path"
          updateItem={jest.fn()}
          deleteItem={jest.fn()}
          id={1}
          testId="test-card"
        />
      </MemoryRouter>
    );

    // Click the button to open the edit modal
    fireEvent.click(getByTestId("edit-card-button"));

    // Check if the modal is displayed
    expect(queryByRole("dialog")).toBeDefined();
  });

  test("calls the deleteItem function", async () => {
    const deleteItemMock = jest.fn();

    render(
      <MemoryRouter>
        <Card
          title="Test Title"
          subtitle="Test Subtitle"
          loaded={false}
          path="/test-path"
          updateItem={jest.fn()}
          deleteItem={deleteItemMock}
          id={1}
          testId="test-card"
        />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTestId("delete-card-button");
    fireEvent.click(deleteButton);

    // Check if the deleteItem function is called with the correct id
    expect(deleteItemMock).toHaveBeenCalledWith(1);
  });

  test("handles errors with the deleteItem function", async () => {
    const deleteItemMock = jest.fn();
    deleteItemMock.mockRejectedValue(() => new Error());

    render(
      <MemoryRouter>
        <Card
          title="Test Title"
          subtitle="Test Subtitle"
          loaded={false}
          path="/test-path"
          updateItem={jest.fn()}
          deleteItem={deleteItemMock}
          id={1}
          testId="test-card"
        />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTestId("delete-card-button");
    fireEvent.click(deleteButton);

    // Check if the deleteItem function is called with the correct id
    expect(deleteItemMock).toHaveBeenCalledWith(1);

    // Verify that the title of the card is still displayed
    expect(screen.getByText("Test Title")).toBeDefined();
  });

  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    render(
      <MemoryRouter>
        <Card
          title="Test Title"
          subtitle="Test Subtitle"
          loaded={false}
          path="/test-path"
          updateItem={jest.fn()}
          deleteItem={jest.fn()}
          id={1}
        />
      </MemoryRouter>
    );

    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "link, Test Title Test Subtitle",
    "Test Title",
    "paragraph",
    "Test Subtitle",
    "end of paragraph",
    "end of link, Test Title Test Subtitle",
    "list",
    "listitem, level 1, position 1, set size 2",
    "button, Edit Test Title",
    "end of listitem, level 1, position 1, set size 2",
    "listitem, level 1, position 2, set size 2",
    "button, Delete Test Title",
    "end of listitem, level 1, position 2, set size 2",
    "end of list",
    "end of document",
  ]
  `);
  });
});
