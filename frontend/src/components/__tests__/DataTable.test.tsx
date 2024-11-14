import "@testing-library/jest-dom";
import "@guidepup/jest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DataTable, DataType } from "../dataTable/DataTable";
import { deleteInventoryById, putInventory } from "../../api/inventory";
import { useScreenSize } from "../../context/ScreenSizeContext";
import { Form, Input } from "antd";

// Set up mocks
jest.mock("../../api/inventory", () => ({
  deleteInventoryById: jest.fn(),
  putInventory: jest.fn(),
}));

jest.mock("../../context/ScreenSizeContext", () => ({
  useScreenSize: jest.fn(),
}));

describe("Data Table Component", () => {
  const mockEditModalFormItems = (
    <div>
      <Form.Item label="Brand" name="brand">
        <Input placeholder="Brand" />
      </Form.Item>

      <Form.Item label="Product Name" name="name">
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input placeholder="Description" />
      </Form.Item>

      <Form.Item label="Product Type" name="categoryName">
        <Input placeholder="Product Type" />
      </Form.Item>

      <Form.Item label="Warehouse" name="warehouseName">
        <Input placeholder="Warehouse" />
      </Form.Item>

      <Form.Item label="Price" name="price">
        <Input data-testid="price" type="number" />
      </Form.Item>

      <Form.Item label="Size" name="size">
        <Input placeholder="Size" />
      </Form.Item>

      <Form.Item label="Quantity" name="quantity">
        <Input data-testid="quantity" />
      </Form.Item>
    </div>
  );
  const initialData: DataType[] = [
    {
      key: 1,
      brand: "PeakPro",
      name: "Titanium Ascend Rope 60m",
      description:
        "Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.",
      price: 199.99,
      size: "N/A",
      quantity: 200,
      categoryName: "Ropes",
      warehouseName: "CA1",
    },
    {
      key: 2,
      brand: "SummtKing",
      name: "Peak Performance Climbing Shoes",
      description:
        "High-performance climbing shoes with excellent grip and comfort.",
      price: 129.99,
      size: "42",
      quantity: 100,
      categoryName: "Climbing Shoes",
      warehouseName: "NY1",
    },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useScreenSize as jest.Mock).mockReturnValue({ isLargerThan1250: true });
  });

  test("should display loading state initially", () => {
    render(
      <DataTable
        testId="table"
        initialData={initialData}
        loading={true}
        showCategories
        showWarehouses
        updateHandler={putInventory}
        deleteHandler={deleteInventoryById}
        editModalFormItems={mockEditModalFormItems}
      />
    );

    // Verify loading spinner is displayed
    const spinner = document.querySelector(".ant-spin");
    expect(spinner).toBeInTheDocument();
  });

  test("should display table correctly", () => {
    render(
      <DataTable
        testId="table"
        initialData={initialData}
        loading={false}
        showCategories
        showWarehouses
        updateHandler={putInventory}
        deleteHandler={deleteInventoryById}
        editModalFormItems={mockEditModalFormItems}
      />
    );

    expect(screen.getByTestId("table")).toBeInTheDocument();

    // Verify header row cells are displayed
    expect(screen.getByTitle("Brand"));
    expect(screen.getByTitle("Name"));
    expect(screen.getByTitle("Description"));
    expect(screen.getByText("Product Type"));
    expect(screen.getByText("Price"));
    expect(screen.getByText("Size"));
    expect(screen.getByText("Quantity"));
    expect(screen.getByText("Warehouse"));
    expect(screen.getByText("Action"));

    // Verify data rows are displayed
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(initialData.length + 1); // + 1 for header row
  });

  test("should filter table rows when searching", async () => {
    render(
      <DataTable
        testId="table"
        initialData={initialData}
        loading={false}
        showCategories
        showWarehouses
        updateHandler={putInventory}
        deleteHandler={deleteInventoryById}
        editModalFormItems={mockEditModalFormItems}
      />
    );

    // Select search icon
    const brandHeaderCell = screen.getByTitle("Brand");
    const searchModalTrigger = brandHeaderCell.querySelector(
      ".ant-table-filter-trigger"
    );

    // Click to open search modal and conduct search
    fireEvent.click(searchModalTrigger!);
    const searchInput = screen.queryByPlaceholderText(/Search brand/i);
    fireEvent.change(searchInput!, { target: { value: "PeakPro" } });
    const searchButton = screen.queryByText("Search");
    fireEvent.click(searchButton!);

    // Verify table rows are filtered
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // 1 result + 1 header row
    });
  });

  test("should sort table rows correctly when sorting", () => {
    render(
      <DataTable
        testId="table"
        initialData={initialData}
        loading={false}
        showCategories
        showWarehouses
        updateHandler={putInventory}
        deleteHandler={deleteInventoryById}
        editModalFormItems={mockEditModalFormItems}
      />
    );

    // Select sort icon
    const nameHeaderCell = screen.getByTitle("Name");
    const sortButton = nameHeaderCell.querySelector(".ant-table-column-sorter");

    // Click to sort in ascending order
    fireEvent.click(sortButton!);

    // Verify table rows are in ascending order
    let rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Peak Performance Climbing Shoes");
    expect(rows[2]).toHaveTextContent("Titanium Ascend Rope 60m");

    // Click to sort in descending order
    fireEvent.click(sortButton!);

    // Verify table rows are in descending order
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Titanium Ascend Rope 60m");
    expect(rows[2]).toHaveTextContent("Peak Performance Climbing Shoes");
  });

  test("should handle edit item functionality correctly", async () => {
    render(
      <DataTable
        testId="table"
        initialData={initialData}
        loading={false}
        showCategories
        showWarehouses
        updateHandler={putInventory}
        deleteHandler={deleteInventoryById}
        editModalFormItems={mockEditModalFormItems}
      />
    );

    // Click on the delete button of the first row
    let rows = screen.getAllByRole("row");
    const editButton = rows[1].querySelector("#edit-inventory-0");
    fireEvent.click(editButton!);

    // Fill out the form in the modal
    const brandInput = screen.getByPlaceholderText("Brand");
    fireEvent.change(brandInput, { target: { value: "NewBrand" } });

    const nameInput = screen.getByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "NewName" } });

    const descriptionInput = screen.getByPlaceholderText("Description");
    fireEvent.change(descriptionInput, { target: { value: "NewDescription" } });

    const priceInput = screen.getByTestId("price");
    fireEvent.change(priceInput, { target: { value: 150.0 } });

    const sizeInput = screen.getByPlaceholderText("Size");
    fireEvent.change(sizeInput, { target: { value: "40" } });

    const quantityInput = screen.getByTestId("quantity");
    fireEvent.change(quantityInput, { target: { value: 20 } });

    const categoryInput = screen.getByPlaceholderText("Product Type");
    fireEvent.change(categoryInput, { target: { value: "Climbing Shoes" } });

    const warehouseInput = screen.getByPlaceholderText("Warehouse");
    fireEvent.change(warehouseInput, { target: { value: "CA1" } });

    // Confirm the Save in the modal
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton!);

    // Verify PUT request is made with updated data
    await waitFor(() => {
      expect(putInventory).toHaveBeenCalledWith({
        id: 1,
        brand: "NewBrand",
        name: "NewName",
        description: "NewDescription",
        price: "150",
        size: "40",
        quantity: "20",
        categoryName: "Climbing Shoes",
        warehouseName: "CA1",
      });
    });
  });

  test("should handle delete item functionality correctly", async () => {
    render(
      <DataTable
        testId="table"
        initialData={initialData}
        loading={false}
        showCategories
        showWarehouses
        updateHandler={putInventory}
        deleteHandler={deleteInventoryById}
        editModalFormItems={mockEditModalFormItems}
      />
    );

    // Click on the delete button of the first row
    let rows = screen.getAllByRole("row");
    const deleteButton = rows[1].querySelector("#delete-inventory-0");
    fireEvent.click(deleteButton!);

    // Confirm the delete in the Popconfirm
    const confirmButton = document.querySelector("#confirm-delete-inventory-0");
    fireEvent.click(confirmButton!);

    // Verify DELETE request is made with id
    await waitFor(() => {
      expect(deleteInventoryById).toHaveBeenCalledWith(1);
    });
  });

  
  test("should match the inline snapshot of expected screen reader spoken phrases", async () => {
    render(
      <DataTable
        testId="table"
        initialData={initialData}
        loading={false}
        showCategories
        showWarehouses
        updateHandler={putInventory}
        deleteHandler={deleteInventoryById}
        editModalFormItems={mockEditModalFormItems}
      />
    );
    await expect(document.body).toMatchScreenReaderInlineSnapshot(`
  [
    "document",
    "table",
    "rowgroup",
    "row, Name Description Product Type Price Size Quantity Warehouse Action",
    "columnheader, Brand, sorted in ascending order",
    "columnheader, Name",
    "columnheader, Description",
    "columnheader, Product Type",
    "columnheader, Price",
    "columnheader, Size",
    "columnheader, Quantity",
    "columnheader, Warehouse",
    "columnheader, Action",
    "end of row, Name Description Product Type Price Size Quantity Warehouse Action",
    "end of rowgroup",
    "rowgroup",
    "row, PeakPro Titanium Ascend Rope 60m Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing. Ropes 199.99 N/A 200 CA1 Edit Delete",
    "cell, PeakPro",
    "PeakPro",
    "end of cell, PeakPro",
    "cell, Titanium Ascend Rope 60m",
    "Titanium Ascend Rope 60m",
    "end of cell, Titanium Ascend Rope 60m",
    "cell, Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.",
    "Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.",
    "end of cell, Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.",
    "cell, Ropes",
    "cell, 199.99",
    "cell, N/A",
    "cell, 200",
    "cell, CA1",
    "cell, Edit Delete",
    "button, Edit",
    "button, Delete",
    "end of cell, Edit Delete",
    "end of row, PeakPro Titanium Ascend Rope 60m Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing. Ropes 199.99 N/A 200 CA1 Edit Delete",
    "row, SummtKing Peak Performance Climbing Shoes High-performance climbing shoes with excellent grip and comfort. Climbing Shoes 129.99 42 100 NY1 Edit Delete",
    "cell, SummtKing",
    "SummtKing",
    "end of cell, SummtKing",
    "cell, Peak Performance Climbing Shoes",
    "Peak Performance Climbing Shoes",
    "end of cell, Peak Performance Climbing Shoes",
    "cell, High-performance climbing shoes with excellent grip and comfort.",
    "High-performance climbing shoes with excellent grip and comfort.",
    "end of cell, High-performance climbing shoes with excellent grip and comfort.",
    "cell, Climbing Shoes",
    "cell, 129.99",
    "cell, 42",
    "cell, 100",
    "cell, NY1",
    "cell, Edit Delete",
    "button, Edit",
    "button, Delete",
    "end of cell, Edit Delete",
    "end of row, SummtKing Peak Performance Climbing Shoes High-performance climbing shoes with excellent grip and comfort. Climbing Shoes 129.99 42 100 NY1 Edit Delete",
    "end of rowgroup",
    "end of table",
    "list",
    "listitem, Previous Page, level 1, position 1, set size 3",
    "button, left, disabled",
    "img, left",
    "end of button, left, disabled",
    "end of listitem, Previous Page, level 1, position 1, set size 3",
    "listitem, 1, level 1, position 2, set size 3",
    "1",
    "end of listitem, 1, level 1, position 2, set size 3",
    "listitem, Next Page, level 1, position 3, set size 3",
    "button, right, disabled",
    "img, right",
    "end of button, right, disabled",
    "end of listitem, Next Page, level 1, position 3, set size 3",
    "end of list",
    "end of document",
  ]
  `);
  });
});
