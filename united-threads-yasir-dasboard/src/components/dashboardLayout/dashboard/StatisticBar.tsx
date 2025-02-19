"use client";
import Image from "next/image";
import userIcon from "@/assets/Icons/userIcon.png";
import earingIcon from "@/assets/Icons/EarningIcon.png";
import { useGetUserAndRevenueCountQuery } from "@/redux/api/metaApi";
import CountUp from "react-countup";
import { TResponse } from "@/types/global";

const StatisticBar = () => {
  const { data, isLoading } = useGetUserAndRevenueCountQuery([]);

  const result = data as TResponse<{
    userCount: number;
    revenueCount: number;
    todayRevenue: number;
  }>;

  return (
    <div className='h-32 flex text-primaryWhite font-roboto'>
      <div className='w-1/2 h-full mr-4 bg-primaryBlack rounded-xl flex gap-6 px-12 items-center '>
        <div className='bg-primaryWhite p-4 rounded-full'>
          <Image src={userIcon} alt='user' width={40} height={40} />
        </div>
        <div className='flex flex-col '>
          <p className='text-3xl '>Total User</p>
          <h4 className='text-3xl font-bold '>
            {!isLoading ? (
              <CountUp end={result?.data?.userCount} duration={2} start={0} />
            ) : (
              <CountUp end={0} duration={2} start={0} />
            )}
          </h4>
        </div>
      </div>
      <div className='w-1/2 h-full ml-4 bg-primaryBlack rounded-xl flex gap-6  px-12 items-center '>
        <div className='bg-primaryWhite p-4 rounded-full'>
          <Image src={earingIcon} alt='user' width={40} height={40} />
        </div>
        <div className='flex flex-col '>
          <p className='text-3xl'>Total Earning</p>
          <h4 className='text-3xl font-bold '>
            {!isLoading ? (
              <>
                $ <CountUp end={result?.data?.revenueCount} duration={2} start={0} />
              </>
            ) : (
              <>
                $ <CountUp end={0} duration={2} start={0} />
              </>
            )}
          </h4>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default StatisticBar;
