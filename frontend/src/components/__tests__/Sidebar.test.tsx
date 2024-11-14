import "@testing-library/jest-dom";
import "@guidepup/jest";
import { render, screen } from "@testing-library/react";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";

// Set up mocks
jest.mock("../../context/ScreenSizeContext", () => ({
  useScreenSize: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useLocation as jest.Mock).mockReturnValue({
      pathname: "/",
      search: "",
    });
  });

  test("should display the full logo when screen is larger than 900px", () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: false });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );

    // Verify full-form logo is displayed
    const logo = document.querySelector("#full-logo");
    expect(logo).toBeInTheDocument();
  });

  test("should display the short logo when screen is smaller than 900px", () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: true });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );

    // Verify short-form logo is displayed
    const logo = document.querySelector("#short-logo");
    expect(logo).toBeInTheDocument();
  });

  test("should display collapsed sidebar when screen is smaller than 900px", () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: true });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );

    // Verify sidebar is in collapsed state
    const sidebar = document.querySelector("nav");
    expect(sidebar).toHaveClass("collapsed");
  });

  test("should display expanded sidebar when screen is larger than 900px", () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: false });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );

    // Verify sidebar is in expanded state
    const sidebar = document.querySelector("nav");
    expect(sidebar).toHaveClass("expanded");
  });

  test("should display user details when screen is larger than 900px", () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: false });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );

    // Verify user details are displayed
    expect(screen.getByText("Jo Klein")).toBeInTheDocument();
    expect(screen.getByText("Administrator")).toBeInTheDocument();
    expect(screen.getByAltText("profile picture")).toBeInTheDocument();
  });

  test("should not display user details when screen is smaller than 900px", () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: true });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );

    // Verify user details are not displayed
    expect(screen.queryByText("Jo Klein")).not.toBeInTheDocument();
    expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
  });

  test("should display all inventory icon & link when screen is smaller than 900px", () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: true });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );

    // Verify Inventory icon is displayed
    expect(screen.getByAltText("inventory")).toBeInTheDocument();
  });

  test("should match the inline snapshot of expected screen reader spoken phrases when screen is larger than 900px", async () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: false });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );
    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "navigation",
    "link, Crag Supply Co.",
    "banner",
    "image, Crag Supply Co.",
    "end of banner",
    "end of link, Crag Supply Co.",
    "heading, General, level 2",
    "menubar, orientated horizontally",
    "menuitem, Dashboard, position 1, set size 4",
    "Dashboard",
    "end of menuitem, Dashboard, position 1, set size 4",
    "menuitem, Products, position 2, set size 4",
    "Products",
    "end of menuitem, Products, position 2, set size 4",
    "menuitem, Warehouses, position 3, set size 4",
    "Warehouses",
    "end of menuitem, Warehouses, position 3, set size 4",
    "menuitem, Inventory, position 4, set size 4",
    "Inventory",
    "end of menuitem, Inventory, position 4, set size 4",
    "end of menubar, orientated horizontally",
    "image, profile picture",
    "heading, Jo Klein, level 3",
    "paragraph",
    "Administrator",
    "end of paragraph",
    "image, Logout",
    "end of navigation",
    "end of document",
  ]
  `);
  });

  test("should match the inline snapshot of expected screen reader spoken phrases when screen is smaller than 900px", async () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: true });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );
    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "navigation",
    "link, Crag Supply Co.",
    "banner",
    "image, Crag Supply Co.",
    "end of banner",
    "end of link, Crag Supply Co.",
    "menubar, orientated horizontally",
    "menuitem, dashboard, position 1, set size 4",
    "image, dashboard",
    "end of menuitem, dashboard, position 1, set size 4",
    "menuitem, products, position 2, set size 4",
    "image, products",
    "end of menuitem, products, position 2, set size 4",
    "menuitem, warehouses, position 3, set size 4",
    "image, warehouses",
    "end of menuitem, warehouses, position 3, set size 4",
    "menuitem, inventory, position 4, set size 4",
    "image, inventory",
    "end of menuitem, inventory, position 4, set size 4",
    "end of menubar, orientated horizontally",
    "image, Logout",
    "end of navigation",
    "end of document",
  ]
  `);
  });
});
