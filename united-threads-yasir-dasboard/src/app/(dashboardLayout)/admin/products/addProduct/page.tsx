import AddNewProduct from "@/components/dashboardLayout/products/addProduct/AddNewProduct";

const AddProduct = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold w-full'>Add Product</h1>
      {/* product add from */}
      <AddNewProduct />
    </div>
  );
};

export default AddProduct;
