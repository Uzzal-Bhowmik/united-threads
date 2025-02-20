import OrderListTable from "./OrderListTable";

const OrderDetailsContainer = () => {
  return (
    <div>
      <div className='flex justify-between mb-9'>
        <h1 className='text-2xl font-bold'>Orders List</h1>
        {/*<div>
          <DatePicker size="large" /> 
        </div>*/}
      </div>
      <OrderListTable />
    </div>
  );
};

export default OrderDetailsContainer;
