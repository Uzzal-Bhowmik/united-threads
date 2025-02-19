import userImage from "@/assets/image/user.png";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { TResponse } from "@/types/global";
import { TUser } from "@/types/userType";
import { Col, Modal, Row, Skeleton } from "antd";
import moment from "moment";
import Image from "next/image";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
  userId?: string;
};
const UserModal = ({ open, setOpen, userId }: TPropsType) => {
  const { data, isLoading } = useGetSingleUserQuery(
    { userId },
    {
      skip: !userId,
    },
  );

  const result = data as TResponse<TUser>;
  const user = result?.data;

  return (
    <Modal
      style={{ minWidth: "max-content" }}
      centered
      footer={null}
      open={open}
      onCancel={() => setOpen(false)}
    >
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
          <div className=' bg-[#172126] rounded-md py-6 mt-8'>
            <div className='flex justify-center items-center'>
              <div className='relative w-[140px] h-[140px] '>
                <Image
                  className='rounded-full border-4 border-white'
                  src={userImage}
                  alt='account image'
                  layout='fill'
                  objectFit='cover'
                />
              </div>
            </div>
            <h2 className=' text-3xl text-center text-white mt-3 font-bold'>
              {user?.firstName} {user?.lastName}
            </h2>
          </div>
          <div className=' grid grid-cols-2 justify-center px-16 gap-8 py-6'>
            <div>
              <p className=' text-lg font-bold'>Name</p>
              <p className=' text-lg mt-[-4px]'>
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className=' text-lg font-bold'>Email</p>
              <p className=' text-lg mt-[-4px]'>{user?.email}</p>
            </div>
            <div>
              <p className=' text-lg font-bold'>Contact</p>
              <p className=' text-lg mt-[-4px]'>{user?.contact}</p>
            </div>
            <div>
              <p className=' text-lg font-bold'>Join Date</p>
              <p className=' text-lg mt-[-4px]'>{moment(user?.createdAt).format("MMMM Do YYYY")}</p>
            </div>
          </div>
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

export default UserModal;
