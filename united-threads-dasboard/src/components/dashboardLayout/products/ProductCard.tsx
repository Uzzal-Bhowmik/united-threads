/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import productImg from "@/assets/product.svg";
import { useDeleteProductMutation } from "@/redux/api/productApi";
import { TProduct } from "@/types/productType";
import { Popconfirm, PopconfirmProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaArrowUp } from "react-icons/fa6";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: TProduct }) => {
  const [deleteProduct] = useDeleteProductMutation();

  const confirm: PopconfirmProps["onConfirm"] = async () => {
    try {
      const res = await deleteProduct({ productId: product._id });
      if (res?.data?.success) {
        //setOpen(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className={`p-4 border border-primaryBlack rounded-xl font-roboto space-y-4 relative`}>
      <div className='flex items-center gap-4 mt-5'>
        <Image src={product.primaryImage ?? productImg} alt={product.name} width={84} height={84} />
        <div>
          <div className=' flex flex-col gap-3'>
            <h1 className='text-xl font-bold'>{product.name}</h1>
            <p className='text-base'> ${product.price}</p>
          </div>
        </div>
      </div>

      {/* delete and esit btn */}
      <div className='mt-2 flex gap-1 absolute top-0 right-1'>
        <Popconfirm
          title='Delete the task'
          description='Are you sure to delete this task?'
          onConfirm={confirm}
          okText='Yes'
          cancelText='No'
        >
          <div className='p-3 bg-red-500 rounded-full cursor-pointer'>
            <FiTrash2 color='#fff' size={16} />
          </div>
        </Popconfirm>

        <Link
          href={`/admin/products/update-product/${product._id}`}
          className='p-3  bg-green-500 rounded-full'
        >
          <FiEdit color='#fff' size={16} />
        </Link>
      </div>

      <div>
        <h3 className='text-lg font-semibold'>Short Description</h3>
        <p>{product.shortDescription}</p>
      </div>
      <div className='border border-[#334A55]/30 p-3 rounded-md space-y-3'>
        <div className='flex justify-between items-center font-semibold'>
          <p>Sales Count</p>
          <p className='flex items-center gap-2'>
            <FaArrowUp size={16} /> {product.salesCount}
          </p>
        </div>
        <div className='border-t'></div>
        <div className='flex justify-between items-center font-semibold'>
          <p>Remaining Products</p>
          {/* <p className=" rounded-xl min-w-16 border-primaryBlack"></p>  */}
          <div className='flex items-center gap-2'>
            <p>{product.stock}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
