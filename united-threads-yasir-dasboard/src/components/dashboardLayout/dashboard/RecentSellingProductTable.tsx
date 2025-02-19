"use client";
import { ConfigProvider, Table, TableProps } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import SellProductDetailsModal from "./SellProductDetailsModal";
import { useEffect, useState } from "react";
import { useGetOrdersQuery } from "@/redux/api/orderApi";
import { TResponse } from "@/types/global";
import { TOrder } from "@/redux/api/orderType";
import moment from "moment";

const RecentSellingProductTable = () => {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10000000000);
  const [orderId, setOrderId] = useState("");
  const { data, isLoading } = useGetOrdersQuery(
    [
      { label: "sort", value: "-createdAt" },
      { label: "limit", value: limit.toString() },
    ],
    {},
  );

  const result = data as TResponse<TOrder[]>;

  const columns: TableProps<TOrder>["columns"] = [
    {
      title: "Serial",
      dataIndex: "key",
      render: (value, record, index) => `#${++index}`,
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (value) => value?.name,
    },
    {
      title: "Buyer Email",
      dataIndex: "user",
      render: (value) => value?.email,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) => moment(value).format("DD MMMM YYYY : hh:mm A"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => `$${value}`,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => (
        <div className='ml-4 cursor-pointer'>
          <IoEyeOutline
            size={20}
            onClick={() => {
              setOpen(true);
              setOrderId(record._id);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!isLoading && result?.meta?.total) {
      setLimit(result?.meta?.total);
    }
  }, [isLoading, result?.meta?.total]);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              colorBgContainer: "rgb(35,35,35)",
              colorText: "rgb(248,250,252)",
              colorTextHeading: "rgb(248,250,252)",
              headerBg: "rgb(87,88,88)",
              borderColor: "rgb(0,0,0)",
              headerSplitColor: "rgb(87,88,88)",
            },
          },
        }}
      >
        <div>
          <h1 className='text-2xl font-bold pb-2'>Recent Selling Products</h1>
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={result?.data}
            pagination={{ pageSize: 7 }}
          ></Table>
        </div>
      </ConfigProvider>
      <SellProductDetailsModal
        orderId={orderId}
        open={open}
        setOpen={setOpen}
      ></SellProductDetailsModal>
    </>
  );
};

export default RecentSellingProductTable;
