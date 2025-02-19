import { Spin } from "antd";

const loading = () => {
  return (
    <div className=" h-screen w-full flex justify-center items-center">
      <Spin size="large" />
    </div>
  );
};

export default loading;
