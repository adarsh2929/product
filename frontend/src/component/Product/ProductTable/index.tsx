import React from "react";
import { Table, Button, Image, Space, Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { ProductTableProps } from "./types";
import { ProductData } from "./types";
import SearchProduct from "../SearchProduct";
import DateRangeFilter from "../ProductDateRange";
import { pageSizeOptionsPaging } from "../../../utils/constant";
import { getProductImageUrl } from "../../../API/productAPI";

const ProductTable = (props: ProductTableProps) => {
  const {
    products,
    onEdit,
    loading,
    performSearchHandler,
    searchValue,
    handleDateRangeChange,
    total,
    page,
    pageSize,
    paginationChangeHandler,
  } = props;
  const columns: ColumnsType<ProductData> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <Image
          src={getProductImageUrl(record.id)}
          alt={record.name}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
          onError={(e) => {
            // Fallback image if loading fails
            e.currentTarget.src = "/placeholder-image.png";
          }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            type="primary"
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row>
        <SearchProduct
          performSearchHandler={performSearchHandler}
          searchValue={searchValue}
        />

        <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
      </Row>
      <Table
        loading={loading}
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{
          pageSize: pageSize,
          total: total,
          current: page,
          onChange: paginationChangeHandler,
          pageSizeOptions: pageSizeOptionsPaging,
          showSizeChanger: true,
        }}
        scroll={{
          y: "calc(100vh - 400px)",
          x: products.length > 0 ? "100%" : "0",
        }}
      />
    </div>
  );
};

export default ProductTable;
