/* eslint-disable react-hooks/exhaustive-deps */
import { useUpdateCategoryMutation } from "@/redux/api/categoryApi";
import { useUpdateQuoteCategoryMutation } from "@/redux/api/quoteCategoryApi";
import { TCategory } from "@/types/categoryTypes";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, FormProps, Input, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";

type TPropsType = {
  category: TCategory | null;
  setCategory: React.Dispatch<
    React.SetStateAction<{ category: TCategory | null; isQuoteCategory: boolean } | null>
  >;
  isQuoteCategory?: boolean | null;
};

type FieldType = {
  name: string;
  image: any;
};

const UpdateCategoryModal = ({ category, setCategory, isQuoteCategory }: TPropsType) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const [updateQuoteCategory, { isLoading: quoteCategoryLoading }] =
    useUpdateQuoteCategoryMutation();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setError("");

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ name: values.name }));
      console.log(values.image[0]);
      if (values.image && values.image[0].originFileObj) {
        // Check if image file is available
        formData.append("image", values.image[0].originFileObj);
      }

      // Avoid uploading image if image is not changed
      const res = isQuoteCategory
        ? await updateQuoteCategory({ categoryId: category?._id, data: formData }).unwrap()
        : await updateCategory({ categoryId: category?._id, data: formData }).unwrap();

      if (res.success) {
        form.resetFields();
        setCategory(null);
      } else {
        setError(res.message);
      }
    } catch (error: any) {
      console.log(error);
      setError(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (category?.image && !fileList[0]?.url) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: category.image,
        },
      ]);
      form.setFieldsValue({
        name: category.name,
        image: [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: category.image,
          },
        ],
      });
    }
  }, [category]);

  return (
    <Modal
      open={!!category}
      footer={null}
      onCancel={() => setCategory(null)}
      centered={true}
      style={{
        minWidth: "max-content",
        position: "relative",
      }}
    >
      <div className='pb-2'>
        <h4 className='text-center text-2xl font-medium'>
          Update {isQuoteCategory ? "quote" : "product"} category{" "}
        </h4>
        <div className='mt-10'>
          <Form layout='vertical' onFinish={onFinish} form={form}>
            <Form.Item label='Category name' name='name'>
              <Input size='large' placeholder='Enter category name' />
            </Form.Item>

            <div className='mb-4'>
              <p className='mb-2 required-indicator text-lg'>Upload Category Image</p>
              <Form.Item
                name='image'
                valuePropName='fileList'
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                rules={[
                  {
                    required: true,
                    message: "Please upload category image",
                  },
                ]}
                style={{
                  textAlign: "center",
                  border: "2px dashed #D9D9D9",
                  paddingBlock: "30px",
                  borderRadius: "10px",
                }}
              >
                <Upload
                  name='image'
                  listType='picture'
                  maxCount={1}
                  fileList={fileList}
                  onChange={(info) => setFileList(info.fileList)}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
            </div>

            {error && <p className='text-red-500 pb-2'>{error}</p>}
            <Button
              loading={isLoading || quoteCategoryLoading}
              htmlType='submit'
              block
              size='large'
            >
              Update
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateCategoryModal;
