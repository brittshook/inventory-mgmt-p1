import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "../breadcrumb/Breadcrumb";
import "@testing-library/jest-dom";

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
});
