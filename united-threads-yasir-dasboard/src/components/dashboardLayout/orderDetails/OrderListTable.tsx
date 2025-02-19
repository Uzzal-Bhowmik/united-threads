"use client";
import OrderDetailsModal from "@/components/shared/OrderDetailsModal";
import { ORDER_STATUS } from "@/constant";
import { useGetOrdersQuery, useUpdateOrderPaymentStatusMutation } from "@/redux/api/orderApi";
import { TOrder } from "@/redux/api/orderType";
import { TResponse } from "@/types/global";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Popover,
  Table,
  TableProps,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import Tag from "../../shared/Tag";
import { FaArrowRightArrowLeft, FaArrowRightLong } from "react-icons/fa6";
import { Redo2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import RefundOption from "./components/RefundOption";

const OrderListTable = () => {
  const [limit, setLimit] = useState(10000000000);
  //const [orderId, setOrderId] = useState("");
  const { data, isLoading } = useGetOrdersQuery([
    { label: "sort", value: "-createdAt" },
    { label: "limit", value: limit.toString() },
  ]);
  const result = data as TResponse<TOrder[]>;

  const columns: TableProps<TOrder>["columns"] = [
    {
      title: "Order ID",
      dataIndex: "_id",
      render: (value) => `#${value}`,
    },
    {
      title: "Product Type",
      dataIndex: "orderType",
      filters: [
        {
          text: "SHOP",
          value: "SHOP",
        },
        {
          text: "QUOTE",
          value: "QUOTE",
        },
      ],
      onFilter: (value, record) => record.orderType.indexOf(value as string) === 0,
    },
    {
      title: "Customer Name",
      dataIndex: "user",
      render: (value) => `${value?.firstName} ${value?.lastName}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) => moment(value).format("lll"),
    },

    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => `$${value}`,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      render: (value) => {
        return (
          <>
            {value === "PAID" ? (
              <span className='inline-block px-4 py-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-400 rounded'>
                Paid
              </span>
            ) : value === "UNPAID" ? (
              <span className='inline-block px-2 py-1 text-sm font-semibold text-orange-700 bg-orange-100 rounded'>
                Unpaid
              </span>
            ) : (
              <span className='inline-block px-2 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded'>
                Refunded
              </span>
            )}
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",

      render: (value, record) => {
        return (
          <div>
            <>
              <Tag status={record.status} />
            </>
          </div>
        );
      },
      filters: Object.keys(ORDER_STATUS).map((key) => ({
        text: key,
        value: key,
      })),
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => (
        <div
          className='flex items-center justify-between gap-2
        '
        >
          {/*<Link href={`/admin/order-details/${record._id}`}>
            <IoEyeOutline size={20} />
          </Link>*/}
          <>
            <IoEyeOutline
              className='cursor-pointer'
              onClick={() => setOpen(record._id)}
              size={20}
            />
          </>

          <RefundOption record={record} />
        </div>
      ),
    },
  ];

  const [open, setOpen] = useState<null | string>(null);

  useEffect(() => {
    if (!isLoading && result?.meta?.total) {
      setLimit(result?.meta?.total);
    }
  }, [isLoading, result?.meta?.total]);

  return (
    <div>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={result?.data}
        pagination={{ pageSize: 20 }}
      ></Table>
      <OrderDetailsModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default OrderListTable;
