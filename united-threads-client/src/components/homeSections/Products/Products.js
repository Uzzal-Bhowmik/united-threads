"use client";

import ShopProductsCard from "@/app/(public)/shop/_components/ShopProductsCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useGetShopProductsQuery } from "@/redux/api/Shop Page Api/shopApi";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import ProductCardSkeleton from "@/components/ProductCardSkeleton/ProductCardSkeleton";

const fadeUpVariants = {
  initial: {
    y: 10,
    opacity: 0,
  },

  animate: {
    y: 0,
    opacity: 1,
    transition: {
      stiffness: 190,
      damping: 35,
      mass: 0.3,
      staggerChildren: 0.09,
      when: "beforeChildren",
    },
  },
};

const FILTERS = [
  { label: "New Arrival", value: "-createdAt" },
  { label: "Top Rated", value: "-rating" },
  { label: "Most Sold", value: "-salesCount" },
];

export default function Products() {
  const [selectedFilter, setSelectedFilter] = useState("");
  const query = {};
  query[`sort`] = selectedFilter;

  const { data: productsRes, isLoading } = useGetShopProductsQuery(query);
  const products = productsRes?.data || [];

  const handleFilter = (filter) => {
    if (selectedFilter === filter?.value) return setSelectedFilter("");

    setSelectedFilter(filter?.value);
  };

  return (
    <section className="text-primary-black">
      <h2 className="px-10 py-1 text-center text-6xl font-extrabold">
        Wear The Change
      </h2>

      <Separator className="my-5 w-full" />

      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-semibold">Products</h4>

        {/* Filters */}
        <div className="flex items-center gap-x-2">
          {FILTERS.map((filter) => (
            <Button
              key={filter?.value}
              className={cn(
                "rounded-full border border-primary-black bg-white text-primary-black transition-all duration-300 ease-in-out hover:bg-primary-black hover:text-white",
                selectedFilter === filter?.value &&
                  "bg-primary-black text-white",
              )}
              onClick={() => handleFilter(filter)}
            >
              {filter?.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-10">
          {/* Skeleton Loader */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          variants={fadeUpVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-10"
        >
          {products?.slice(0, 6)?.map((product) => (
            <motion.div variants={fadeUpVariants} key={product?._id}>
              <ShopProductsCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Link href={"/shop"} className="mx-auto mt-16 block lg:w-[40%]">
        <button className="group w-full rounded-xl border border-primary-black bg-white px-4 py-3 text-center text-primary-black transition-all duration-300 ease-in-out hover:bg-primary-black hover:text-primary-white">
          Explore Our Shop
        </button>
      </Link>
    </section>
  );
}
