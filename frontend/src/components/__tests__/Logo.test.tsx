import { render, screen } from "@testing-library/react";
import { Logo } from "../Logo";
// import "@testing-library/jest-dom"; 

describe("Logo Component", () => {
  test("should render full length logo if type prop is 'full'", () => {
    render(<Logo type="full" />);
    const logoImage = screen.getByTestId("logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "logo.webp");
  });

  test("should render short length logo if type prop is 'short'", () => {
    render(<Logo type="short" />);
    const logoImage = screen.getByTestId("logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "short_logo.webp");
  });
});
