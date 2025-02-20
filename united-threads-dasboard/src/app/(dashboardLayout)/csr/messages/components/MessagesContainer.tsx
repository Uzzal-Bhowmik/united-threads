/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Popconfirm, Spin } from "antd";
import {
  ArrowLeftFromLine,
  CircleOff,
  Loader2,
  Paperclip,
  PlusCircleIcon,
  Send,
  X,
} from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import OwnerMsgCard from "@/components/dashboardLayout/csr/message/[user]/OwnerMsgCarda";
import ReceiverMsgCard from "@/components/dashboardLayout/csr/message/[user]/ReceiverMsgCard";
import { useSocket } from "@/lib/Providers/SocketProvider";
import { useUploadFileMutation } from "@/redux/api/messageApi";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { selectUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { TMessage } from "@/types/messageType";
import { TChatList } from "@/types/messageTypes";
import clsx from "clsx";
import moment from "moment";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
// import type { GetProps } from "antd";
// const { Search } = Input;

// type SearchProps = GetProps<typeof Input.Search>;

const MessagesContainer = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [chatListLoading, setChatListLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isMsgSendLoading, setIsMsgSendLoading] = useState(false);
  const { socket } = useSocket();
  const userId = useAppSelector(selectUser)?._id;
  const [chatList, setChatList] = useState<TChatList[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<any>(null);

  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const { data: profile } = useGetProfileQuery([]);

  // const [searchError, setSearchError] = useState<string>("");

  // ================= Image preview handler ================
  useEffect(() => {
    if (image) {
      setImgPreview(URL?.createObjectURL(image));
    }
  }, [image]);

  // ================= Scroll to bottom of chat box ================
  useEffect(() => {
    if (messages) {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // ================ Function to handle the file input click ===============

  // ================== Get chat lists ================
  const handleChatRes = (res: any) => {
    setChatList(res?.data || []);
    //setChatListLoading(false);
  };

  useEffect(() => {
    if (socket && userId) {
      socket.on("my-chat-list", handleChatRes);
    }

    if (socket && userId) {
      socket.emit("my-chat-list", { userId });
    }

    return () => {
      socket?.off("my-chat-list", handleChatRes);
    };
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userId) {
      socket.on("my-messages", (data: any) => {
        setMessages(data?.data);
      });
    }

    if (socket && userId) {
      socket.emit("message-page", { userId: selectedUser?.user?._id });
    }

    return () => {
      socket?.off("message-page");
    };
  }, [socket, userId, selectedUser?.user?._id]);

  useEffect(() => {
    if (socket && userId) {
      // Clean up any existing listeners before adding a new one
      socket.off("new-message::" + userId);

      // Add the listener for new messages
      socket.on("new-message::" + userId, (messageData: any) => {
        if (
          messageData?.data?.sender?._id !== userId &&
          messageData?.data?.receiver?._id !== userId
        ) {
          setMessages((prevMessages) => [...prevMessages, messageData]); // Append new message to the existing list
        }
      });

      // Cleanup function to remove the listener on component unmount or when dependencies change
      return () => {
        socket.off("new-message::" + userId);
      };
    }
  }, [socket, userId, selectedUser?.user?._id]);

  useEffect(() => {
    if (socket) {
      socket.on("online-users", (data) => {
        setActiveUsers(data?.data || []);
      });

      // Cleanup listener on component unmount
      return () => {
        socket.off("online-users", (data) => {
          setActiveUsers(data?.data || []);
        });
      };
    }
  }, [socket]);

  // =================== Send message =================
  //const handleSendMsg = async (data: any) => {
  //  setIsMsgSendLoading(true);
  //  setImage(null);
  //  setImgPreview(null);
  //  fileInputRef.current.value = null;

  //  const payload = {
  //    text: data?.message,
  //    receiver: selectedUser?._id,
  //    imageUrl: "",
  //  };

  //  try {
  //    if (image) {
  //      const formData = new FormData();
  //      formData.append("image", image);

  //      const res = await fileUploadFn(formData).unwrap();
  //      payload.imageUrl = res?.data;
  //    }

  //    if (socket && userId) {
  //      socket.emit("send-message", payload, async () => {
  //        // do nothing
  //      });
  //    }

  //    reset();
  //  } catch (error: any) {
  //    toast.error(error?.data?.message);
  //    setIsMsgSendLoading(false);
  //  }
  //};

  const [files, setFiles] = useState<any[]>([]);
  const [uploadFile] = useUploadFileMutation();
  const [imgPreviews, setImgPreviews] = useState<any[]>([]);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      setFiles(selectedFiles);

      // Generate image previews
      const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImgPreviews(filePreviews);
    }
  };

  // Clean up image previews when the component unmounts to avoid memory leaks
  useEffect(() => {
    return () => {
      imgPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imgPreviews]);

  const [typing, setTyping] = useState<any>(null);

  // Typing and Stop Typing Feature
  useEffect(() => {
    if (socket && selectedUser?.user?._id) {
      socket.on("typing::" + userId, (data) => {
        const user = data?.data;
        if (user._id === selectedUser?.user?._id) {
          setTyping(user); // Show typing indicator
        }
      });
      socket.on("stop-typing::" + userId, (data) => {
        const user = data?.data;
        if (user._id === selectedUser?.user?._id) {
          setTyping(null); // Hide typing indicator
        }
      });

      return () => {
        socket.off("typing::" + userId);
        socket.off("stop-typing::" + userId);
      };
    }
  }, [socket, selectedUser?.user?._id, userId]);

  useEffect(() => {
    if (socket && selectedUser?.user?._id) {
      // Listener for block event
      socket.on(`block::${selectedUser?.user?._id}`, (data) => {
        setSelectedUser((prevDetails: any) => ({
          ...prevDetails,
          user: { ...prevDetails.user, isActive: false }, // Update the isActive state to false when user is blocked
        }));
      });

      // Listener for unblock event
      socket.on(`unblock::${selectedUser?.user?._id}`, (data) => {
        setSelectedUser((prevDetails: any) => ({
          ...prevDetails,
          user: { ...prevDetails.user, isActive: true }, // Update the isActive state to true when user is unblocked
        }));
      });

      // Cleanup the listeners on component unmount
      return () => {
        socket.off(`block::${selectedUser?.user?._id}`);
        socket.off(`unblock::${selectedUser?.user?._id}`);
      };
    }
  }, [socket, selectedUser?.user?._id]);

  // Handle focus and blur events for typing notifications
  const handleFocus = (isTyping: boolean) => {
    if (isTyping) {
      socket?.emit("typing", { receiverId: selectedUser?.user?._id });
    } else {
      socket?.emit("stop-typing", { receiverId: selectedUser?.user?._id });
    }
  };

  // Block and Unblock Feature
  const handleBlockUser = () => {
    socket?.emit("block", { receiverId: selectedUser?.user?._id });
  };

  const handleUnblockUser = () => {
    socket?.emit("unblock", { receiverId: selectedUser?.user?._id });
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!files.length && !data.message) {
      toast.error("Please enter a message or upload an image");
      return;
    }

    setIsMsgSendLoading(true);

    const formData = new FormData();

    // Append files as "files[]"
    if (files.length) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      let images = [];

      if (files.length) {
        const res = await uploadFile(formData).unwrap();
        if (res.success) {
          if (res.data) {
            images = res.data;
          }
        } else {
          toast.error(res.message || "Something went wrong");
        }
      }

      const payload = {
        text: data.message,
        file: images,
        receiverId: selectedUser?.user?._id,
      };

      socket?.emit("send-message", payload);

      reset();
      setFiles([]); // Clear files after sending
      setImgPreviews([]); // Clear previews after sending
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong during upload");
    } finally {
      setIsMsgSendLoading(false);
    }
  };

  // =================== Change seen status =================
  useEffect(() => {
    if (socket && userId && chatId) {
      socket.emit("seen", { chatId });
    }
  }, [chatId, socket, userId]);

  useEffect(() => {
    if (messages) {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // ==================== Show loading while getting chat list =================
  //if (chatListLoading) {
  //  return (
  //    <div className='h-screen w-full flex justify-center items-center'>
  //      <Spin size='large' />
  //    </div>
  //  );
  //}

  return (
    <div className='lg:mx-auto shadow-lg rounded-xl'>
      <div className='relative z-10 flex flex-col rounded-xl rounded-t-xl border-t-8 border-t-primaryGreen px-10 py-8 lg:flex-row'>
        {/* left */}
        <div
          ref={chatBoxRef}
          className='border-opacity-[40%] pr-6 lg:w-[22%] lg:border-r lg:border-gray-300 scroll-hide'
        >
          <div className='border-t-black flex items-end gap-x-5 border-b border-opacity-[40%] py-3 text-black'>
            <h4 className='text-2xl font-bold'>Messages</h4>
          </div>

          <div className='mx-auto mt-4 w-full'>
            {/* TODO: Add a search field */}
            {/* <Search
              placeholder="Search user"
              allowClear
              onSearch={handleSearchUser}
              style={{ width: "100%" }}
              size="large"
              status={searchError && "error"}
            />
            {searchError && <span className="text-red-500">{searchError}</span>} */}

            {/* users list */}
            <div className='scroll-hide mt-6 max-h-[100vh] space-y-2 overflow-auto'>
              {chatList?.map((chat: TChatList) => (
                <UserCard
                  key={chat?.chatId}
                  chat={chat}
                  message={chat?.latestMessage}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  activeUsers={activeUsers}
                  loggedInUserId={userId || ""}
                />
              ))}
            </div>
          </div>
        </div>

        {/* right */}
        <div className='flex flex-col justify-between lg:flex-grow lg:px-8 scroll-hide'>
          {!selectedUser?._id ? (
            <div className='h-[75vh] flex items-center justify-center'>
              <div className='flex items-center gap-x-3 text-xl'>
                <PlusCircleIcon size={26} /> Start a conversation
              </div>
            </div>
          ) : (
            <>
              {messagesLoading ? (
                <div className='h-[75vh] w-full flex justify-center items-center'>
                  <Spin />
                </div>
              ) : (
                <div>
                  <div className='flex items-center justify-between border-b border-opacity-[40%] pb-2 w-full'>
                    <div className='flex items-center gap-x-5 w-full'>
                      {selectedUser?.user?.profilePicture ? (
                        <Image
                          src={selectedUser?.user?.profilePicture || ""}
                          alt={selectedUser?.user?.firstName + " image"}
                          height={50}
                          width={50}
                          className='size-[50px] rounded-full'
                        />
                      ) : (
                        <div className='size-[50px] rounded-full bg-primaryBlack flex justify-center items-center text-lg font-medium text-white uppercase'>
                          {selectedUser?.user?.firstName?.slice(0, 1)}
                        </div>
                      )}

                      <div className='lg:flex-grow flex items-center justify-between w-full'>
                        <div>
                          <h3 className='text-lg font-semibold text-black'>
                            {selectedUser?.user?.firstName}
                          </h3>

                          <div className='flex items-center gap-x-1'>
                            {/* Active/Online Indicator */}
                            {activeUsers?.includes(selectedUser?.user?._id) ? (
                              <>
                                <div className='h-2 w-2 rounded-full bg-green-500' />
                                <p className='text-black border-t-black'>Online</p>
                              </>
                            ) : (
                              <>
                                <div className='h-2 w-2 rounded-full bg-yellow-500' />
                                <p className='text-black border-t-black'>Offline</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center gap-x-1'>
                          {selectedUser?.user?.isActive ? (
                            <Popconfirm
                              title={`Block ${selectedUser?.user?.firstName}`}
                              description='Are you sure you want to block this user?'
                              onConfirm={handleBlockUser}
                              okText='Yes'
                              cancelText='No'
                            >
                              <button className='flex items-center gap-x-2'>
                                <CircleOff size={20} color='#d55758' />
                                <p className='text-xl text-black'>Block</p>
                              </button>
                            </Popconfirm>
                          ) : (
                            <button
                              onClick={handleUnblockUser}
                              className='flex items-center gap-x-2'
                            >
                              <ArrowLeftFromLine size={20} color='green' />
                              <p className='text-xl text-black'>Unblock</p>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div
                    className='scroll-hide max-h-[65vh] min-h-[65vh] overflow-auto py-5 mb-2 pb-16 space-y-4'
                    ref={chatBoxRef}
                  >
                    {/*<div>
                      {messages?.length > 0 &&
                        messages?.map((msg, index) => (
                          <MessageCard
                            key={msg?._id}
                            message={msg}
                            userId={userId}
                            previousMessage={index > 0 ? messages[index - 1] : null}
                            selectedUser={selectedUser}
                          />
                        ))}
                    </div>*/}
                    {messages.length ? (
                      messages.map((msg, index) => (
                        <div key={index}>
                          <div
                            className={`flex ${
                              msg.sender === userId ? "flex-row-reverse" : "flex-row"
                            } items-start gap-x-4`}
                          >
                            {msg.sender === userId ? (
                              profile?.data?.profilePicture ? (
                                <Image
                                  src={profile?.data?.profilePicture}
                                  alt="user's image"
                                  height={50}
                                  width={50}
                                  className='h-[50px] w-[50px] rounded-full'
                                />
                              ) : (
                                <div className='size-[50px] rounded-full bg-primaryBlack flex justify-center items-center text-lg font-medium text-white uppercase'>
                                  {profile?.data?.firstName?.slice(0, 1)}
                                </div>
                              )
                            ) : selectedUser?.user?.profilePicture ? (
                              <Image
                                src={selectedUser?.user?.profilePicture}
                                alt="user's image"
                                height={50}
                                width={50}
                                className='h-[50px] w-[50px] rounded-full'
                              />
                            ) : (
                              <div className='size-[50px] rounded-full bg-primaryBlack flex justify-center items-center text-lg font-medium text-white uppercase'>
                                {selectedUser?.user?.firstName?.slice(0, 1)}
                              </div>
                            )}
                            <div className='max-w-[50%] overflow-hidden'>
                              {msg.sender === userId ? (
                                <OwnerMsgCard
                                  createdAt={msg.createdAt}
                                  file={msg.file}
                                  message={msg.text}
                                />
                              ) : (
                                <ReceiverMsgCard
                                  message={msg.text}
                                  createdAt={msg.createdAt}
                                  file={msg.file}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='flex items-center justify-center h-full'>
                        <p className='text-center text-lg text-gray-400'>
                          No messages yet. Start a conversation
                        </p>
                      </div>
                    )}
                  </div>
                  {!selectedUser?.user?.isActive && (
                    <p className='text-red-500 font-semibold text-xl text-center py-5'>
                      User is not blocked
                    </p>
                  )}
                  {typing && (
                    <div className='text-sm text-gray-500 py-2'>
                      {typing?.firstName} is typing...
                    </div>
                  )}
                  <div>
                    {!!imgPreviews?.length && (
                      <div className='border-b-none relative mx-auto w-[94%] rounded-2xl border-x border-t border-primaryGreen p-2'>
                        <button
                          className='absolute right-2 top-2'
                          onClick={() => {
                            setImage(null);
                            setImgPreview(null);
                            fileInputRef.current.value = null;
                          }}
                        >
                          <X size={20} />
                        </button>
                        <div className='flex items-center gap-x-4'>
                          {!!imgPreviews.length &&
                            imgPreviews.map((file, index) => (
                              <Image
                                key={index}
                                src={file || ""}
                                alt='image preview'
                                height={250}
                                width={250}
                                className='h-[120px] w-auto rounded-2xl'
                              />
                            ))}
                        </div>
                      </div>
                    )}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className='flex items-center justify-center gap-x-4'
                    >
                      <button
                        type='button'
                        disabled={isMsgSendLoading}
                        className='disabled:text-gray-400'
                        onClick={handleFileInputClick}
                      >
                        <input
                          type='file'
                          multiple // Allow multiple file selection
                          ref={fileInputRef}
                          className='hidden'
                          onChange={handleFileChange} // Handle file selection
                          disabled={isMsgSendLoading || !selectedUser?.user?.isActive}
                        />
                        <Paperclip size={20} />
                      </button>

                      <input
                        disabled={isMsgSendLoading || !selectedUser?.user?.isActive}
                        placeholder='Type a message'
                        type='text'
                        onFocus={() => handleFocus(true)}
                        className={clsx(
                          "w-full rounded-2xl border border-primary-black bg-transparent px-4 py-2 text-base font-medium text-primary-black",
                          errors?.message && "outline-red-500",
                        )}
                        {...register("message", {
                          required: imgPreviews.length > 0 ? false : true, // Emit typing event
                          onBlur: () => handleFocus(false), // Emit stop-typing event// Only require message if no image is selected
                        })}
                      />

                      <button
                        disabled={isMsgSendLoading || !selectedUser?.user?.isActive}
                        type='submit'
                        className='border-none shadow-none disabled:text-gray-400'
                      >
                        {isMsgSendLoading ? (
                          <Loader2 size={22} className='animate-spin' />
                        ) : (
                          <Send size={22} />
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesContainer;

type TUserCardProps = {
  chat: TChatList;
  message: TMessage;
  selectedUser: any;
  setSelectedUser: Dispatch<SetStateAction<any>>;
  activeUsers: string[] | undefined;
  loggedInUserId: string;
};

const UserCard = ({
  chat,
  message,
  selectedUser,
  setSelectedUser,
  activeUsers,
  loggedInUserId,
}: TUserCardProps) => {
  const userData = { ...chat?.participants[0], chatId: chat.chatId };
  const isActive: boolean = !!activeUsers?.includes(userData?._id);

  return (
    <div
      role='button'
      onClick={() => setSelectedUser(userData)}
      className={`flex gap-x-2 items-center cursor-pointer hover:bg-gray-200 p-2 rounded transition-all duration-300 ease-in-out ${
        selectedUser?.user?._id === userData?._id && "bg-gray-200"
      }`}
    >
      <>
        {userData?.user?.profilePicture ? (
          <div className='relative'>
            <Image
              src={userData?.user?.profilePicture || ""}
              alt={userData?.user?.firstName}
              width={50}
              height={50}
              className='size-[50px] rounded-full'
            />

            {/* Active indicator */}
            {isActive && (
              <div className='bg-primaryGreen border-2 border-primaryWhite absolute bottom-0 right-0 w-3 h-3 rounded-full' />
            )}
          </div>
        ) : (
          <div className='size-[50px] rounded-full bg-primaryBlack flex justify-center items-center text-lg font-medium text-white uppercase'>
            {userData?.user?.firstName?.slice(0, 1)}
          </div>
        )}
      </>

      <div className='flex-grow'>
        <div className='flex items-center justify-between'>
          <h4 className='text-lg font-medium text-primary-black capitalize'>
            {userData?.user?.firstName}
          </h4>
          {/*{selectedUser?._id !== userData?._id && (*/}
          {/*//<p className='text-secondary-2 text-xs text-gray-500'>{timeAgo(message?.createdAt)}</p>*/}
          <p className='text-secondary-2 text-xs text-gray-500'>
            {moment(message?.createdAt).fromNow()}
          </p>
          {/*)}*/}
        </div>

        {!message?.seen &&
          userData?._id !== selectedUser?._id &&
          message?.sender !== loggedInUserId && (
            <p className='text-xs font-semibold'>{message?.text}</p>
            //<p className='text-xs font-semibold'>{messageTruncate(message?.text)}</p>
          )}
      </div>
    </div>
  );
};

//export function MessageCard({ message, userId, previousMessage, selectedUser }: any) {
//  const isDifferentSender = !previousMessage || previousMessage.sender !== message.sender;

//  // format message sent time
//  const [sentTime, setSentTime] = useState("");
//  useEffect(() => {
//    if (isDifferentSender) {
//      //setSentTime(format(message?.createdAt, "h:mm a"));
//    }
//  }, [isDifferentSender, message]);
//  return (
//    <div className=''>
//      {message?.sender === userId ? (
//        <div className='flex flex-col items-end'>
//          <div>
//            {isDifferentSender && <p className='text-end text-xs text-gray-400'>{sentTime}</p>}
//            <OwnerMsgCard file={message?.file} createdAt={message?.createdAt} message={message} />
//          </div>
//        </div>
//      ) : (
//        <div className='flex flex-col items-start'>
//          {isDifferentSender && <p className='ml-12 text-xs text-gray-400'>{sentTime}</p>}
//          <ReceiverMsgCard
//            message={message}
//            //isDifferentSender={isDifferentSender}
//            //selectedUser={selectedUser}
//            createdAt={message?.createdAt}
//            file={message?.file}
//          />
//        </div>
//      )}
//    </div>
//  );
//}
