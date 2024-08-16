import { ReactElement, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Popconfirm, Space, Table, Tooltip } from "antd";
import type {
  InputRef,
  TableColumnsType,
  TableColumnType,
  TableProps,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import "./DataTable.css";
import { deleteInventoryById } from "../api/inventory";
import { ButtonWithModal } from "./ButtonWithModal";

type props = {
  initialData?: DataType[];
  loading: boolean;
  showWarehouses: boolean;
  showCategories: boolean;
  updateHandler: (data: any) => Promise<void>;
  editModalFormItems: ReactElement;
};

export type DataType = {
  key: number;
  brand: string;
  name: string;
  description: string;
  price: number;
  size: string | "N/A";
  quantity: number;
  categoryName: string;
  warehouseName: string;
};

type DataIndex = keyof DataType;

export const DataTable = ({
  initialData,
  loading,
  showCategories,
  showWarehouses,
  updateHandler,
  editModalFormItems,
}: props) => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleDelete = async (key: number) => {
    setConfirmLoading(true);
    try {
      await deleteInventoryById(key);
      setData(data.filter((item) => item.key !== key));
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, confirm, dataIndex)
            }
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn(dataIndex);
    handleSearch([""], confirm, dataIndex);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      showSorterTooltip: { target: "full-header" },
      sorter: (a, b) =>
        a.brand.toLowerCase().localeCompare(b.brand.toLowerCase()),
      defaultSortOrder: "ascend",
      width: 160,
      fixed: "left",
      ...getColumnSearchProps("brand"),
      ellipsis: {
        showTitle: false,
      },
      render: (brand) => (
        <Tooltip placement="topLeft" title={brand}>
          {brand}
        </Tooltip>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      sortDirections: ["ascend", "descend", "ascend"],
      fixed: "left",
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      sorter: (a, b) =>
        a.description.toLowerCase().localeCompare(b.description.toLowerCase()),
      sortDirections: ["ascend", "descend", "ascend"],
      width: "30%",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Product Type",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) =>
        a.categoryName
          .toLowerCase()
          .localeCompare(b.categoryName.toLowerCase()),
      sortDirections: ["ascend", "descend", "ascend"],
      width: "15%",
      hidden: !showCategories,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortDirections: ["ascend", "descend", "ascend"],
      width: 100,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      sorter: (a, b) => {
        if (a.size === "N/A") return 1;
        if (b.size === "N/A") return -1;
        return a.size.toLowerCase().localeCompare(b.size.toLowerCase());
      },
      sortDirections: ["ascend", "descend", "ascend"],
      width: 100,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      sortDirections: ["ascend", "descend", "ascend"],
      width: 100,
    },
    {
      title: "Warehouse",
      dataIndex: "warehouseName",
      key: "warehouseName",
      width: 120,
      sorter: (a, b) =>
        a.warehouseName
          .toLowerCase()
          .localeCompare(b.warehouseName.toLowerCase()),
      sortDirections: ["ascend", "descend", "ascend"],
      hidden: !showWarehouses,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space>
          <ButtonWithModal
            title="Update Inventory Item"
            buttonType="link"
            buttonSize="small"
            buttonText="Edit"
            modalButtonText="Save"
            confirmHandler={updateHandler}
            form={form}
            recordId={record.key}
          >
            <Form
              layout="vertical"
              form={form}
              name="form_in_modal"
              initialValues={record}
            >
              {editModalFormItems}
            </Form>
          </ButtonWithModal>
          <Popconfirm
            title="Confirm delete?"
            onConfirm={() => {
              handleDelete(record.key);
            }}
            okButtonProps={{
              type: "primary",
              danger: true,
              loading: confirmLoading,
            }}
            okText="Delete"
          >
            <Button type="link" size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      onChange={onChange}
      showSorterTooltip={{ target: "sorter-icon" }}
      loading={loading}
      size="middle"
      scroll={{ x: 1500 }}
    />
  );
};
