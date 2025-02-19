"use client";
import React, { useState } from "react";
import QuoteListTable from "./QuoteListTable";
import { DatePicker } from "antd";
import moment from "moment";

const QuoteDetailsContainer = () => {
  const [date, setDate] = useState<string | null>(null);
  return (
    <div>
      <div className='flex justify-between mb-9'>
        <h1 className='text-2xl font-bold'>Quote List</h1>
        <div>
          <DatePicker
            size='large'
            onChange={(date, dateString) => {
              if (date) {
                setDate(moment(dateString).format("L"));
              } else {
                setDate(null);
              }
            }}
          />
        </div>
      </div>
      <QuoteListTable date={date}></QuoteListTable>
    </div>
  );
};

export default QuoteDetailsContainer;
