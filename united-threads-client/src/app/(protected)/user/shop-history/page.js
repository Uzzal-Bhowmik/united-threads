import CommonPageHeader from "@/components/CommonPageHeader/CommonPageHeader";
import ShopHistoryTable from "./_components/ShopHistoryTable";

export const metadata = {
  title: "Shopping History",
  description: "Shopping history page",
};

export default function ShopHistoryPage() {
  return (
    <div>
      <CommonPageHeader
        pageTitle="Shopping History"
        previousPage={{ pageTitle: "Home" }}
      />

      <div className="my-10 lg:mx-auto lg:w-3/4">
        <ShopHistoryTable />
      </div>
    </div>
  );
}
