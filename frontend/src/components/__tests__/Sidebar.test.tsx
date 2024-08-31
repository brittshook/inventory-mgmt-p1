import { render, screen } from "@testing-library/react";
import { useScreenSize } from "../../context/ScreenSizeContext";
import "@testing-library/jest-dom";
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
    const sidebar = document.querySelector("aside");
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
    const sidebar = document.querySelector("aside");
    expect(sidebar).toHaveClass("expanded");
  });

  test("should display sublist under Products when on products or inventory category page", () => {
    (useScreenSize as jest.Mock).mockReturnValue({ isSmallerThan900: false });
    (useLocation as jest.Mock).mockReturnValue({
      pathname: "/products",
      search: "?category=1",
    });

    render(
      <MemoryRouter>
        <Sidebar testId="sidebar" />
      </MemoryRouter>
    );

    // Verify Inventory sub-link is displayed
    expect(screen.getByText("Inventory")).toBeInTheDocument();
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
    expect(screen.getByAltText("profile")).toBeInTheDocument();
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
});
