/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorResponse from "@/components/shared/ErrorResponse";
import { useAddCategoryMutation } from "@/redux/api/categoryApi";
import { Button, Form, FormProps, Input, Modal, Upload } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
};

type FieldType = {
  name: string;
};

const AddCetagoryModal = ({ open, setOpen }: TPropsType) => {
  const [primaryImage, setPrimaryImage] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const beforePrimaryImageUpload = () => {
    if (primaryImage.length >= 1) {
      ErrorResponse({ message: "Please upload a Image for the category" });
      return false;
    }
    return true;
  };

  const handlePrimaryImageChange = ({ fileList: newFileList }: any) => {
    if (newFileList.length <= 1) {
      setPrimaryImage(newFileList);
    } else {
      ErrorResponse({ message: "You can only upload 1 primary image." });
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setError("");
    if (!primaryImage[0]?.originFileObj) {
      setError("Please upload a Image for the category");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(values));
      formData.append("image", primaryImage[0]?.originFileObj);
      const res = await addCategory(formData).unwrap();
      if (res.success) {
        form.resetFields();
        setOpen(false);
      } else {
        setError(res.message);
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      style={{
        minWidth: "max-content",
        position: "relative",
      }}
    >
      <div className='pb-2'>
        <h4 className='text-center text-2xl font-medium'>Add new category </h4>
        <div className='mt-10'>
          <Form layout='vertical' onFinish={onFinish}>
            <Form.Item label='Category name' name='name'>
              <Input size='large' placeholder='Enter category name'></Input>
            </Form.Item>

            <div className='mb-4'>
              <p className='mb-2 required-indicator text-lg'>Upload Primary Image</p>
              <Upload
                onChange={handlePrimaryImageChange}
                beforeUpload={beforePrimaryImageUpload}
                fileList={primaryImage}
                listType='picture'
                maxCount={1}
              >
                <div className='border text-18 font-500 text-primary border-primary rounded flex flex-col items-center px-[200px] py-[20px] cursor-pointer'>
                  <UploadOutlined />
                  <button>Upload</button>
                </div>
              </Upload>
            </div>

            {error && <p className='text-red-500 pb-2'>{error}</p>}
            <Button loading={isLoading} htmlType='submit' block size='large'>
              Add Category
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default AddCetagoryModal;
