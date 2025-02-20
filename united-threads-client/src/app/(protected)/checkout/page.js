import CommonPageHeader from "@/components/CommonPageHeader/CommonPageHeader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Stepper from "./_components/Stepper";

export const metadata = {
  title: "Checkout",
  description: "Checkout page",
};

export default function CheckoutPage() {
  return (
    <div>
      <CommonPageHeader
        pageTitle="Checkout"
        previousPage={{
          pageTitle: "Home",
        }}
      />

      {/** Stepper **
       * Step 1: Billing Information
       * Step 2: Payment
       */}
      <div className="my-10">
        <Stepper />
      </div>
    </div>
  );
}
