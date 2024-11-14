import "@testing-library/jest-dom";
import "@guidepup/jest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "../breadcrumb/Breadcrumb";

describe("Breadcrumb Component", () => {
  test("should render breadcrumb with single item", () => {
    const items = [{ href: "/warehouses", title: "Warehouses" }];

    render(<Breadcrumb items={items} />);

    // Check that the item "Warehouses" is present
    expect(screen.getByText("Warehouses")).toBeInTheDocument();

    // Check that no separators (">") are present
    const separators = screen.queryAllByText(">");
    expect(separators.length).toBe(0);
  });

  test("should render breadcrumb with multiple items", () => {
    const items = [
      { href: "/warehouses", title: "Warehouses" },
      { href: "/inventory?warehouse=1", title: "CA1" },
    ];

    render(<Breadcrumb items={items} />);

    // Check that both items "Warehouses" and "CA1" are present
    expect(screen.getByText("Warehouses")).toBeInTheDocument();
    expect(screen.getByText("CA1")).toBeInTheDocument();

    // Check that 1 separator (">") is present
    const separators = screen.getAllByText(">");
    expect(separators.length).toBe(1);
  });

  test("should render breadcrumb with React elements", () => {
    const items = [
      {
        href: "/warehouse",
        title: <div data-testid="breadcrumb-1">Warehouses</div>,
      },
      {
        href: "/inventory?warehouse=1",
        title: <div data-testid="breadcrumb-2">CA1</div>,
      },
    ];

    render(<Breadcrumb items={items} />);

    // Check that the elements are present using their test ids
    expect(screen.getByTestId("breadcrumb-1")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb-2")).toBeInTheDocument();

    // Check that the item texts "Warehouse" and "CA1" are present
    expect(screen.getByText("Warehouses")).toBeInTheDocument();
    expect(screen.getByText("CA1")).toBeInTheDocument();
  });


  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    const items = [
      { href: "/warehouses", title: "Warehouses" },
      { href: "/inventory?warehouse=1", title: "CA1" },
    ];

    render(<Breadcrumb items={items} />);

    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "navigation, breadcrumb",
    "list",
    "listitem, level 1, position 1, set size 2",
    "link, Warehouses",
    "end of listitem, level 1, position 1, set size 2",
    "listitem, level 1, position 2, set size 2",
    "link, CA1",
    "end of listitem, level 1, position 2, set size 2",
    "end of list",
    "end of navigation, breadcrumb",
    "end of document",
  ]
  `);
  });
});
