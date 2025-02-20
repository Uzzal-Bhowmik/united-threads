"use client";
import OrderDetailsModal from "@/components/shared/OrderDetailsModal";
import { useGetUserAndRevenueCountQuery } from "@/redux/api/metaApi";
import { useGetOrdersQuery } from "@/redux/api/orderApi";
import { TOrder } from "@/redux/api/orderType";
import { TResponse } from "@/types/global";
import { Spin, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";

const EarningContainer = () => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [limit, setLimit] = useState(1000000000000000);
  //type TDataType = {
  //  key: number;
  //  product: string;
  //  buyerEmail: string;
  //  date: string;
  //  amount: string;
  //};
  //const data: TDataType[] = Array.from({ length: 12 }).map((_, inx) => ({
  //  key: inx + 1,
  //  product: "Hoodie",
  //  buyerEmail: "info@gmail.com",
  //  date: "11 oct 24, 11.10PM",
  //  amount: "$152",
  //}));

  const { data: metaData, isLoading: isLoadingMeta } = useGetUserAndRevenueCountQuery([]);

  const counts = metaData as TResponse<{
    userCount: number;
    revenueCount: number;
    todayRevenue: number;
  }>;

  const { data, isLoading } = useGetOrdersQuery([
    {
      label: "paymentStatus",
      value: "PAID",
    },
    {
      label: "limit",
      value: limit.toString(),
    },
  ]);

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
        <div className='ml-4'>
          <IoEyeOutline
            className='cursor-pointer'
            size={20}
            onClick={() => {
              setOpen(true);
              setOrderId(record?._id);
              [];
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (result?.meta?.total) {
      setLimit(result.meta?.total);
    }
  }, [isLoading, result?.meta?.total]);

  if (isLoading || isLoadingMeta) {
    return <Spin />;
  }

  return (
    <div>
      <div className='flex items-center py-4 gap-10'>
        <h1 className='text-2xl font-bold'>Earnings</h1>
        <>
          <div className='flex items-center gap-x-6 p-3 bg-black rounded-lg text-white'>
            <div className='flex items-center gap-x-3'>
              <FaArrowRightArrowLeft size={20} color='white' />
              <p className='text-white'>Today’s Earning</p>
            </div>
            <p className='font-semibold text-base'>
              {" "}
              $<CountUp end={counts?.data?.todayRevenue} duration={2} start={0} />{" "}
            </p>
          </div>
        </>
        <>
          <div className='flex items-center gap-x-3 p-3 bg-black rounded-lg text-white'>
            <FaArrowRightArrowLeft size={20} color='white' />
            <p className='text-white'>Total Earning</p>
            <p className='font-semibold text-base'>
              {" "}
              $<CountUp end={counts?.data?.revenueCount} duration={2} start={0} />{" "}
            </p>
          </div>
        </>
      </div>
      <Table
        columns={columns}
        dataSource={result?.data}
        loading={isLoading}
        pagination={{ pageSize: 10, responsive: true }}
      ></Table>
      {/*<EaringDetaisModal orderId={orderId} open={open} setOpen={setOpen}></EaringDetaisModal>*/}
      <OrderDetailsModal open={orderId} setOpen={setOrderId} />
    </div>
  );
};

export default EarningContainer;
