"use client";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import type { FormProps } from "antd";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FieldType = {
  newPass?: string;
  confirmPass?: string;
};

const SetNewPassForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setError("");

    if (values.newPass !== values.confirmPass) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        password: values.newPass,
      };
      const token = sessionStorage.getItem("token");
      const res = await resetPassword({ data: payload, token }).unwrap();

      if (res.success) {
        router.push("/login");
        sessionStorage.removeItem("token");
        toast.success("Password changed successfully");
      }
    } catch (error: any) {
      setError(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: "rgb(248,250,252)",
          },
        },
      }}
    >
      <Form
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
        layout='vertical'
        className='md:w-[481px]'
      >
        <Form.Item<FieldType>
          label='New Password'
          name='newPass'
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input.Password size='large' placeholder='*******' />
        </Form.Item>

        <Form.Item<FieldType>
          name='confirmPass'
          label='Confirm Password'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size='large' placeholder='*******' />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          {error && <p className='text-red-500'>{error}</p>}
          <Button
            loading={isLoading}
            htmlType='submit'
            size='large'
            style={{ backgroundColor: "#232323", color: "#F8FAFC" }}
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default SetNewPassForm;
