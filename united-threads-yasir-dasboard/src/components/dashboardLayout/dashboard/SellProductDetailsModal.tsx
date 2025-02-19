"use client";
import productImage from "@/assets/image/hoddieImage.png";
import { useGetSingleOrderQuery } from "@/redux/api/orderApi";
import { TOrder } from "@/redux/api/orderType";
import { TResponse } from "@/types/global";
import { Divider, Modal, Skeleton } from "antd";
import Image from "next/image";
type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
  orderId: string;
};

const SellProductDetailsModal = ({ open, setOpen, orderId }: TPropsType) => {
  const { data, isLoading } = useGetSingleOrderQuery({ orderId });

  const result = data as TResponse<TOrder>;
  const order = result?.data;
  return (
    <>
      <Modal
        open={open}
        footer={null}
        centered={true}
        onCancel={() => setOpen(false)}
        style={{
          minWidth: "max-content",
          position: "relative",
        }}
      >
        {isLoading ? (
          <ProductDetailsSkeleton />
        ) : (
          <div className='pb-2'>
            <h4 className='text-center text-2xl font-medium'>Product Details</h4>
            <div className='mt-5'>
              <Image
                src={order?.product?.primaryImage || order?.quote?.frontSide || productImage}
                alt='image'
                width={1900}
                height={1000}
                className='w-auto mx-auto h-44 object-fill'
              />
              <div className='mt-10'>
                <div className='flex justify-between'>
                  <h4>Product Name :</h4>
                  <p className='font-medium'>{order?.product?.name || order?.quote?.name}</p>
                </div>
                <Divider></Divider>
                <div className='flex justify-between'>
                  <h4>Size:</h4>
                  <div>
                    {/*{productSize.map((s: string, inx: number) => (*/}
                    <span
                      //key={inx}
                      className=' bg-slate-200 p-1 rounded-md text-black m-1 uppercase'
                    >
                      {order?.product?.size || order?.quote?.size}
                    </span>
                    {/*))}*/}
                    <p className='font-medium'></p>
                  </div>
                </div>
                <Divider></Divider>
                <div className='flex justify-between'>
                  <h4>Price :</h4>
                  <p className='font-medium'>${order?.product?.price || order?.quote?.price}</p>
                </div>
                <Divider></Divider>
                <div className='flex justify-between'>
                  <h4>Quantity :</h4>
                  <p className='font-medium'>{order?.quantity}</p>
                </div>
                <Divider></Divider>
                <div className='flex justify-between'>
                  <h4>Total Price :</h4>
                  <p className='font-medium'>${order?.amount}</p>
                </div>
              </div>
            </div>
            {/* action button */}
          </div>
        )}
      </Modal>
    </>
  );
};

const ProductDetailsSkeleton = () => {
  return (
    <div className='pb-2'>
      <Skeleton.Input
        active
        style={{ width: 200, height: 30, margin: "0 auto", display: "block" }}
      />
      <div className='mt-5'>
        <Skeleton.Image style={{ width: "100%", height: "11rem" }} active />
        <div className='mt-10'>
          <div className='flex justify-between'>
            <Skeleton.Input active style={{ width: 120, height: 20 }} />
            <Skeleton.Input active style={{ width: 100, height: 20 }} />
          </div>
          <Divider />
          <div className='flex justify-between'>
            <Skeleton.Input active style={{ width: 50, height: 20 }} />
            <div className='flex'>
              {Array(3)
                .fill(null)
                .map((_, idx) => (
                  <Skeleton.Button
                    key={idx}
                    active
                    style={{ width: 60, height: 30, margin: "0 5px", borderRadius: 4 }}
                  />
                ))}
            </div>
          </div>
          <Divider />
          <div className='flex justify-between'>
            <Skeleton.Input active style={{ width: 50, height: 20 }} />
            <Skeleton.Input active style={{ width: 50, height: 20 }} />
          </div>
          <Divider />
          <div className='flex justify-between'>
            <Skeleton.Input active style={{ width: 80, height: 20 }} />
            <Skeleton.Input active style={{ width: 30, height: 20 }} />
          </div>
          <Divider />
          <div className='flex justify-between'>
            <Skeleton.Input active style={{ width: 100, height: 20 }} />
            <Skeleton.Input active style={{ width: 50, height: 20 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellProductDetailsModal;
