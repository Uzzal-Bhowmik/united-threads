"use client";

import { CiUser } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";
import DeliveryQuoteProductTable from "./DeliveryQuoteProductTable";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const DeliveryQuoteProductContainer = ({}) => {
  const router = useRouter();
  return (
    <div>
      <div className='flex justify-between'>
        <div>
          <div className='flex items-center gap-3'>
            <p className='text-xl font-bold '>Orders ID: #6743</p>
          </div>
          <div className=' flex items-center gap-3 mt-3'>
            <LuCalendarDays className=' w-6 h-6' />
            <p className=' text-md'>
              Last date: <span className='ml-4'>Feb 16,2022</span>
            </p>
          </div>

          <p
            className='text-xl font-bold mt-4 flex gap-1 items-center cursor-pointer'
            onClick={() => router.back()}
          >
            <FaArrowLeft size={16} />
            View delivery status
          </p>
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
      <div className='mt-10'>
        <DeliveryQuoteProductTable></DeliveryQuoteProductTable>
      </div>
    </div>
  );
};

export default DeliveryQuoteProductContainer;
