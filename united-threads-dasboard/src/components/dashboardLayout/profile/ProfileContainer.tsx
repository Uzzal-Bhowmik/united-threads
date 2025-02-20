/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Skeleton, Tabs, Upload, UploadFile } from "antd";
import Image from "next/image";
import { CiEdit } from "react-icons/ci";
import userImg from "@/assets/image/user.png";
import EditProfileForm from "./EditProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useGetProfileQuery, useUpdateAdminProfileMutation } from "@/redux/api/userApi";
import { TResponse } from "@/types/global";
import { useState } from "react";
import { TUser } from "@/types/userType";
import { toast } from "sonner";

const ProfileContainer = () => {
  const [error, setError] = useState("");
  const { data, isLoading } = useGetProfileQuery([]);
  const result = data as TResponse<TUser>;

  const [updateProfile] = useUpdateAdminProfileMutation();

  const handleSubmit = async (fileList: UploadFile[]) => {
    setError("");
    const toastId = toast.loading("Uploading...");
    const formData = new FormData();
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj; // Access the original file object
      //formData.append("data", JSON.stringify({ firstName: result?.data?.firstName }));
      formData.append("profilePicture", file as Blob); // Append the file directly
    } else {
      setError("No file uploaded");
      return;
    }
    try {
      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        toast.success(res.message, { id: toastId });
      }
    } catch (error: any) {
      console.log(error);
      setError(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='bg-[#434344] py-8 rounded'>
      <div className='bg-[#232323] flex items-center justify-center h-[200px]'>
        <div className='flex items-center gap-x-5'>
          {isLoading ? (
            <>
              <div className='group relative'>
                <Skeleton.Avatar active size={100} shape='circle' />
                <Upload>
                  <div className='bg-white text-black text-lg p-2 rounded-full aspect-square flex items-center justify-center absolute bottom-5 right-0 transition-all duration-300 ease-in-out'>
                    <CiEdit />
                  </div>
                </Upload>
              </div>
              <div className='text-white'>
                <h2 className='font-bold text-4xl'>Loading...</h2>
                <p className='text-xl mt-1 uppercase'>Loading...</p>
              </div>
            </>
          ) : (
            <>
              <div className='group relative'>
                <Image
                  src={result?.data?.profilePicture || userImg}
                  alt='user'
                  width={100}
                  height={100}
                  className='rounded-full aspect-square h-[100px] w-auto object-cover border-4 border-white absolute'
                />
                <Upload
                  showUploadList={false}
                  listType='picture-card'
                  onChange={(info) => handleSubmit(info.fileList)}
                  className='border-none'
                >
                  <div className='bg-white text-black text-lg p-2 rounded-full flex items-center justify-center absolute bottom-5 right-0 transition-all duration-300 ease-in-out'>
                    <CiEdit />
                  </div>
                </Upload>
              </div>
              <div className='text-white'>
                <h2 className='font-bold text-4xl'>
                  {result?.data?.firstName} {result?.data?.lastName}
                </h2>
                <p className='text-xl mt-1 uppercase'>{result?.data?.role}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* forms */}
      <div className='w-1/2 mx-auto mt-16 mb-10'>
        <Tabs defaultActiveKey='1' centered>
          <Tabs.TabPane tab='Edit Profile' key='1'>
            <EditProfileForm />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Change Password' key='2'>
            <ChangePasswordForm />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileContainer;
