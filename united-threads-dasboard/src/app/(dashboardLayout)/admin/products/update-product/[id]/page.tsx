import UpdateProductForm from "../components/updateProductForm";

const UpdateProduct = ({ params }: { params: { id: string } }) => {
  return <UpdateProductForm params={params}></UpdateProductForm>;
};

export default UpdateProduct;
