/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/api/userApi";
import { TResponse } from "@/types/global";
import { TUser } from "@/types/userType";
import { Input, message, Popconfirm, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { LiaUserTimesSolid } from "react-icons/lia";
import UserModal from "./UserModal";

const UserMangementContainer = () => {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10000000000);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");

  const { data, isLoading } = useGetUsersQuery([
    { label: "role", value: "CUSTOMER" },
    { label: "limit", value: limit.toString() },
    { label: "searchTerm", value: search },
    { label: "sort", value: "-createdAt" },
  ]);

  const [updateUser] = useUpdateUserMutation();

  const confirm = async (userId: string) => {
    message.loading("Deleting...", 0.5);
    const res = await updateUser({ userId, data: { isDelete: true } }).unwrap();

    if (res?.success) {
      message.success(res?.message);
    } else {
      message.error(res?.message);
    }
    try {
    } catch (error: any) {
      message.error(error.message);
    } finally {
      message.destroy();
    }
  };

  const result = data as TResponse<TUser[]>;

  const columns: TableProps<TUser>["columns"] = [
    //{
    //  title: "Serial",
    //  dataIndex: "key",
    //  render: (value, record, index) => `#${++index}`,
    //},
    {
      title: "Customer Name",
      dataIndex: "firstName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) => moment(value).format("DD MMMM YYYY : hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => (
        <div className='ml-4 flex gap-x-3'>
          <IoEyeOutline
            className='cursor-pointer'
            size={20}
            onClick={() => {
              setOpen(true);
              setUserId(record._id);
            }}
          />
          <Popconfirm
            title='Delete the User'
            description='Are you sure to Delete this user?'
            onConfirm={() => confirm(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <LiaUserTimesSolid className='cursor-pointer' size={20} color='red' />
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!isLoading && result?.meta?.total) {
      setLimit(result?.meta?.total);
    }
  }, [result?.meta?.total, isLoading]);

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <h1 className='text-2xl font-bold w-full'>Customer Management</h1>
        <Input
          type='search'
          placeholder='Search...'
          prefix={<IoIosSearch size={20} />}
          className='max-w-md bg-black text-[#F8FAFC] placeholder:!text-white py-2'
          defaultValue={"Search..."}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={result?.data}
        pagination={{ pageSize: 10, responsive: true }}
      ></Table>
      <UserModal open={open} userId={userId} setOpen={setOpen}></UserModal>
    </div>
  );
};

export default UserMangementContainer;
