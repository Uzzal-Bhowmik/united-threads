"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Check } from "lucide-react";
import { useGetQuotesQuery } from "@/redux/api/quoteApi";
import { format } from "date-fns";
import QuoteApprovedModal from "./QuoteApprovedModal";
import CustomPagination from "@/components/CustomPagination/CustomPagination";

const TABLE_HEADERS = [
  "Order ID",
  "Product",
  "Category",
  "Pantone",
  "Quote Created",
  "Action",
];

// const ORDER_STATUS = ["All", "Pending", "Shipped", "Delivered"];

export default function ShadeApprovedTable() {
  const [showApprovedQuoteModal, setShowApprovedQuoteModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState({});
  // const [selectedStatus, setSelectedStatus] = useState("All");

  const query = {};
  query["quoteStatus"] = "processing";

  // ================== Pagination ===============
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  query["page"] = currentPage;
  query["limit"] = pageSize;

  // ================== Get Pending Quotes =================
  const { data: approvedQuotesRes } = useGetQuotesQuery(query);
  const approvedQuotes = approvedQuotesRes?.data || [];
  const meta = approvedQuotesRes?.data?.meta || {};

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-lightGray hover:bg-lightGray">
            {TABLE_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="text-lg font-semibold text-primary-black"
                style={{ paddingBlock: "14px" }}
              >
                {header !== "Status" && header}

                {header === "Status" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex-center-start gap-x-3">
                      Status <ChevronsUpDown size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {ORDER_STATUS.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                        >
                          {selectedStatus === status && (
                            <Check className="mr-1" size={16} />
                          )}

                          <button
                            className={selectedStatus !== status && "ml-4"}
                          >
                            {status}
                          </button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody style={{ padding: "14px" }}>
          {approvedQuotes?.map((quote) => (
            <TableRow
              key={quote?._id}
              className="border-b border-primary-black/15"
            >
              <TableCell className="py-5 font-medium">#{quote?._id}</TableCell>
              <TableCell className="py-5 font-medium">{quote?.name}</TableCell>
              <TableCell className="py-5 font-medium">
                {quote?.category?.name}
              </TableCell>

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
                  format(quote?.createdAt, "dd MM yyyy, hh:mm a")}
              </TableCell>

              <TableCell className="py-5 font-medium">
                <div className="flex-center-start gap-x-4">
                  <div>
                    <button
                      onClick={() => {
                        setShowApprovedQuoteModal(!showApprovedQuoteModal);
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

      {approvedQuotes?.length > 9 && (
        <div className="ms-auto mt-8 w-max">
          <CustomPagination
            total={meta?.total}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* Order Modal */}
      <QuoteApprovedModal
        open={showApprovedQuoteModal}
        setOpen={setShowApprovedQuoteModal}
        quote={selectedQuote}
      />
    </>
  );
}
