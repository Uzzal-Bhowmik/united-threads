import { ConfigProvider, Divider, Skeleton, Table } from "antd";
import { CiUser } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";

type TDataType = {
  key: number;
  product: string;
  orderID: string;
  quantity: number;
  total: string;
};

const data: TDataType[] = Array.from({ length: 4 }).map((_, inx) => ({
  key: inx + 1,
  product: "Hoodie",
  orderID: "#25421",
  quantity: 2,
  total: "$800.40",
}));

const columns = [
  {
    title: "Product Name",
    dataIndex: "product",
    render: () => (
      <div className='flex gap-3 items-center'>
        <Skeleton.Avatar active shape='square' size={48} />
        <Skeleton.Input active style={{ width: 120 }} />
      </div>
    ),
  },
  {
    title: "Order ID",
    dataIndex: "orderID",
    render: () => <Skeleton.Input active style={{ width: 100 }} />,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    render: () => <Skeleton.Input active style={{ width: 50 }} />,
  },
  {
    title: "Total",
    dataIndex: "total",
    render: () => <Skeleton.Input active style={{ width: 80 }} />,
  },
];

const OrderProductTableSkeleton = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            colorBgContainer: "rgb(235,237,238)",
            headerBg: "rgb(235,237,238)",
            headerColor: "rgb(35,35,35)",
            headerSplitColor: "rgb(235,237,238)",
            borderColor: "rgb(221,223,224)",
            cellFontSize: 16,
          },
        },
      }}
    >
      <div className='py-6 px-4 bg-[#EBEDEE] rounded'>
        <Skeleton.Input active style={{ width: 200, marginBottom: 20 }} />
        <Divider />
        <Table columns={columns} dataSource={data} pagination={false} />
        <div className='mt-4 flex gap-10 justify-center'>
          <Skeleton.Input active style={{ width: 100 }} />
          <Skeleton.Input active style={{ width: 100 }} />
        </div>
      </div>
    </ConfigProvider>
  );
};

const OrderDetailsSkeleton = () => {
  return (
    <div>
      <div className='flex justify-between'>
        <div>
          <div className='flex items-center gap-3'>
            <Skeleton.Input active style={{ width: 200 }} />
            <Skeleton.Button active shape='round' />
          </div>
          <div className='flex items-center gap-3 mt-3'>
            <LuCalendarDays className='w-6 h-6' />
            <Skeleton.Input active style={{ width: 150 }} />
          </div>
        </div>
        <div className='flex gap-3'>
          <CiUser className='w-12 h-12 rounded-md bg-primaryBlack text-primaryWhite py-2 px-2' />
          <div>
            <Skeleton.Input active style={{ width: 150 }} />
            <Skeleton.Input active style={{ width: 250, marginBottom: 10 }} />
            <Skeleton.Input active style={{ width: 250, marginBottom: 10 }} />
            <Skeleton.Input active style={{ width: 250, marginBottom: 10 }} />
            <Skeleton.Input active style={{ width: 250, marginBottom: 10 }} />
          </div>
        </div>
      </div>
      {/* payment details */}
      <div className='mt-5'>
        <div className='bg-[#EBEDEE] p-4 rounded'>
          <Skeleton.Input active style={{ width: 150, marginBottom: 20 }} />
          <div className='flex justify-between items-center'>
            <div className='flex gap-x-3 items-center '>
              <Skeleton.Avatar active shape='square' size={48} />
              <Skeleton.Input active style={{ width: 200 }} />
            </div>
            <div className='flex gap-x-2 items-center'>
              <Skeleton.Input active style={{ width: 150 }} />
              <Skeleton.Input active style={{ width: 150 }} />
            </div>
          </div>
        </div>
      </div>
      {/* order products table */}
      <div className='mt-6'>
        <OrderProductTableSkeleton />
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;
