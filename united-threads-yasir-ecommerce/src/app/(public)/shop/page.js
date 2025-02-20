import CommonPageHeader from "@/components/CommonPageHeader/CommonPageHeader";
import ShopContainer from "./_components/ShopContainer";
import ShopProductsFilter from "./_components/ShopProductsFilter";
import ShopPageProvider from "@/context/ShopPageContext";

export const metadata = {
  title: "Shop Now",
  description: "Shop now page",
};

export default function ShopPage() {
  return (
    <ShopPageProvider>
      <div className="">
        <CommonPageHeader
          pageTitle="Shop Now"
          previousPage={{
            pageTitle: "Home",
          }}
        />

        <div className="flex-start-between my-16 lg:mx-auto lg:w-3/4 lg:gap-x-16">
          <div className="lg:w-[22%]">
            <ShopProductsFilter />
          </div>

          <div className="lg:flex-grow">
            <ShopContainer />
          </div>
        </div>
      </div>
    </ShopPageProvider>
  );
}
