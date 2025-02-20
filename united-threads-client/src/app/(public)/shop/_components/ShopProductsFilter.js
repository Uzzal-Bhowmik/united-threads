"use client";
import CustomSkeleton from "@/components/CustomSkeleton/CustomSkeleton";
import { Input } from "@/components/ui/input";
import { ShopPageContext } from "@/context/ShopPageContext";
import { cn } from "@/lib/utils";
import {
  useGetShopCategoriesQuery,
  useGetShopProductSizesQuery,
} from "@/redux/api/Shop Page Api/shopApi";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";

// motion variants
const fadeVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
  },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function ShopProductsFilter() {
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [sizeExpanded, setSizeExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryIdFromSearchUrl, setCategoryIdFromSearchUrl] = useState(
    useSearchParams().get("category") || "",
  );

  // ============ Categories and sizes api handler ============
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetShopCategoriesQuery();
  const { data: sizes, isLoading: isSizeLoading } =
    useGetShopProductSizesQuery();

  // ============ Get size & category selector from context ============
  const {
    searchText,
    setSearchText,
    setSelectedCategory,
    setSelectedSize,
    selectedCategory,
    selectedSize,
  } = useContext(ShopPageContext);

  // Set search text w/ debouncing
  const handleSearch = useMemo(
    () =>
      debounce(() => {
        setSearchText(searchTerm);
      }, 500), // Hit search api after 500ms of typing
    [searchTerm],
  );

  // Use the debounced handleSearch whenever searchTerm or filters change
  useEffect(() => {
    handleSearch();

    return () => {
      handleSearch.cancel();
    };
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    setSelectedCategory(categoryIdFromSearchUrl);
  }, [categoryIdFromSearchUrl]);

  return (
    <div className="pb-10">
      {/* Product search bar */}
      <div className="relative mb-8">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={20}
        />
        <Input
          className="w-full rounded-3xl border border-primary-black/75 px-10 py-5 text-lg shadow-sm"
          placeholder="Search products..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="mt-4">
        <motion.div
          className="flex items-center justify-between"
          role="button"
          onClick={() => setCategoryExpanded(!categoryExpanded)}
        >
          <h3 className="mt-2 text-lg font-semibold">Category</h3>
          {categoryExpanded ? (
            <ChevronUp size={20} color="#000000" />
          ) : (
            <ChevronDown size={20} color="#000000" />
          )}
        </motion.div>

        {categoryExpanded && (
          <>
            {isCategoriesLoading ? (
              <CustomSkeleton
                className={"mt-5 space-y-3"}
                skeletonClass="w-full h-4 rounded-lg"
                length={8}
              />
            ) : (
              <motion.div
                className="my-5 flex w-full flex-col items-start gap-y-3 px-2"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {categories?.map((category) => (
                  <div key={category?._id} className="relative w-full">
                    {(selectedCategory === category?._id ||
                      categoryIdFromSearchUrl === category?._id) && (
                      <X
                        role="button"
                        size={18}
                        className="absolute -left-8 top-1/2 -translate-y-1/2"
                        onClick={() => setSelectedCategory("")}
                      />
                    )}
                    <motion.button
                      className={cn(
                        "flex-center-between w-full gap-x-2 transition-all duration-300 ease-in-out hover:scale-[0.99] hover:text-primary-black/70",
                        (selectedCategory === category?._id ||
                          categoryIdFromSearchUrl === category?._id) &&
                          "font-extrabold",
                      )}
                      onClick={() => setSelectedCategory(category?._id)}
                    >
                      <p>{category.name}</p>
                      <p>{category.productCount}</p>
                    </motion.button>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Size Filter */}
      <motion.div className="mt-8" layout>
        <motion.div
          className="flex items-center justify-between"
          role="button"
          onClick={() => setSizeExpanded(!sizeExpanded)}
          layout="position"
        >
          <h3 className="mt-2 text-lg font-semibold">Size</h3>
          {sizeExpanded ? (
            <ChevronUp size={20} color="#000000" />
          ) : (
            <ChevronDown size={20} color="#000000" />
          )}
        </motion.div>

        {isSizeLoading ? (
          <CustomSkeleton
            className={"mt-5 space-y-3"}
            skeletonClass="w-full h-4 rounded-lg"
            length={8}
          />
        ) : (
          <>
            {sizeExpanded && (
              <motion.div
                className="my-5 flex w-full flex-col items-start gap-y-3 px-2"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {SIZES?.map((size) => (
                  <div key={size} className="relative w-full">
                    {selectedSize === size && (
                      <X
                        role="button"
                        size={18}
                        className="absolute -left-8 top-1/2 -translate-y-1/2"
                        onClick={() => setSelectedSize("")}
                      />
                    )}

                    <motion.button
                      key={size}
                      className={cn(
                        "flex-center-between w-full gap-x-2 transition-all duration-300 ease-in-out hover:scale-[0.99] hover:text-primary-black/70",
                        selectedSize === size && "font-extrabold",
                      )}
                      onClick={() => setSelectedSize(size)}
                    >
                      <p>{size}</p>
                      <p>{sizes[size]?.productCount || 0}</p>
                    </motion.button>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
