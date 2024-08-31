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

jest.mock("../../api/warehouse");

describe("Warehouses Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testWarehouse1 = {
    id: 1,
    name: "DC1",
    maxCapacity: 1000,
    streetAddress: "5454 Reno Road NW",
    city: "D.C.",
    state: "Washington",
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

    expect(screen.getByText("Loading...")).toBeDefined();
  });

  test("should display an error if fetching warehouses fails", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);
    (getWarehouses as jest.Mock).mockRejectedValue(new Error());

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const text = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(text).toBeDefined();
    });
  });

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

    await waitFor(() => {
      const cardsSection = screen.getByTestId("warehouse-cards-section");
      const warehouseCardEditButton =
        within(cardsSection).getByTestId("edit-card-button");
      userEvent.click(warehouseCardEditButton);
    });
    // mock expected new getWarehouses fetch
    (getWarehouses as jest.Mock).mockResolvedValue([
      { ...testWarehouse2, id: 1 },
    ]);
    await fillWarehouseForm();
    const submitButton = screen.getByText("Save");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(putWarehouse).toHaveBeenCalled();
      expect(screen.getByText("Warehouse NY1")).toBeDefined();
    });
  });

  test("should show an error if editing warehouses fails", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);
    (putWarehouse as jest.Mock).mockRejectedValue(new Error());

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const cardsSection = screen.getByTestId("warehouse-cards-section");
      const warehouseCardEditButton =
        within(cardsSection).getByTestId("edit-card-button");
      userEvent.click(warehouseCardEditButton);
    });
    await fillWarehouseForm();
    const submitButton = screen.getByText("Save");
    userEvent.click(submitButton);

    await waitFor(() => {
      const errorText = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(errorText).toBeDefined();
    });
  });

  test("should be able to delete warehouses", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    let cardsSection: HTMLElement;
    await waitFor(() => {
      cardsSection = screen.getByTestId("warehouse-cards-section");
      expect(cardsSection).toBeDefined();
    });

    await waitFor(() => {
      const ellipsisButton = within(cardsSection!).getByTestId(
        "card-ellipsis-button"
      );
      // simulate hover action
      fireEvent.mouseOver(ellipsisButton);
    });

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      // mock expected new getWarehouses fetch
      (getWarehouses as jest.Mock).mockResolvedValue([]);
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(deleteWarehouseById).toHaveBeenCalled();
      expect(cardsSection.children.length).toBe(0);
    });
  });

  test("should show an error if deleting warehouses fails", async () => {
    (getWarehouses as jest.Mock).mockResolvedValue([testWarehouse1]);
    (deleteWarehouseById as jest.Mock).mockRejectedValue(new Error());

    render(
      <MemoryRouter>
        <Warehouses testId="warehouses" />
      </MemoryRouter>
    );

    let cardsSection: HTMLElement;
    await waitFor(() => {
      cardsSection = screen.getByTestId("warehouse-cards-section");
      expect(cardsSection).toBeDefined();
    });

    const ellipsisButton = within(cardsSection!).getByTestId(
      "card-ellipsis-button"
    );
    // simulate hover action
    fireEvent.mouseOver(ellipsisButton);

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      userEvent.click(deleteButton);
    });

    await waitFor(() => {
      const errorText = screen.getByText(
        "Sorry, looks like we encountered an error"
      );
      expect(errorText).toBeDefined();
      expect(deleteWarehouseById).toHaveBeenCalled();
      expect(cardsSection.children).toHaveLength(1);
    });
  });
});
