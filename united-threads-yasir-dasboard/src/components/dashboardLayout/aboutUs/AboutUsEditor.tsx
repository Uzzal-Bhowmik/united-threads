"use client";

import {
  useCreateSettingsMutation,
  useGetSettingsQuery,
} from "@/redux/features/settings/settingsApi";
import { TResponse } from "@/types/global";
import { Button } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

type TSettings = {
  _id: string;
  label: string;
  content: string;
};

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AboutUsEditor = () => {
  const [value, setValue] = useState("");
  const [createSettings, { isLoading: isCreateLoading }] = useCreateSettingsMutation();

  const handleSave = async () => {
    try {
      const res = await createSettings({ label: "aboutUs", content: value }).unwrap();

      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const { data, isLoading } = useGetSettingsQuery({
    label: "aboutUs",
  });

  const result = data as TResponse<TSettings>;
  const toolbarOptions = [
    ["image"],
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
  ];

  const moduleConest = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    if (data) {
      setValue(result?.data?.content);
    }
  }, [isLoading, result?.data?.content, data]);

  return (
    <>
      <ReactQuill
        modules={moduleConest}
        theme='snow'
        value={value}
        onChange={setValue}
        placeholder='Start writing ......'
        className=''
      />
      <Button
        size='large'
        block
        style={{
          marginTop: "20px",
          backgroundColor: "transparent",
          color: "#000",
          border: "1px solid #232323",
          borderRadius: "20px",
        }}
        onClick={handleSave}
        loading={isCreateLoading}
      >
        Save Changes
      </Button>
    </>
  );
};

export default dynamic(() => Promise.resolve(AboutUsEditor), { ssr: false });
