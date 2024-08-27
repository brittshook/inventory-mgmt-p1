import { render, screen } from "@testing-library/react";
import { Button } from "../Button";
import "@testing-library/jest-dom";

describe("Button Component", () => {
  test("should render button with children text", () => {
    render(<Button testId="test-button">Click me</Button>);
    expect(screen.getByTestId("test-button")).toBeInTheDocument();
    expect(screen.getByTestId("test-button")).toHaveTextContent("Click me");
  });

  test("should apply primary type correctly", () => {
    render(
      <Button testId="test-button" type="primary">
        Primary Button
      </Button>
    );
    expect(screen.getByTestId("test-button")).toHaveClass("ant-btn-primary");
  });

  test("should not apply primary type if not specified", () => {
    render(<Button testId="test-button">Default Button</Button>);
    expect(screen.getByTestId("test-button")).not.toHaveClass("ant-btn-primary");
  });

  test("should be disabled if disabled prop is true", () => {
    render(
      <Button testId="test-button" disabled={true}>
        Disabled Button
      </Button>
    );
    expect(screen.getByTestId("test-button")).toBeDisabled();
  });

  test("should not be disabled if disabled prop is false", () => {
    render(
      <Button testId="test-button" disabled={false}>
        Enabled Button
      </Button>
    );
    expect(screen.getByTestId("test-button")).not.toBeDisabled();
  });
});
