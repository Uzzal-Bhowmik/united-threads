"use client";
import { useGetPaymentDataQuery, useGetSingleOrderQuery } from "@/redux/api/orderApi";
import { TOrder, TPayment, TStripeCheckoutSession } from "@/redux/api/orderType";
import { TResponse } from "@/types/global";
import { Divider, Modal, Skeleton } from "antd";
import moment from "moment";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
  orderId: string;
};

const EaringDetaisModal = ({ open, setOpen, orderId }: TPropsType) => {
  const { data, isLoading } = useGetSingleOrderQuery({ orderId });
  const { data: paymentData } = useGetPaymentDataQuery({ orderId });
  const result = data as TResponse<TOrder>;

  const order = result?.data;
  const payment = paymentData?.data as TPayment;

  const parsePaymentData = JSON.parse(payment?.paymentGateway || "{}") as TStripeCheckoutSession;

  return (
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
        <div className='pb-20'>
          <h4 className='text-center text-2xl font-medium'>Transaction Details</h4>
          <div className='mt-10'>
            <div className='flex justify-between'>
              <h4>Order ID : </h4>
              <p className='font-medium'>{order?._id}</p>
            </div>
            <Divider></Divider>
            <div className='flex justify-between'>
              <h4>Date : </h4>
              <p className='font-medium'>
                {moment(order?.createdAt).format("DD MMMM YYYY : hh:mm A")}
              </p>
            </div>
            <Divider></Divider>
            <div className='flex justify-between'>
              <h4>Payment Email :</h4>
              <p className='font-medium'>{parsePaymentData?.customer_details?.email}</p>
            </div>
            <Divider></Divider>
            <div className='flex justify-between'>
              <h4>Transaction amount :</h4>
              <p className='font-medium'>${order?.amount}</p>
            </div>
            <Divider></Divider>
            <div className='flex justify-between'>
              <h4> Buyer name :</h4>
              <p className='font-medium'>
                {order?.user?.firstName} {order?.user?.lastName}{" "}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
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

export default EaringDetaisModal;
