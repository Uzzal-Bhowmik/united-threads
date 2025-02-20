"use client";
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import type { FormProps } from "antd";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FieldType = {
  email?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const ForgetPasswordForm = () => {
  const route = useRouter();
  const [error, setError] = useState<string>("");
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  //handle password change
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setError("");
    try {
      const res = await forgetPassword(values).unwrap();
      if (res.success) {
        toast.success("Code sent to your email");
        sessionStorage.setItem("token", res.data.token);
        route.push("/verifyEmail");
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong");
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
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        layout='vertical'
        className='md:w-[481px]'
      >
        <Form.Item<FieldType>
          label='Email'
          name='email'
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input size='large' placeholder='Example@gamil.com' />
        </Form.Item>

        {error && <p className='text-red-500'>{error}</p>}
        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button
            loading={isLoading}
            htmlType='submit'
            size='large'
            style={{ backgroundColor: "#232323", color: "#F8FAFC" }}
          >
            Send Code
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default ForgetPasswordForm;
