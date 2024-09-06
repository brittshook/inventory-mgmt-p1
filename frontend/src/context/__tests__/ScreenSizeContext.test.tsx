import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/";
import { ScreenSizeProvider, useScreenSize } from "../ScreenSizeContext";

// Mock component that uses the screen size context
const TestComponent = () => {
  const { isLargerThan1250, isSmallerThan900 } = useScreenSize();

  return (
    <div>
      <div data-testid="larger-than-1250">
        {isLargerThan1250
          ? "Screen is larger than 1250px"
          : "Screen is not larger than 1250px"}
      </div>
      <div data-testid="smaller-than-900">
        {isSmallerThan900
          ? "Screen is smaller than 900px"
          : "Screen is not smaller than 900px"}
      </div>
    </div>
  );
};

describe("Screen Size Provider", () => {
  test("should display correct size information when the screen is larger than 1250px", () => {
    window.innerWidth = 1300; // Mock window width
    render(
      <ScreenSizeProvider>
        <TestComponent />
      </ScreenSizeProvider>
    );

    // Check correct content based on mocked screen size
    expect(screen.getByTestId("larger-than-1250")).toHaveTextContent(
      "Screen is larger than 1250px"
    );
    expect(screen.getByTestId("smaller-than-900")).toHaveTextContent(
      "Screen is not smaller than 900px"
    );
  });

  test("should display correct size information when the screen is smaller than 900px", () => {
    window.innerWidth = 800; // Mock window width
    render(
      <ScreenSizeProvider>
        <TestComponent />
      </ScreenSizeProvider>
    );

    // Check correct content based on mocked screen size
    expect(screen.getByTestId("larger-than-1250")).toHaveTextContent(
      "Screen is not larger than 1250px"
    );
    expect(screen.getByTestId("smaller-than-900")).toHaveTextContent(
      "Screen is smaller than 900px"
    );
  });

  test("should display correct size information when the screen is between 900px and 1250px", () => {
    window.innerWidth = 1000; // Mock window width
    render(
      <ScreenSizeProvider>
        <TestComponent />
      </ScreenSizeProvider>
    );

    // Check correct content based on mocked screen size
    expect(screen.getByTestId("larger-than-1250")).toHaveTextContent(
      "Screen is not larger than 1250px"
    );
    expect(screen.getByTestId("smaller-than-900")).toHaveTextContent(
      "Screen is not smaller than 900px"
    );
  });

  test("should display correct size information when the screen is between 900px and 1250px", () => {
    window.innerWidth = 1000; // Mock window width
    render(
      <ScreenSizeProvider>
        <TestComponent />
      </ScreenSizeProvider>
    );

    // Check correct content based on mocked screen size
    expect(screen.getByTestId("larger-than-1250")).toHaveTextContent(
      "Screen is not larger than 1250px"
    );
    expect(screen.getByTestId("smaller-than-900")).toHaveTextContent(
      "Screen is not smaller than 900px"
    );
  });

  test("should throw an error when useScreenSize is used outside of ScreenSizeProvider", () => {
    const TestComponentWithoutProvider = () => {
      useScreenSize(); // This should trigger the error
      return <div>Test</div>;
    };

    // Expect the error to be thrown when rendering TestComponentWithoutProvider
    expect(() => render(<TestComponentWithoutProvider />)).toThrow(
      "useScreenSize must be used within a ScreenSizeProvider"
    );
  });
});
