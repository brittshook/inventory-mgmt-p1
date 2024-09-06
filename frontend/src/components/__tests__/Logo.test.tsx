import { render, screen } from "@testing-library/react";
import { Logo } from "../logo/Logo";
import "@testing-library/jest-dom";

describe("Logo Component", () => {
  test("should render full form logo if type prop is 'full'", () => {
    render(<Logo testId="logo" type="full" />);

    // Check if the logo element is present in the document
    expect(screen.getByTestId("logo")).toBeInTheDocument();

    // Check if the logo id is 'full-logo'
    expect(screen.getByTestId("logo")).toHaveAttribute("id", "full-logo");
  });

  test("should render short form logo if type prop is 'short'", () => {
    render(<Logo testId="logo" type="short" />);

    // Check if the logo element is present in the document
    expect(screen.getByTestId("logo")).toBeInTheDocument();

    // Check if the logo id is 'short-logo'
    expect(screen.getByTestId("logo")).toHaveAttribute("id", "short-logo");
  });
});
