"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContinueToLoginModal from "@/components/ContinueToLoginModal/ContinueToLoginModal";
import { Tag } from "antd";

export default function QuoteProductCard({ product }) {
  const userId = useSelector(selectUser)?._id;
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleRequestQuote = () => {
    if (!userId) {
      setShowLoginModal(true);
    } else {
      router.push(`/products/${product._id}`);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-primary-black/50 p-5 shadow transition-all duration-300 ease-in-out hover:shadow-lg">
        <div className="flex-center relative h-[250px]">
          <Image
            src={product?.frontSide}
            alt="product image"
            height={500}
            width={500}
            className="mx-auto block h-full w-auto rounded"
          />

          {/* Category */}
          <div className="absolute right-0 top-0">
            <Tag color="lime" className="rounded-full font-medium">
              {product?.category?.name}
            </Tag>
          </div>
        </div>

        <div className="flex-center-between mb-5 mt-5 text-xl font-bold">
          <h4>{product?.name}</h4>
        </div>

        <Button
          className="primary-button group rounded-full"
          onClick={handleRequestQuote}
        >
          Request Quote
          <AnimatedArrow arrowSize={16} />
        </Button>
      </div>

      {/* ---- Show continue login if user not found ---- */}
      <ContinueToLoginModal open={showLoginModal} setOpen={setShowLoginModal} />
    </>
  );
}
