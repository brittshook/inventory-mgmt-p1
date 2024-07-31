import { useRef, useState } from "react";
import { Button, Input, Space, Table, Tooltip } from "antd";
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

type props = {
  data?: DataType[];
  loading: boolean;
  showWarehouses: boolean;
  showCategories: boolean;
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
  data,
  loading,
  showCategories,
  showWarehouses,
}: props) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
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

// const handleDelete = (key: React.Key) => {
//   const newData = dataSource.filter((item) => item.key !== key);
//   setDataSource(newData);
// };

// {
//   title: 'operation',
//   dataIndex: 'operation',
//   render: (_, record) =>
//     dataSource.length >= 1 ? (
//       <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
//         <a>Delete</a>
//       </Popconfirm>
//     ) : null,
// },

// import type { GetProp } from "antd";
// import type { SorterResult } from "antd/es/table/interface";

// type ColumnsType<T> = TableProps<T>["columns"];
// type TablePaginationConfig = Exclude<
//   GetProp<TableProps, "pagination">,
//   boolean
// >;

// interface TableParams {
//   pagination?: TablePaginationConfig;
//   sortField?: SorterResult<any>["field"];
//   sortOrder?: SorterResult<any>["order"];
//   filters?: Parameters<GetProp<TableProps, "onChange">>[1];
// }

// const getInventoryParams = (params: TableParams) => ({
//   results: params.pagination?.pageSize,
//   page: params.pagination?.current,
//   ...params,
// });

// export const DataTable = ({ dataSource }: props) => {
//   const [data, setData] = useState<DataType[]>();
//   const [loading, setLoading] = useState(false);
//   const [tableParams, setTableParams] = useState<TableParams>({
//     pagination: {
//       current: 1,
//       pageSize: 20,
//     },
//   });
//   const [searchText, setSearchText] = useState("");
//   const [searchedColumn, setSearchedColumn] = useState("");
//   const searchInput = useRef<InputRef>(null);

//   const handleTableChange: TableProps["onChange"] = (
//     pagination,
//     filters,
//     sorter
//   ) => {
//     setTableParams({
//       pagination,
//       filters,
//       sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
//       sortField: Array.isArray(sorter) ? undefined : sorter.field,
//     });

//     // `dataSource` is useless since `pageSize` changed
//     if (pagination.pageSize !== tableParams.pagination?.pageSize) {
//       setData([]);
//     }
//   };

//   return (
//     <Table
//       columns={columns}
//       rowKey={(record: DataType) => `${record.id}`}
//       dataSource={data}
//       pagination={tableParams.pagination}
//       loading={loading}
//       onChange={handleTableChange}
//     />
//   );
// };
