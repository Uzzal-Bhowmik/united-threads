import { useGetSingleOrderQuery } from "@/redux/api/orderApi";
import { TOrder } from "@/redux/api/orderType";
import { TResponse } from "@/types/global";
import { Col, Modal, Row, Skeleton } from "antd";
import { Dispatch, SetStateAction } from "react";
import OrderDetails from "./OrderDetailsCard";

type TPropsType = {
  open: string | null;
  setOpen: Dispatch<SetStateAction<string | null>>;
};

const OrderDetailsModal = ({ open, setOpen }: TPropsType) => {
  const { data, isLoading } = useGetSingleOrderQuery({ orderId: open || "" }, { skip: !open });

  const result = data as TResponse<TOrder>;
  const user = result?.data?.user;
  const order = result?.data;

  return (
    <Modal
      style={{ minWidth: "400px" }}
      centered
      footer={null}
      open={!!open}
      onCancel={() => setOpen(null)}
    >
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
          <OrderDetails order={order} user={user} />
        </>
      )}
    </Modal>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className='bg-[#172126] rounded-md py-6 mt-8'>
      <div className='flex justify-center items-center'>
        <div className='relative w-[140px] h-[140px]'>
          <Skeleton.Avatar active size={140} shape='circle' />
        </div>
      </div>
      <Skeleton.Button
        active
        style={{
          width: 200,
          height: 40,
          marginTop: "20px",
          marginLeft: "auto",
          marginRight: "auto",
          display: "block",
        }}
      />
      <div className='grid grid-cols-2 justify-center px-16 gap-8 py-6'>
        <Row gutter={16}>
          <Col span={12}>
            <Skeleton.Input active style={{ width: 100, height: 24 }} />
            <Skeleton.Input active style={{ width: 150, height: 24, marginTop: "-4px" }} />
          </Col>
          <Col span={12}>
            <Skeleton.Input active style={{ width: 100, height: 24 }} />
            <Skeleton.Input active style={{ width: 150, height: 24, marginTop: "-4px" }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Skeleton.Input active style={{ width: 100, height: 24 }} />
            <Skeleton.Input active style={{ width: 150, height: 24, marginTop: "-4px" }} />
          </Col>
          <Col span={12}>
            <Skeleton.Input active style={{ width: 100, height: 24 }} />
            <Skeleton.Input active style={{ width: 150, height: 24, marginTop: "-4px" }} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
