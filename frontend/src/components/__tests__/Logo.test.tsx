import { render, screen } from "@testing-library/react";
import { Logo } from "../Logo";
import "@testing-library/jest-dom";

describe("Logo Component", () => {
  test("should render full length logo if type prop is 'full'", () => {
    render(<Logo testId="logo" type="full" />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("logo")).toHaveAttribute("id", "full-logo");
  });

  test("should render short length logo if type prop is 'short'", () => {
    render(<Logo testId="logo" type="short" />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("logo")).toHaveAttribute("id", "short-logo");
  });
});
