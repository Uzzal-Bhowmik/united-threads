"use client";
import { useGetEarningGrowthQuery, useGetRevenueCountQuery } from "@/redux/api/metaApi";
import { TResponse } from "@/types/global";
import { Select } from "antd";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const EaringOverviewChart = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  const { data } = useGetRevenueCountQuery([{ label: "year", value: selectedYear }], {});
  const { data: growth, isLoading } = useGetEarningGrowthQuery(
    [{ label: "year", value: selectedYear }],
    {},
  );

  const result = data as TResponse<{ name: string; totalRevenue: number }[]>;

  const handleChange = (value: string) => {
    setSelectedYear(value);
  };

  const currentYear = new Date().getFullYear();
  const startYear = 2024;

  // Ensure we start from 2024, and include the current year + next 3 years
  const yearsArray = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index,
  );

  return (
    <div className='bg-primaryBlack  rounded-lg p-8 w-1/2'>
      <div className='text-primaryWhite flex justify-between items-center mb-10'>
        <h1 className='text-xl'>Earning Overview</h1>
        <h1 className=''>
          Yearly Growth:
          <span className='ml-4 font-medium'>
            {isLoading ? "0.00%" : `${growth?.data?.growthPercentage}%`}
          </span>
        </h1>

        <Select
          value={selectedYear}
          style={{ width: 120 }}
          onChange={handleChange}
          options={yearsArray.map((year) => ({
            value: year.toString(),
            label: year.toString(),
          }))}
        />
      </div>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart
          data={result?.data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barSize={20}
        >
          <XAxis
            dataKey='name'
            scale='point'
            padding={{ left: 10, right: 10 }}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={20} />
          <Tooltip itemStyle={{ color: "#000" }} />
          <CartesianGrid
            opacity={0.2}
            horizontal={true}
            vertical={false}
            stroke='080E0E'
            strokeDasharray='0'
          />
          <Bar
            barSize={12}
            radius={10}
            background={false}
            dataKey='totalRevenue'
            fill='#F8FAFC'
            stroke='#080E0E'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EaringOverviewChart;
