"use client";
import { useDeleteLibraryMutation, useGetLibrariesQuery } from "@/redux/api/libraryApi";
import { TResponse } from "@/types/global";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Empty, Popconfirm, PopconfirmProps, Spin, Pagination } from "antd";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { toast } from "sonner";
import AddLibraryModal from "./components/AddLibraryModal";

type TLibrary = {
  _id: string;
  name: null | string;
  image: string;
  description: null | string;
  isDeleted: boolean;
  status: "PUBLIC" | "PRIVATE";
  tags: null | string | string[];
  createdAt: string;
  updatedAt: string;
};

const LibraryContainer = () => {
  const [open, setOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  // Fetch libraries based on page and pageSize
  const { data, isLoading: productIsLoading } = useGetLibrariesQuery([
    { label: "page", value: page.toString() },
    { label: "limit", value: pageSize.toString() },
  ]);

  const libraries = (data as TResponse<TLibrary[]>) || [];
  const totalLibraries = libraries?.meta?.total || 0;

  return (
    <>
      <div className='space-y-6'>
        <div>
          <Button
            className='w-full bg-[#232323] text-[#fff] font-semibold !py-6 uppercase'
            icon={<CiCirclePlus size={20} color='#fff' />}
            onClick={() => setOpen(true)}
          >
            Add New Library
          </Button>
        </div>

        {productIsLoading ? (
          <div className='w-full flex justify-center h-44 items-center'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          </div>
        ) : !libraries?.data?.length ? (
          <div className='flex justify-center w-full h-44 items-center'>
            <Empty />
          </div>
        ) : (
          <>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {libraries?.data?.map((library) => (
                <LibraryCard key={library._id} library={library} />
              ))}
            </div>
            <div className='w-full flex justify-center'>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalLibraries}
                onChange={(newPage, newPageSize) => {
                  setPage(newPage);
                  if (newPageSize !== pageSize) {
                    setPageSize(newPageSize || 8);
                  }
                }}
                showSizeChanger
                pageSizeOptions={["8", "16", "24", "32"]}
                className='mt-6 text-center'
              />
            </div>
          </>
        )}
      </div>
      <AddLibraryModal open={open} setOpen={setOpen} />
    </>
  );
};

const LibraryCard = ({ library }: { library: TLibrary }) => {
  const [deleteLibrary, { isLoading }] = useDeleteLibraryMutation();

  const confirm: PopconfirmProps["onConfirm"] = async () => {
    try {
      const res = await deleteLibrary({ libraryId: library._id }).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
  };

  return (
    <div className='relative overflow-hidden rounded-lg shadow-lg bg-white p-6'>
      <div className='flex justify-center'>
        {library.image ? (
          <Image
            src={library.image}
            alt={library.name || "Library image"}
            className='max-h-[250px] w-auto'
            width={300}
            height={300}
          />
        ) : (
          <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
            <span className='text-gray-400'>No image available</span>
          </div>
        )}
      </div>
      <Popconfirm
        title='Delete this library'
        description='Are you sure to delete this library?'
        onConfirm={confirm}
        okText='Yes'
        cancelText='No'
      >
        <div className='absolute top-2 right-2'>
          <button className='p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors'>
            <Trash2 className='w-5 h-5 text-white' />
          </button>
        </div>
      </Popconfirm>
      <div className='p-4'>
        <h3 className='text-lg font-semibold truncate'>{library.name || ""}</h3>
        <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{library.description || ""}</p>
        <div className='flex justify-between items-center mt-2'>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              library.status === "PUBLIC"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {library.status}
          </span>
          <span className='text-xs text-gray-500'>
            {new Date(library.updatedAt).toLocaleDateString()}
          </span>
        </div>
        {library.tags && (
          <div className='mt-2 flex flex-wrap gap-1'>
            {(Array.isArray(library.tags) ? library.tags : [library.tags])
              .filter(Boolean)
              .map((tag, index) => (
                <span
                  key={index}
                  className='text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full'
                >
                  {tag}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryContainer;
