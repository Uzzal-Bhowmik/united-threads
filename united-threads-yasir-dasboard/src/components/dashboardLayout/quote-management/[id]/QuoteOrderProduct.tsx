import {  Form, FormProps, InputNumber, Select } from "antd";
import Image from "next/image";

import TextArea from "antd/es/input/TextArea";
import uploadedImage from "@/assets/image/hoddieImage.png";

// Reset FieldType to match the form fields
type FieldType = {
  category: string;
  size: string;
  quantity: number;
  materialPreference: string;
  price: number;
};

const handleSizeChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

// Setting initial values for all input fields
const initialValues: FieldType = {
  category: "Hoddie",
  size: "L",
  quantity: 10,
  materialPreference:
    "Combinations of materials are looking for 10% cotton , 90% polyester",
  price: 50,
};

const QuoteOrderProduct = () => {
  return (
    <div>
      <div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <div className="space-y-5">
            <div className="flex justify-between">
              <div className="lg:w-1/3 w-full">
                <div>
                  <Form.Item label="category" name="category">
                    <Select size="large" disabled></Select>
                  </Form.Item>
                </div>
                {/* input size */}
                <Form.Item label="Size" name="size">
                  <Select
                    size="large"
                    placeholder="Please Select a size"
                    onChange={handleSizeChange}
                    disabled
                  />
                </Form.Item>

                <div className="mb-10 flex gap-x-5">
                  <div className="border-r-2 pr-6">
                    <h1 className="text-lg ">Color</h1>
                    <div className="border flex items-center gap-2 w-fit py-1 px-2">
                      <div className="size-8 rounded bg-[#455A63]"></div>
                      <p>#455A63</p>
                    </div>
                  </div>
                  <div >
                    <h1 className="text-lg ">Pantone code</h1>
                    <p className="mt-2 text-lg">2736c</p>
                  </div>
                </div>

                {/* input quantity */}
                <Form.Item label="Quantity" name="quantity">
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Please input quantity"
                    disabled
                  />
                </Form.Item>

                {/* input Materials Preference */}
                <Form.Item
                  label="Materials Preference"
                  name="materialPreference"
                >
                  <TextArea readOnly rows={4} placeholder="Write here....." />
                </Form.Item>
              </div>

              <div className="lg:w-1/3 w-full">
                <div className=" mt-10 flex gap-2">
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <Image
                      src={uploadedImage}
                      alt="productImage"
                      className="border border-black px-4 py-8 rounded-lg"
                    />
                    <figcaption className="text-[#00B047] text-xl font-medium rounded-lg">
                      Front Side
                    </figcaption>
                  </div>
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <Image
                      src={uploadedImage}
                      alt="productImage"
                      className="border border-black px-4 py-8"
                    />
                    <figcaption className="text-[#00B047] text-xl font-medium">
                      Back Side
                    </figcaption>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="mt-14  w-[300px]">
                    <h1 className=" flex text-lg justify-between">
                      Paid :<span>$3,200</span>
                    </h1>
                    <h1 className=" flex text-lg justify-between">
                      Due Amount :<span>$590</span>
                    </h1>
                    <h1 className="text-2xl font-medium flex justify-between">
                      Total: <span>$3841</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default QuoteOrderProduct;
