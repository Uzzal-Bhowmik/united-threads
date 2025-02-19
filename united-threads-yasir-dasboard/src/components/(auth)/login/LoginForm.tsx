/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { logout, setUser, TUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { login } from "@/services/login";
import { TResponse } from "@/types/global";
import type { FormProps } from "antd";
import { Button, Checkbox, ConfigProvider, Flex, Form, Input } from "antd";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const LoginForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setError("");
      setLoading(true);
      const res = (await login(values)) as TResponse<any>;
      if (res.success && res?.data?.accessToken) {
        const user = jwtDecode(res.data.accessToken) as TUser;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", res.data.accessToken);

        dispatch(
          setUser({
            user,
            token: res.data.accessToken,
          }),
        );
        if (user.role === "ADMIN") {
          router.push("/admin");
        } else if (user.role === "CSR") {
          router.push("/csr");
        } else if (user.role === "CUSTOMER") {
          logout();
        }
      } else {
        setError(res.message as string);
        setLoading(false);
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
          <Input size='large' type='email' placeholder='Example@gmail.com' />
        </Form.Item>

        <Form.Item<FieldType>
          name='password'
          label='Password'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size='large' placeholder='*******' />
        </Form.Item>

        <Form.Item<FieldType> name='remember' valuePropName='checked' style={{ color: "#F8FAFC" }}>
          <Flex justify='space-between' align='center'>
            <Checkbox style={{ color: "#F8FAFC" }}>Remember me</Checkbox>
            <Link href={"/forgetPassword"} style={{ textDecoration: "" }}>
              <p className='text-[#8ABA51]'>Forgot Password?</p>
            </Link>
          </Flex>
        </Form.Item>

        {error && <p className='text-red-500'>{error}</p>}
        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button
            htmlType='submit'
            size='large'
            style={{ backgroundColor: "#232323", color: "#F8FAFC" }}
            loading={loading}
          >
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default LoginForm;
