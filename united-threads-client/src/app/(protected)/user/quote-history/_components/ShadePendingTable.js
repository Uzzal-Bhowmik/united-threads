"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import ShadePendingModal from "./ShadePendingModal";
import { useGetQuotesQuery } from "@/redux/api/quoteApi";
import { format } from "date-fns";
import CustomPagination from "@/components/CustomPagination/CustomPagination";

const TABLE_HEADERS = [
  "Quote ID",
  "Product",
  "Category",
  "Quantity",
  "Size",
  "Pantone",
  "Quote Created",
  "Action",
];

export default function ShadePendingTable() {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const query = {};
  query["quoteStatus"] = "pending";
  const [selectedQuote, setSelectedQuote] = useState({});

  // ================== Pagination ===============
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  query["page"] = currentPage;
  query["limit"] = pageSize;

  // ================== Get Pending Quotes =================
  const { data: pendingQuotesRes } = useGetQuotesQuery(query);
  const pendingQuotes = pendingQuotesRes?.data || [];
  const meta = pendingQuotesRes?.data?.meta || {};

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-lightGray">
            {TABLE_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="text-lg font-semibold text-primary-black"
                style={{ padding: "14px" }}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingQuotes.map((quote) => (
            <TableRow
              key={quote?._id}
              className="border-b border-primary-black/15"
            >
              <TableCell className="py-5 font-medium">#{quote?._id}</TableCell>
              <TableCell className="py-5 font-medium">{quote?.name}</TableCell>
              <TableCell className="py-5 font-medium">
                {quote?.category?.name}
              </TableCell>
              <TableCell className="py-5 font-medium">
                {quote?.quantity}
              </TableCell>
              <TableCell className="py-5 font-medium">{quote?.size}</TableCell>

              <TableCell className="flex items-center gap-x-2 py-5 font-medium">
                <div
                  className="h-5 w-5 rounded-full"
                  style={{
                    backgroundColor: quote?.hexColor?.includes("#")
                      ? quote?.hexColor
                      : `#${quote?.hexColor}`,
                  }}
                />

                {quote?.pantoneColor}
              </TableCell>

              <TableCell className="py-5 font-medium">
                {quote?.createdAt &&
                  format(quote?.createdAt, "dd MMM yyyy, hh:mm a")}
              </TableCell>

              <TableCell className="py-5 font-medium">
                <div className="flex-center-start gap-x-4">
                  <div>
                    <button
                      onClick={() => {
                        setShowOrderModal(!showOrderModal);
                        setSelectedQuote(quote);
                      }}
                    >
                      <EyeIcon size={20} color="#292929" />
                    </button>
                  </div>

                  {/* <button className="relative">
                  <Badge className="flex-center absolute -right-3 -top-2 h-4 w-[1px] rounded-full bg-danger py-0 text-[10px]">
                    5
                  </Badge>
                  <MessageSquareText size={20} color="#292929" />
                </button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pendingQuotes?.length > 9 && (
        <div className="ms-auto mt-8 w-max">
          <CustomPagination
            total={meta?.total}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* Quote Details Modal */}
      <ShadePendingModal
        quote={selectedQuote}
        open={showOrderModal}
        setOpen={setShowOrderModal}
      />
    </>
  );
}
