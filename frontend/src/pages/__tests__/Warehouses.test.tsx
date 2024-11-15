import "@testing-library/jest-dom";
import "@guidepup/jest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Warehouses } from "../Warehouses";
import { MemoryRouter } from "react-router-dom";
import {
  deleteWarehouseById,
  getWarehouses,
  putWarehouse,
} from "../../api/warehouse";
import userEvent from "@testing-library/user-event";
import { generateMockAxiosError } from "../../test/__mocks__/axiosMock";

// Mock API call
jest.mock("../../api/warehouse");

describe("Warehouses Page", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test data
  const testWarehouse1 = {
    id: 1,
    name: "DC1",
    maxCapacity: 1000,
    streetAddress: "5454 Reno Road NW",
    city: "Washington",
    state: "DC",
    zipCode: "20008",
  };

  const testWarehouse2 = {
    id: 2,
    name: "NY1",
    maxCapacity: 500,
    streetAddress: "123 Main Street",
    city: "NY",
    state: "New York",
    zipCode: "10001",
  };

  test("should display loading state initially", async () => {
    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    // Check for loading indicator
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  test("should display an error if fetching warehouses fails", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);
    (getWarehouses as jest.Mock).mockRejectedValue(generateMockAxiosError());

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    // Check error overlay is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });

  // Helper function to fill the warehouse form fields
  const fillWarehouseForm = async () => {
    await waitFor(() => {
      const nameField = screen.getByTestId("warehouse-modal-name-field");
      userEvent.type(nameField, testWarehouse2.name);
    });
    await waitFor(() => {
      const maxCapacityField = screen.getByTestId(
        "warehouse-modal-max-capacity-field"
      );
      userEvent.type(maxCapacityField, String(testWarehouse2.maxCapacity));
    });
    await waitFor(() => {
      const streetAddressField = screen.getByTestId(
        "warehouse-modal-street-address-field"
      );
      userEvent.type(streetAddressField, testWarehouse2.streetAddress);
    });
    await waitFor(() => {
      const cityField = screen.getByTestId("warehouse-modal-city-field");
      userEvent.type(cityField, testWarehouse2.city);
    });
    await waitFor(() => {
      const stateSelect = screen.getByTestId("warehouse-modal-state-select");
      const stateSelectInput = stateSelect!.querySelector("input");
      fireEvent.change(stateSelectInput!, {
        target: {
          value: "NY",
        },
      });
    });
    await waitFor(() => {
      const zipCodeField = screen.getByTestId("warehouse-modal-zip-code-field");
      userEvent.type(zipCodeField, testWarehouse2.zipCode);
    });
  };

  test("should be able to edit warehouses", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    // Click edit button on card
    await waitFor(() => {
      const cardsSection = screen.getByTestId("warehouse-cards-section");
      const warehouseCardEditButton =
        within(cardsSection).getByTestId("edit-card-button");
      userEvent.click(warehouseCardEditButton);
    });

    // Mock API response after editing
    (getWarehouses as jest.Mock).mockResolvedValue([
      { ...testWarehouse2, id: 1 },
    ]);

    await fillWarehouseForm();
    const submitButton = screen.getByText("Save");
    userEvent.click(submitButton);

    // Verify update function was called and updated name visible
    await waitFor(() => {
      expect(putWarehouse).toHaveBeenCalled();
      expect(screen.getByText("Warehouse NY1")).toBeDefined();
    });
  });

  test("should show an error if editing warehouses fails", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);
    (putWarehouse as jest.Mock).mockRejectedValue(generateMockAxiosError());

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    // Click edit button, fill and submit form
    await waitFor(() => {
      const cardsSection = screen.getByTestId("warehouse-cards-section");
      const warehouseCardEditButton =
        within(cardsSection).getByTestId("edit-card-button");
      userEvent.click(warehouseCardEditButton);
    });
    await fillWarehouseForm();
    const submitButton = screen.getByText("Save");
    userEvent.click(submitButton);

    // Check error overlay is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();
    });
  });

  test("should be able to delete warehouses", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cardsSection = screen.getByTestId("warehouse-cards-section");
      expect(cardsSection).toBeDefined();
    });
    const cardsSection = screen.getByTestId("warehouse-cards-section");
    const deleteButton = within(cardsSection).getByTestId(
      "delete-card-button"
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      // mock expected new getWarehouses fetch
      (getWarehouses as jest.Mock).mockResolvedValue([]);
    });

    await waitFor(() => {
      expect(deleteWarehouseById).toHaveBeenCalled();
      expect(cardsSection.children.length).toBe(0);
    });
  });

  test("should show an error if deleting warehouses fails", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);
    (deleteWarehouseById as jest.Mock).mockRejectedValue(
      generateMockAxiosError()
    );

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cardsSection = screen.getByTestId("warehouse-cards-section");
      expect(cardsSection).toBeDefined();
    });
    const cardsSection = screen.getByTestId("warehouse-cards-section");
    const deleteButton = within(cardsSection).getByTestId(
      "delete-card-button"
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      // mock expected new getWarehouses fetch
      (getWarehouses as jest.Mock).mockResolvedValue([]);
    });

    await waitFor(() => {
      // Check error overlay is displayed
      expect(screen.getByTestId("error-overlay")).toBeInTheDocument();

      // Verify delete function was called
      expect(deleteWarehouseById).toHaveBeenCalled();

      // Verify card was removed as child
      expect(cardsSection.children).toHaveLength(1);
    });
  });


  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "region",
    "heading, Warehouses, level 1",
    "button, Add Warehouse",
    "region",
    "link, Warehouse DC1 Washington, DC",
    "Warehouse DC1",
    "paragraph",
    "Washington, DC",
    "end of paragraph",
    "end of link, Warehouse DC1 Washington, DC",
    "list",
    "listitem, level 1, position 1, set size 2",
    "button, Edit Warehouse DC1",
    "end of listitem, level 1, position 1, set size 2",
    "listitem, level 1, position 2, set size 2",
    "button, Delete Warehouse DC1",
    "end of listitem, level 1, position 2, set size 2",
    "end of list",
    "end of region",
    "end of region",
    "end of document",
  ]
  `);
  });
});
