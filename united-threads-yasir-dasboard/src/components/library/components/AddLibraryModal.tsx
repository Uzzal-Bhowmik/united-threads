/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorResponse from "@/components/shared/ErrorResponse";
import { useAddCategoryMutation } from "@/redux/api/categoryApi";
import { Button, Form, FormProps, Input, Modal, Upload } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateLibraryMutation } from "@/redux/api/libraryApi";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
};

type FieldType = {
  name: string;
};

const AddLibraryModal = ({ open, setOpen }: TPropsType) => {
  const [image, setImage] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [createLibrary, { isLoading }] = useCreateLibraryMutation();

  const beforePrimaryImageUpload = () => {
    if (image.length >= 1) {
      ErrorResponse({ message: "Please upload a Image for the library" });
      return false;
    }
    return true;
  };

  const handlePrimaryImageChange = ({ fileList: newFileList }: any) => {
    if (newFileList.length <= 1) {
      setImage(newFileList);
    } else {
      ErrorResponse({ message: "You can only upload 1 gallery image." });
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async () => {
    setError("");
    if (!image[0]?.originFileObj) {
      setError("Please select an image for the library.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", image[0]?.originFileObj);
      const res = await createLibrary(formData).unwrap();
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
        <h4 className='text-center text-2xl font-medium'>Add Library </h4>
        <div className='mt-10'>
          <Form layout='vertical' onFinish={onFinish}>
            {/*<Form.Item label='Category name' name='name'>
              <Input size='large' placeholder='Enter category name'></Input>
            </Form.Item>*/}

            <div className='mb-4'>
              <p className='mb-2 required-indicator text-lg'>Upload Library Image</p>
              <Upload
                onChange={handlePrimaryImageChange}
                beforeUpload={beforePrimaryImageUpload}
                fileList={image}
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
              Add Library
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default AddLibraryModal;
