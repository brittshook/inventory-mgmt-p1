import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "../breadcrumb/Breadcrumb";
import "@testing-library/jest-dom";

describe("Breadcrumb Component", () => {
  test("should render breadcrumb with single item", () => {
    const items = [{ href: "/warehouses", title: "Warehouses" }];

    render(<Breadcrumb items={items} />);

    expect(screen.getByText("Warehouses")).toBeInTheDocument();

    const separators = screen.queryAllByText(">");
    expect(separators.length).toBe(0);
  });

  test("should render breadcrumb with multiple items", () => {
    const items = [
      { href: "/warehouses", title: "Warehouses" },
      { href: "/inventory?warehouse=1", title: "CA1" },
    ];

    render(<Breadcrumb items={items} />);

    expect(screen.getByText("Warehouses")).toBeInTheDocument();
    expect(screen.getByText("CA1")).toBeInTheDocument();

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

    expect(screen.getByTestId("breadcrumb-1")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb-2")).toBeInTheDocument();

    expect(screen.getByText("Warehouses")).toBeInTheDocument();
    expect(screen.getByText("CA1")).toBeInTheDocument();
  });
});
