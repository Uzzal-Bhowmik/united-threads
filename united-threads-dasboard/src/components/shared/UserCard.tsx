///* eslint-disable @typescript-eslint/no-explicit-any */
//import messageTruncate from "@/utils/messageTruncate";
//import Image from "next/image";

//import { showImage } from "@/utils/fileHelper";
//import timeAgo from "@/lib/utils/timeAgo";

//const UserCard = ({
//  user,
//  message,
//  selectedUser,
//  setSelectedUser,
//  activeUsers,
//  loggedInUserId,
//}: any) => {
//  const userData = { ...user?.participants[0], chatId: user?._id };

//  const isActive: boolean = activeUsers?.includes(userData?._id);

//  return (
//    <div
//      role='button'
//      onClick={() => setSelectedUser(userData)}
//      className={`flex gap-x-2 items-center cursor-pointer hover:bg-[#DBF4E7] p-2 rounded transition-all duration-300 ease-in-out ${
//        selectedUser?._id === userData?._id && "bg-[#DBF4E7]"
//      }`}
//    >
//      <>
//        {userData?.image ? (
//          <div className='relative'>
//            <Image
//              src={userData.}
//              alt={userData?.name}
//              width={50}
//              height={50}
//              className='size-[50px] rounded-full'
//            />

//            {/* Active indicator */}
//            {isActive && (
//              <div className='bg-primaryGreen border-2 border-primaryWhite absolute bottom-0 right-0 w-3 h-3 rounded-full' />
//            )}
//          </div>
//        ) : (
//          <div className='size-[50px] rounded-full bg-[#38885e] flex justify-center items-center text-lg font-medium text-white uppercase'>
//            {userData?.name?.slice(0, 1)}
//          </div>
//        )}
//      </>

//      <div className='flex-grow'>
//        <div className='flex items-center justify-between'>
//          <h4 className='text-lg font-medium text-primary-black capitalize'>{userData?.name}</h4>
//          {selectedUser?._id !== userData?._id && (
//            <p className='text-secondary-2 text-xs text-gray-500'>{timeAgo(message?.createdAt)}</p>
//          )}
//        </div>

//        {!message?.seen &&
//          userData?._id !== selectedUser?._id &&
//          message?.sender !== loggedInUserId && (
//            <p className='text-xs font-semibold'>{messageTruncate(message?.text)}</p>
//          )}
//      </div>
//    </div>
//  );
//};

//export default UserCard;
