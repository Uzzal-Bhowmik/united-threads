/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useChangePasswordMutation } from "@/redux/api/userApi";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useState } from "react";
import { toast } from "sonner";
type TChangePasswordFormProps = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
const ChangePasswordForm = () => {
  const [error, setError] = useState("");
  const [updateProfile, { isLoading: updateLoading }] = useChangePasswordMutation();
  const [form] = Form.useForm();

  const onFinishEditProfile = async (values: TChangePasswordFormProps) => {
    setError("");
    if (values.newPassword !== values.confirmNewPassword) {
      return setError("Passwords do not match");
    }

    const payload = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    try {
      const res = await updateProfile(payload).unwrap();
      if (res.success) {
        toast.success(res.message);
        form.resetFields();
      }
    } catch (error: any) {
      console.log(error);
      setError(error?.data?.message || "Something went wrong");
    }
  };

  return (
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
      <Form layout='vertical' onFinish={onFinishEditProfile}>
        <Form.Item
          label='Current Password'
          name='currentPassword'
          rules={[
            {
              required: true,
              message: "Please enter your current password!",
            },
          ]}
        >
          <Input.Password size='large' placeholder='Current Password' />
        </Form.Item>

        <Form.Item
          label='New Password'
          name='newPassword'
          rules={[{ required: true, message: "Please enter a new password!" }]}
        >
          <Input.Password size='large' placeholder='New Password' />
        </Form.Item>

        <Form.Item
          label='Confirm New Password'
          name='confirmNewPassword'
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The two passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password size='large' placeholder='Confirm New Password' />
        </Form.Item>
        {error && <p className='text-red-500'>{error}</p>}
        <Form.Item>
          <Button htmlType='submit' loading={updateLoading} block size='large'>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default ChangePasswordForm;
