import "@testing-library/jest-dom";
import "@guidepup/jest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ButtonWithModal } from "../ButtonWithModal";
import { FormInstance, Input } from "antd";

describe("Button with modal component ", () => {
  // Mock functions and partial form instance for testing
  const mockConfirmHandler = jest.fn().mockResolvedValue(undefined);
  const mockFormInstance: Partial<FormInstance<any>> = {
    validateFields: jest.fn().mockResolvedValue({}),
    resetFields: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("opens the modal when the button is clicked", () => {
    render(
      <ButtonWithModal
        title="Test Modal"
        buttonText="Open Modal"
        modalButtonText="Save"
        confirmHandler={mockConfirmHandler}
        form={mockFormInstance as FormInstance<any>}
        children={<Input name="testInput" />}
      />
    );

    // Click button to open the modal
    const button = screen.getByText("Open Modal");
    fireEvent.click(button);

    // Verify modal is displayed
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  test("calls confirm handler with the correct values on confirm", async () => {
    const mockValues = { testInput: "value" };
    (mockFormInstance.validateFields as jest.Mock).mockResolvedValue(
      mockValues
    );

    render(
      <ButtonWithModal
        title="Test Modal"
        buttonText="Open Modal"
        modalButtonText="Save"
        confirmHandler={mockConfirmHandler}
        form={mockFormInstance as FormInstance<any>}
        children={<Input name="testInput" />}
        setCategory="Climbing Shoes"
        setWarehouse="CA1"
        recordId={30}
      />
    );

    // Click button to open the modal
    const button = screen.getByText("Open Modal");
    fireEvent.click(button);

    // Click Save button in the modal
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    // Verify confirm handler is called with the expected values
    await waitFor(() => {
      expect(mockConfirmHandler).toHaveBeenCalledWith({
        ...mockValues,
        categoryName: "Climbing Shoes",
        warehouseName: "CA1",
        id: 30,
      });
    });

    // Verify the form fields are reset and the modal is closed
    expect(mockFormInstance.resetFields).toHaveBeenCalled();
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  test("closes the modal and resets fields on cancel", () => {
    render(
      <ButtonWithModal
        title="Test Modal"
        buttonText="Open Modal"
        modalButtonText="Save"
        confirmHandler={mockConfirmHandler}
        form={mockFormInstance as FormInstance<any>}
        children={<Input name="testInput" />}
      />
    );

    // Click button to open the modal
    const button = screen.getByText("Open Modal");
    fireEvent.click(button);

    // Click Cancel button in the modal
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Verify the form fields are reset and the modal is closed
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
    expect(mockFormInstance.resetFields).toHaveBeenCalled();
  });

  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    render(
      <ButtonWithModal
        title="Test Modal"
        buttonText="Open Modal"
        modalButtonText="Save"
        confirmHandler={mockConfirmHandler}
        form={mockFormInstance as FormInstance<any>}
        children={<Input name="testInput" />}
      />
    );
    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "button, Open Modal",
    "end of document",
  ]
  `);
  });
});
