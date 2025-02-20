/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ORDER_STATUS } from "@/constant";
import { useGetSingleOrderQuery, useUpdateOrderMutation } from "@/redux/api/orderApi";
import { TOrder } from "@/redux/api/orderType";
import { TResponse } from "@/types/global";
import { Divider, Select, Table, TableProps } from "antd";
import moment from "moment";
import { CiUser } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";
import OrderDetailsSkeleton from "./SingleOrderDetailsSkeleton";
import Image from "next/image";
import productPlaceholder from "@/assets/product.jpg";
import { toast } from "sonner";
import { TQuoteProduct } from "@/types/quoteProductTypes";
import { TProduct } from "@/types/productType";

const SingleOrderDetailsContainer = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetSingleOrderQuery({ orderId: id });
  const result = data as TResponse<TOrder & { quote: TQuoteProduct; product: TProduct }>;

  const order = result?.data as TOrder;

  const columns: TableProps<TOrder>["columns"] = [
    {
      title: "Product Name",
      dataIndex: "product",
      render: (value, record) => (
        <div className='flex gap-3 items-center'>
          <Image
            src={record?.product?.primaryImage || productPlaceholder}
            alt='productImage'
            width={50}
            height={50}
            className='h-auto w-auto '
          />
          <h4 className='text-lg font-medium'>{value?.name}</h4>
        </div>
      ),
    },
    {
      title: "Order ID",
      dataIndex: "_id",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Total",
      dataIndex: "amount",
      render: (value) => `$${value}`,
    },
  ];

  const [updateOrder] = useUpdateOrderMutation();

  const handleChange = async (value: string) => {

    try {
      const res = await updateOrder({
        orderId: id,
        data: {
          status: value,
        },
      }).unwrap();

      if (res.data?.success) {
        toast.success(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      {isLoading ? (
        <OrderDetailsSkeleton />
      ) : (
        <>
          <div className='flex justify-between'>
            <div>
              <div className='flex items-center gap-3'>
                <p className='text-xl font-bold '>Orders ID: {order?._id}</p>

                <Select
                  defaultValue='pending'
                  style={{ width: 120, border: "none" }}
                  className=''
                  onChange={handleChange}
                  options={Object.keys(ORDER_STATUS).map((key) => ({
                    label: key,
                    value: key,
                  }))}
                />
              </div>
              <div className=' flex items-center gap-3 mt-3'>
                <LuCalendarDays className=' w-6 h-6' />
                <p className=' text-lg font-medium'>
                  {moment(order?.createdAt).format("MMMM Do, YYYY")}
                </p>
              </div>
            </div>
            <div className='flex gap-3'>
              <CiUser className='w-12 h-12 rounded-md bg-primaryBlack text-primaryWhite py-2 px-2' />

              <div>
                <h2 className='text-xl font-bold mb-1.5'>Customer Information</h2>
                <div className='grid'>
                  <div>
                    <p className=' mb-1'>Full Name:</p>
                    <p className=' mb-1'>Email: </p>
                    <p className=' mb-1'>PHone: </p>
                  </div>
                  <div>
                    <p>Address:</p>
                    <p>
                      {order?.state} {order?.city} {order?.houseNo}{" "}
                    </p>
                    <p> {order?.user?.contact}</p>
                    <p> {order?.user?.email}</p>
                    <p>
                      {order?.user?.firstName} {order?.user?.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* payment datails */}
          {/*<div className=' mt-5'>
            <div className='bg-[#EBEDEE] p-4 rounded'>
              <h1 className='text-xl font-bold text-[#232321] mb-4'>Payment Info</h1>
              <div className='flex justify-between items-center'>
                <div className='flex gap-x-3 items-center '>
                  <Image src={masterCardlogo} alt='masterCardImg'></Image>
                  <p>Master Card **** **** 6557</p>
                </div>
                <div className='flex gap-x-2 items-center'>
                  <p>Business name: Shristi Singh</p>
                  <p>Phone: +91 904 231 1212</p>
                </div>
              </div>
            </div>
          </div>*/}
          {/* order Products Table */}
          <div className='mt-6'>
            {/*<OrderProductTable></OrderProductTable>*/}
            <div className='py-6 px-4 bg-[#EBEDEE] rounded'>
              <h1 className='text-xl font-semibold'>Products</h1>
              <Divider></Divider>
              <Table columns={columns} dataSource={[order]} pagination={false}></Table>
              {/*<div className='mt-4 flex gap-10 justify-center'>
                <h1 className='text-2xl font-bold'>Total</h1>
                <p className='text-2xl font-medium'>${order?.amount}</p>
              </div>*/}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleOrderDetailsContainer;
