"use client";
import userPlaceholder from "@/assets/image/user.png";
import { ORDER_STATUS } from "@/constant";
import { useUpdateOrderMutation } from "@/redux/api/orderApi";
import { TOrder } from "@/redux/api/orderType";
import { TUser } from "@/types/userType";
import { Dropdown, Flex, MenuProps } from "antd";
import { CalendarDays, FilePenLine, MapPin } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Tag from "./Tag";

export default function OrderDetails({ user, order }: { user: TUser; order: TOrder }) {
  const [imageError, setImageError] = useState(false);

  const items: MenuProps["items"] = ["PENDING", "SHIPPED", "DELIVERED", "CANCELED"].map((key) => ({
    key,
    label: ORDER_STATUS[key as keyof typeof ORDER_STATUS],
    onClick: () => handleChange(key as string),
  }));

  const [updateOrder] = useUpdateOrderMutation();
  const router = useRouter();

  const handleChange = async (value: string) => {
    try {
      const res = await updateOrder({ orderId: order._id, data: { status: value } }).unwrap();
      if (res.success) {
        toast.success(res?.message);
        router.refresh();
      }
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
  };

  return (
    <div className='mx-auto space-y-6'>
      {/* User Information */}
      <div className='bg-white rounded-lg flex items-center space-x-6'>
        <div className='w-20 h-20 relative'>
          <Image
            src={!imageError ? user?.profilePicture || userPlaceholder : userPlaceholder}
            alt='User profile'
            layout='fill'
            className='rounded-full object-cover'
            onError={() => setImageError(true)}
          />
        </div>
        <div>
          <h2 className='text-2xl font-semibold'>
            {user?.firstName} {user?.lastName}
          </h2>
          <p className='text-sm text-gray-500'>{user?.email}</p>
          <p className='text-sm text-gray-500'>{user?.contact}</p>
          <div className='flex items-center text-sm text-gray-500 mt-1'>
            <CalendarDays className='mr-1 h-4 w-4' />
            Member since {moment(user?.createdAt).format("MMMM Do YYYY")}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className='bg-white rounded-lg'>
        <h3 className='text-lg font-semibold mb-4'>Order Details</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='font-semibold'>Order ID</p>
            <p className='text-sm text-gray-500'>#{order?._id}</p>
          </div>
          <div>
            <p className='font-semibold'>Order Type</p>
            <p className='text-sm text-gray-500'>{order?.orderType}</p>
          </div>
          {/*<div>
            <p className='font-semibold'>Quantity</p>
            <p className='text-sm text-gray-500'>{order?.quantity}</p>
          </div>
          <div>
            <p className='font-semibold'>Total Amount</p>
            <p className='text-sm text-gray-500'>${order?.amount}</p>
          </div>*/}
          <div>
            <div className='grid grid-cols-2 text-lg font-semibold'>
              <h2>Size</h2>
              <h2>Quantity</h2>
            </div>
            <div>
              {order.sizesAndQuantities?.map((item) => (
                <div key={item.size} className='grid grid-cols-3'>
                  <p>{item.size}</p>
                  <p>-</p>
                  <p>{item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className='font-semibold'>Size</p>
            <p className='text-sm text-gray-500'>{order?.size || order?.size}</p>
          </div>
          {order?.quote?.pantoneColor && (
            <div>
              <p className='font-semibold'>Pantone Code</p>
              <p className='text-sm text-gray-500'>{order?.quote?.pantoneColor}</p>
            </div>
          )}
          {/*<div>
            <p className='font-semibold'>Hex Color</p>
            <div className='flex items-center mt-1'>
              <div
                className='w-6 h-6 rounded-full mr-2'
                style={{
                  backgroundColor: `#${convertPantoneToHex(
                    order?.quote?.hexColor || order?.product?.colorsPreferences[0] || "000",
                  )}`,
                }}
              ></div>
              <span className='text-sm text-gray-500'>
                {order?.quote?.hexColor || order?.product?.colorsPreferences[0]}
              </span>
            </div>
          </div>*/}
          <div className='space-y-1'>
            <p className='font-semibold'>Order Status</p>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Flex align='end' gap={2}>
                  <Tag status={order?.status} /> <FilePenLine className='h-5 w-5' />
                </Flex>
              </a>
            </Dropdown>
          </div>
          <div className='space-y-1'>
            <p className='font-semibold'>Payment Status</p>
            {order?.paymentStatus === "PAID" ? (
              <span className='inline-block px-4 py-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-400 rounded'>
                Paid
              </span>
            ) : (
              <span className='inline-block px-2 py-1 text-sm font-semibold text-orange-700 bg-orange-100 rounded'>
                Unpaid
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className='bg-white rounded-lg'>
        <h3 className='text-lg font-semibold mb-4'>Shipping Address</h3>
        <div className='flex items-start'>
          <MapPin className='mr-2 h-5 w-5 text-gray-500' />
          <p className='text-sm text-gray-500'>
            {order?.state}, {order?.city}, {order?.country} - {order?.houseNo}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      {order?.quote?.comment && (
        <div className='bg-white rounded-lg'>
          <h3 className='text-lg font-semibold mb-4'>Additional Details From United Threads</h3>
          <p className='text-sm text-gray-500'>{order?.quote?.comment}</p>
        </div>
      )}
    </div>
  );
}
