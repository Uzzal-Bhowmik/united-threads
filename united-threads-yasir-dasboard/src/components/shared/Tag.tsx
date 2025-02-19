import { TOrderStatus } from "@/redux/api/orderType";
import React from "react";

const Tag = ({ status }: { status: string }) => {
  if (status === "PENDING") {
    return (
      <span className='inline-block px-2 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded border border-blue-400'>
        Pending
      </span>
    );
  } else if (status === "SHIPPED") {
    return (
      <span className='inline-block px-2 py-1 text-sm font-semibold text-orange-700 bg-orange-100 rounded border border-orange-400'>
        Shipped
      </span>
    );
  } else if (status === "DELIVERED") {
    return (
      <span className='inline-block px-2 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded border border-green-400 '>
        Delivered
      </span>
    );
  } else if (status === "CANCELED") {
    return (
      <span className='inline-block px-2 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded border border-red-400'>
        Canceled
      </span>
    );
  } else if (status === "APPROVED") {
    return (
      <span className='inline-block px-2 py-1 text-sm font-semibold  text-green-700 bg-green-100 rounded border border-green-400'>
        Approved
      </span>
    );
  }
};

export default Tag;
