"use client";
import Tag from "@/components/shared/Tag";
import { convertPantoneToHex } from "@/lib/utils/convertHexToPanton";
import { useGetQuotesQuery } from "@/redux/api/quoteApi";
import { TResponse } from "@/types/global";
import { TQuote } from "@/types/quoteTypes";
import { Segmented, Table, TableProps } from "antd";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";

const QuoteListTable = ({ date }: { date?: string | null }) => {
  const [quoteStatus, setQuoteStatus] = useState("pending");
  const [limit, setLimit] = useState(999999999999999);

  const query = [
    { label: "sort", value: "-createdAt" },
    { label: "limit", value: limit.toString() },
    { label: "quoteStatus", value: quoteStatus },
  ];

  if (date && typeof date === "string") {
    query.push({ label: "createdAt", value: date });
  }

  const { data, isLoading } = useGetQuotesQuery(query, {});

  const result = data as TResponse<TQuote[]>;

  const columns: TableProps<TQuote>["columns"] = [
    {
      title: "Quote ID",
      dataIndex: "_id",
      render: (value) => `#${value}`,
    },
    {
      title: "Quote Name",
      dataIndex: "name", // Updated to reflect the TQuote field 'name'
      render: (value) => value || "N/A",
    },
    {
      title: "Pantone Code",
      dataIndex: "pantoneColor", // Added pantone color field from TQuote
      render: (value, record) => {
        const backgroundColor = "#" + convertPantoneToHex(record.pantoneColor);
        return (
          <div className='flex items-center gap-x-2'>
            <span className='size-4 inline-block rounded-full' style={{ backgroundColor }}></span>
            <span style={{ color: value }}>{record.pantoneColor}</span>
          </div>
        );
      },
    },
    //{
    //  title: "Quantity",
    //  dataIndex: "quantity",
    //},
    {
      title: "Quote Status",
      dataIndex: "quoteStatus",
      render: (value) => {
        return (
          <div>
            <Tag status={value === "pending" ? "PENDING" : "APPROVED"} />
          </div>
        );
      },
    },
    {
      title: "Payment Status",
      dataIndex: "_id",
      render: (value) => {
        return (
          <span className='inline-block px-2 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded border border-red-400'>
            Unpaid
          </span>
        );
      },
    },
    //{
    //  title: "Total",
    //  dataIndex: "price",
    //  render: (value) => `$${value}`,
    //},
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (value) => moment(value).format("lll"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => (
        <div className='ml-4'>
          <Link href={`/csr/quote-details/${record._id}`}>
            <IoEyeOutline size={20} />
          </Link>
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
    <div>
      <>
        <Segmented
          onChange={setQuoteStatus}
          className='mb-4'
          options={[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "processing" },
          ]}
        />
      </>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={result?.data}
        pagination={{ pageSize: 20 }}
      ></Table>
    </div>
  );
};

export default QuoteListTable;
