"use clinet";
import React from "react";
import QuotaOrderListTable from "./QuotaOrderListTable";
import { DatePicker } from "antd";

const QuoteManagementContainer = () => {
  return (
    <div>
      <div className='flex justify-between mb-9'>
        <h1 className='text-2xl font-bold'>Orders List</h1>
        <div>
          <DatePicker size='large' />
        </div>
      </div>
      <QuotaOrderListTable></QuotaOrderListTable>
    </div>
  );
};

export default QuoteManagementContainer;
