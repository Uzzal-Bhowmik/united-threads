/* eslint-disable @typescript-eslint/no-explicit-any */
import AddNewProduct from "./AddNewProduct";

const AddProductContainer = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold w-full'>Add Product</h1>
      {/* product add from */}
      <AddNewProduct />
    </div>
  );
};

export default AddProductContainer;
