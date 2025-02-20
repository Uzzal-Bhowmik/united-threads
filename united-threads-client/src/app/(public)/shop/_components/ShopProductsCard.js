import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import Link from "next/link";
import { Tag } from "antd";

export default function ShopProductsCard({ product }) {
  return (
    <div className="rounded-3xl border border-primary-black/50 p-5 shadow transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="relative">
        <Image
          src={product?.primaryImage}
          alt="product image"
          height={1200}
          width={1200}
          className="mx-auto block h-[200px] w-auto"
        />

        {/* Product Category */}
        <div className="absolute right-0 top-0">
          <Tag color="orange" className="rounded-full font-bold">
            {product?.category?.name}
          </Tag>
        </div>
      </div>

      {/* Name & Rating */}
      <div className="flex-center-between mb-2 mt-4">
        <h4 className="max-w-3/4 text-xl font-bold">{product?.name}</h4>

        {product?.averageRating > 0 && (
          <div className="flex-center-start gap-x-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="#ffad33"
                stroke="#ffad33"
                strokeWidth={2}
                d="M10.307 7.22c.642-1.6.963-2.401 1.485-2.512a1 1 0 0 1 .416 0c.521.11.843.911 1.485 2.512c.365.91.547 1.365.889 1.675q.145.13.31.23c.395.239.888.283 1.874.371c1.669.15 2.503.224 2.758.7a1 1 0 0 1 .106.316c.085.533-.529 1.09-1.756 2.207l-.34.31c-.574.522-.86.783-1.026 1.108a2 2 0 0 0-.198.623c-.052.361.032.74.2 1.497l.06.27c.301 1.358.452 2.037.264 2.37a1 1 0 0 1-.824.508c-.382.019-.921-.42-2-1.299c-.71-.579-1.065-.868-1.459-.981a2 2 0 0 0-1.102 0c-.394.113-.75.402-1.46.981c-1.078.878-1.617 1.318-2 1.3a1 1 0 0 1-.823-.509c-.188-.333-.037-1.012.264-2.37l.06-.27c.168-.757.252-1.136.2-1.497a2 2 0 0 0-.198-.623c-.166-.325-.452-.586-1.026-1.108l-.34-.31c-1.227-1.116-1.84-1.674-1.756-2.207a1 1 0 0 1 .106-.316c.255-.476 1.09-.55 2.758-.7c.986-.088 1.479-.132 1.873-.37a2 2 0 0 0 .31-.231c.343-.31.525-.765.89-1.675Z"
              ></path>
            </svg>

            <p className="pt-1 font-medium">({product?.averageRating}/5)</p>
          </div>
        )}
      </div>

      {/* Price */}
      <h4 className="font-medium">${Number(product?.price)?.toFixed(2)}</h4>

      <div className="flex-center-between mt-3">
        {/* Product colors */}
        <div className="max-w-1/2 flex items-center gap-x-2">
          {product?.colorsPreferences?.slice(0, 3)?.map((color) => (
            <div
              key={color}
              className="rounded-full border border-slate-500 p-1"
            >
              <div
                style={{
                  backgroundColor: color?.includes("#") ? color : `#${color}`,
                }}
                className="h-5 w-5 rounded-full"
              />
            </div>
          ))}
        </div>

        <Link href={`/shop/product/${product?._id}`} className="">
          <Button className="primary-button group rounded-full">
            Buy Now
            <AnimatedArrow />
          </Button>
        </Link>
      </div>
    </div>
  );
}
