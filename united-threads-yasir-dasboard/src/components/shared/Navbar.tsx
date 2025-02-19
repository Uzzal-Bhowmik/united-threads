"use client";
import userImag from "@/assets/image/user.png";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useAppSelector } from "@/redux/hooks";
import { TResponse } from "@/types/global";
import { TUser } from "@/types/userType";
import { Button, Skeleton } from "antd";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import NotificationCount from "./NotificationCount";

const Navbar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: any }) => {
  const pathname = usePathname();
  const { data, isLoading } = useGetProfileQuery([]);
  const result = (data as TResponse<TUser>)?.data;
  const navbarTitle = pathname.split("/")[1];

  return (
    <nav className='flex items-center justify-between py-4 pr-[68px]'>
      <div className='flex items-center gap-x-2'>
        <Button
          type='text'
          icon={
            collapsed ? (
              <RxCross2 size={32} className='text-info' />
            ) : (
              <IoMenu size={32} className='text-info' />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
        />
        <h1 className='capitalize text-2xl font-bold text-info font-roboto'>
          {navbarTitle.length > 1
            ? navbarTitle.replaceAll("/", " ").replaceAll("-", " ")
            : "dashboard"}
        </h1>
      </div>
      <div className='flex items-center gap-x-6'>
        <NotificationCount />
        <Link href={"/profile"}>
          <div className='flex items-center gap-x-3'>
            {isLoading ? (
              <>
                <SkeletonAvatar active={true} size={40} />
                <Skeleton />
              </>
            ) : (
              <>
                <Image
                  src={result?.profilePicture || userImag}
                  alt='admin profile'
                  width={48}
                  height={48}
                  className='rounded-full object-cover h-[48px] w-auto aspect-square'
                />
                <h4 className='text-base font-medium text-info aspect-square '>
                  {result?.firstName}
                </h4>
              </>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
