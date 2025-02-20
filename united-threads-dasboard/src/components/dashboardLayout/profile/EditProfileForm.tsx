/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetProfileQuery, useUpdateAdminProfileMutation } from "@/redux/api/userApi";
import { TResponse } from "@/types/global";
import { TUser } from "@/types/userType";
import { Button, ConfigProvider, Form, Input, Spin } from "antd";
import { toast } from "sonner";

type TProfileFromValues = {
  name: string;
  email: string;
  contact: string;
};

const EditProfileForm = () => {
  const { data, isLoading } = useGetProfileQuery([]);
  const [updateProfile, { isLoading: updateLoading }] = useUpdateAdminProfileMutation();
  const [form] = Form.useForm();

  const result = data as TResponse<TUser>;
  const onFinishEditProfile = async (values: TProfileFromValues) => {
    const payload = {
      name: values.name,
      email: values.email,
      contact: values.contact,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));

    try {
      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        toast.success(res.message);
        form.resetFields();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className='w-full h-full flex items-center justify-center min-h-20'>
          <Spin size='large' />
        </div>
      ) : (
        <ConfigProvider
          theme={{
            components: {
              Input: {
                colorBgContainer: "transparent",
                activeBorderColor: "#243A40",
                colorTextPlaceholder: "rgb(192, 199, 202)",
                colorIcon: "rgba(255,255,255,0.45)",
                colorBorder: "#D9D9D9",
                colorText: "white",
              },
              Form: {
                labelColor: "white",
              },
              Button: {
                colorBgContainer: "rgb(248,250,252)",
                colorText: "rgb(35,35,35)",
              },
            },
          }}
        >
          <Form
            layout='vertical'
            onFinish={onFinishEditProfile}
            initialValues={{
              firstName: result.data?.firstName,
              lastName: result.data?.lastName,
              contact: result.data?.contact,
              email: result.data?.email,
            }}
          >
            <Form.Item label='First Name' name='firstName'>
              <Input size='large' />
            </Form.Item>
            <Form.Item label='Last Name' name='lastName'>
              <Input size='large' />
            </Form.Item>

            <Form.Item label='Email' name='email'>
              <Input size='large' disabled className='disabled:text-gray-400' />
            </Form.Item>

            <Form.Item label='Contact no' name='contact'>
              <Input size='large' />
            </Form.Item>

            <Form.Item>
              <Button htmlType='submit' loading={updateLoading} block size='large'>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      )}{" "}
    </>
  );
};

export default EditProfileForm;
