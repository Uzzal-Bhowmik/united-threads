/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useVerifyAccountMutation } from "@/redux/features/auth/authApi";
import type { FormProps } from "antd";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FieldType = {
  otp?: string;
};

//const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
//  console.log("Failed:", errorInfo);
//};

const VerifyEmailForm = () => {
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();

  //handle password change
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const payload = {
        otp: Number(values.otp),
      };
      const token = sessionStorage.getItem("token");
      const res = await verifyAccount({ data: payload, token }).unwrap();

      if (res.success) {
        sessionStorage.removeItem("token");
        sessionStorage.setItem("token", res.data.accessToken);
        toast.success("Email verified successfully");
        router.push("/setNewPass");
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
        //onFinishFailed={onFinishFailed}
        autoComplete='off'
        layout='vertical'
        className='w-full max-w-lg'
      >
        <Form.Item<FieldType>
          label='OTP'
          name='otp'
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          rules={[{ required: true, message: "Please input OTP" }]}
        >
          <Input.OTP size='large' length={6} />
        </Form.Item>

        {error && <p className='text-red-500 text-center'>{error}</p>}

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button
            loading={isLoading}
            htmlType='submit'
            size='large'
            style={{ backgroundColor: "#232323", color: "#F8FAFC" }}
          >
            Verify
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default VerifyEmailForm;
