"use client";
import { Button } from "antd";
import { CiUser } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";
import DeliveryInfoModal from "./DeliveryInfoModal";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import QuoteOrderProduct from "./QuoteOrderProduct";

const QuoteOrderDetails = ({}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className='flex justify-between'>
        <div>
          <div className='flex items-center gap-3'>
            <p className='text-xl font-bold '>Orders ID: #6743</p>
            <Button onClick={() => setOpen(!open)}>Make Delivery</Button>
          </div>
          <div className=' flex items-center gap-3 mt-3'>
            <LuCalendarDays className=' w-6 h-6' />
            <p className=' text-md'>Feb 16,2022</p>
          </div>
          <Link href={"/quote-management/1/deliveryQuoteProduct"}>
            <p className='text-xl font-bold mt-4 flex items-center  gap-2'>
              View shipment delivery status <FaArrowRight size={16} />
            </p>
          </Link>
        </div>
        <div className='flex gap-3'>
          <CiUser className='w-12 h-12 rounded-md bg-primaryBlack text-primaryWhite py-2 px-2' />

          <div>
            <h2 className='text-xl font-bold mb-3'>Retailer </h2>
            <p className=' mb-2'>Full Name: Emon</p>
            <p className=' mb-2'>Email: emon@gmail.com</p>
            <p className=' mb-2'>PHone: +545412110</p>
            <p className=' mb-2'>Address: Keraniganj, Dhaka</p>
          </div>
        </div>
      </div>

      {/* order Products Table */}
      <div className='mt-6'>
        <QuoteOrderProduct></QuoteOrderProduct>
      </div>
      <DeliveryInfoModal open={open} setOpen={setOpen}></DeliveryInfoModal>
    </div>
  );
};

export default QuoteOrderDetails;
