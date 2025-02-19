"use client";
import CustomSegment from "@/components/shared/CustomSegment";
import { useGetQuoteCategoriesQuery } from "@/redux/api/quoteCategoryApi";
import { useGetQuoteProductsQuery } from "@/redux/api/quoteProductApi";
import { TCategory } from "@/types/categoryTypes";
import { TResponse } from "@/types/global";
import { TQuoteProduct } from "@/types/quoteProductTypes";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Empty, Pagination, Spin } from "antd";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import AddCategoryModal from "./AddQuoteCategoryModal";
import AddQuoteProduct from "./AddQuoteProduct";
import QuoteProductCard from "./QuoteProductCard";

const QuoteProductContainer = () => {
  const [open, setOpen] = useState(false);
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null | undefined>(null);

  const { data: categoryData, isLoading: categoriesLoading } = useGetQuoteCategoriesQuery({});
  const result = categoryData as TResponse<TCategory[]>;

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8); // Default limit

  // Fetch quote products based on the selected category, page, and pageSize
  const { data: productData, isLoading: productIsLoading } = useGetQuoteProductsQuery([
    { label: "category", value: selectedCategory?.name === "ALL" ? "" : selectedCategory?._id },
    { label: "page", value: page.toString() },
    { label: "limit", value: pageSize.toString() },
  ]);

  const products: TQuoteProduct[] = productData?.data || [];
  const totalProducts = productData?.meta?.total || 0;

  return (
    <>
      <div className='space-y-6'>
        <div>
          <Button
            className='w-full bg-[#232323] text-[#fff] font-semibold !py-6 uppercase'
            icon={<CiCirclePlus size={20} color='#fff' />}
            onClick={() => setOpen(true)}
          >
            Add Quote Category
          </Button>
          <div className='flex items-center justify-between py-4'>
            <h1 className='text-2xl font-bold w-full'>All Quote Products</h1>

            <Button
              className='bg-[#232323] text-[#fff] min-w-48 !py-5'
              icon={<CiCirclePlus size={20} color='#fff' />}
              onClick={() => setOpenAddProduct(!openAddProduct)}
            >
              Add Quote Product
            </Button>
          </div>
          <div className='w-full flex items-center gap-x-6'>
            {/*<Button onClick={handleLeftClick} className='bg-[#232323] text-[#fff] !py-5'>
              <FaChevronLeft size={24} />
            </Button>
            <Segmented
              options={visibleCategories}
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value as string);
                setPage(1); // Reset to first page on category change
              }}
              block
              className='w-full'
            />
            <Button onClick={handleRightClick} className='bg-[#232323] text-[#fff] !py-5'>
              <FaChevronLeft size={24} className='rotate-180' />
            </Button>*/}
            <CustomSegment items={result?.data} setSelectedCategory={setSelectedCategory} />
          </div>
        </div>

        {productIsLoading ? (
          <div className='w-full flex justify-center h-44 items-center'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          </div>
        ) : !products?.length ? (
          <div className='flex justify-center w-full h-44 items-center'>
            <Empty />
          </div>
        ) : (
          <>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
              {products.map((product) => (
                <QuoteProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className='w-full flex justify-center'>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalProducts}
                onChange={(newPage, newPageSize) => {
                  setPage(newPage);
                  if (newPageSize !== pageSize) {
                    setPageSize(newPageSize || 8);
                  }
                }}
                showSizeChanger
                pageSizeOptions={["8", "16", "24", "32"]}
                className='mt-6 text-center'
              />
            </div>
          </>
        )}
      </div>
      <AddCategoryModal open={open} setOpen={setOpen}></AddCategoryModal>
      <AddQuoteProduct open={openAddProduct} setOpen={setOpenAddProduct}></AddQuoteProduct>
    </>
  );
};

export default QuoteProductContainer;
