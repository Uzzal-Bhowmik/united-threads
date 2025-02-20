/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import userImg from "@/assets/image/messageUser.png";
import userImg2 from "@/assets/image/user.png";
import { useSocket } from "@/lib/Providers/SocketProvider";
import { useUploadFileMutation } from "@/redux/api/messageApi";
import { selectUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { TUser } from "@/types/userType";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Popconfirm } from "antd";
import {
  ArrowLeft,
  ArrowLeftFromLine,
  CircleOff,
  Loader2,
  Paperclip,
  Send,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import OwnerMsgCard from "./OwnerMsgCarda";
import ReceiverMsgCard from "./ReceiverMsgCard";

// Define the type for form data
type MessageFormData = {
  message: string;
};

const MessageContainer = ({ receiverId }: { receiverId: string }) => {
  const [files, setFiles] = useState<any[]>([]); // Handle multiple files
  const [imgPreviews, setImgPreviews] = useState<any[]>([]); // Multiple image previews
  const [messageLoading, setMessageLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]); // State for previous and new messages
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<TUser | null>(null);
  const [typing, setTyping] = useState<null | TUser>(null);
  const [chatId, setChatId] = useState("");

  const user = useAppSelector(selectUser);
  const userId = user?._id;
  const [uploadFile] = useUploadFileMutation();
  const { socket } = useSocket();
  const router = useRouter();

  // Initialize the form with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>(); // Use the defined type

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

  useEffect(() => {
    if (socket && userId) {
      // Emit the event to request message page information (this does not return data directly)
      socket.emit("message-page", { userId: receiverId });

      // Listen for "user-details" event
      socket.on("user-details", (response: any) => {
        if (response.success) {
          setUserDetails(response.data);
        } else {
          toast.error(response.message || "Could not fetch user details");
        }
      });

      // Listen for "my-messages" event (to get the previous messages)
      socket.on("my-messages", (response: any) => {
        if (response.success) {
          setMessages(response.data); // Set the previous messages
        } else {
          toast.error(response.message || "Could not fetch previous messages");
        }
      });

      // Cleanup listeners on unmount
      return () => {
        socket.off("user-details");
        socket.off("my-messages");
      };
    }
  }, [socket, userId, receiverId]);

  // Listen for incoming new messages
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
  }, [socket, userId, receiverId]);

  // Listen for typing events from the server
  useEffect(() => {
    if (socket && receiverId) {
      socket.on("typing::" + userId, (data) => {
        const user = data?.data;
        if (user._id === receiverId) {
          setTyping(data?.data);
        }
      });
      socket.on("stop-typing::" + userId, (data) => {
        const user = data?.data;
        if (user._id === receiverId) {
          setTyping(null);
        }
      });

      //return () => {
      //  socket.off("typing::" + userId);
      //};
    }
  }, [socket, receiverId, userId]);

  useEffect(() => {
    if (socket && receiverId && messages.length > 0 && chatId) {
      console.log({ chatId });
      // Emit the seen event
      socket.emit("seen", { chatId });
    }
  }, [socket, receiverId, messages, chatId]);

  // Handle file selection and generate image previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles); // Set files for upload

      // Generate image previews
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImgPreviews(previews);
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const newFiles = files.filter((_, fileIndex) => fileIndex !== index);
    const newPreviews = imgPreviews.filter((_, previewIndex) => previewIndex !== index);
    setFiles(newFiles); // Remove the selected image from the files array
    setImgPreviews(newPreviews); // Remove the preview
  };

  // Clean up the image URLs when component unmounts or files change to avoid memory leaks
  useEffect(() => {
    return () => {
      imgPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imgPreviews]);

  // Handle form submission using react-hook-form
  const onSubmit: SubmitHandler<MessageFormData> = async (data) => {
    if (!files.length && !data.message) {
      toast.error("Please enter a message or upload an image");
      return;
    }

    setMessageLoading(true);

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
        receiverId: receiverId,
      };

      socket?.emit("send-message", payload);

      reset(); // Reset the form after submission
      setFiles([]); // Clear files after sending
      setImgPreviews([]); // Clear previews after sending
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong during upload");
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setChatId(messages[0]?.chat);
    }
  }, [messages]);

  useEffect(() => {
    if (socket && receiverId) {
      socket.on("io-error", (error: any) => {
        console.log(error);
      });
    }
  }, [socket, receiverId]);

  const handleFocus = (isTyping: boolean) => {
    if (isTyping) {
      socket?.emit("typing", { receiverId });
    } else {
      socket?.emit("stop-typing", { receiverId });
    }
  };

  useEffect(() => {
    if (socket && receiverId) {
      // Listener for block event
      socket.on(`block::${receiverId}`, (data) => {
        setUserDetails((prevDetails: any) => ({
          ...prevDetails,
          isMessageBlock: true, // Update the isActive state to false when user is blocked
        }));
      });

      // Listener for unblock event
      socket.on(`unblock::${receiverId}`, (data) => {
        setUserDetails((prevDetails: any) => ({
          ...prevDetails,
          isMessageBlock: false, // Update the isActive state to true when user is unblocked
        }));
      });

      // Cleanup the listeners on component unmount
      return () => {
        socket.off(`block::${receiverId}`);
        socket.off(`unblock::${receiverId}`);
      };
    }
  }, [socket, receiverId]);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages) {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className='lg:mx-auto max-h-[100vh]'>
      <div className='relative z-10 flex flex-col rounded-xl rounded-t-xl border-t-8 border-t-primaryBlack px-10 py-4 lg:flex-row border'>
        {/* Right - Chat Section */}
        <div className='flex flex-col justify-between lg:flex-grow lg:px-8'>
          <div className=' space-y-0 pt-8'>
            <div className='flex items-center justify-between border-b border-opacity-[40%] pb-1'>
              <div className='flex items-center gap-x-4'>
                <ArrowLeft className='cursor-pointer' onClick={() => router.back()} />
                <div className='flex items-center gap-x-5'>
                  <div className=''>
                    <Image
                      src={
                        userDetails && userDetails?.profilePicture
                          ? userDetails?.profilePicture
                          : userImg
                      }
                      width={50}
                      height={50}
                      alt='user image'
                      className='aspect-square w-full rounded-full'
                    />
                  </div>
                  <div className='lg:flex-grow'>
                    <h3 className='text-xl font-semibold text-black '>
                      {userDetails?.firstName} {userDetails?.lastName}{" "}
                    </h3>
                    <div className='mt-1 flex items-center gap-x-2'>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          activeUsers.find((u: any) => u === receiverId)
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <p className='text-black border-t-black'>
                        {" "}
                        {activeUsers.find((u: any) => u === receiverId) ? (
                          "Online"
                        ) : (
                          <span className='text-gray-400'>Offline</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {userDetails?.isMessageBlock ? (
                <button
                  onClick={() => {
                    socket?.emit("unblock", { receiverId });
                  }}
                  className='flex items-center gap-x-2'
                >
                  <ArrowLeftFromLine size={20} color='green' />
                  <p className='text-xl text-black'>Unblock</p>
                </button>
              ) : (
                <Popconfirm
                  title={`Block ${userDetails?.firstName} `}
                  description='Are you sure to delete this task?'
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={() => {
                    socket?.emit("block", { receiverId });
                  }}
                  okText='Yes'
                  cancelText='No'
                >
                  <button className='flex items-center gap-x-2'>
                    <CircleOff size={20} color='#d55758' />
                    <p className='text-xl text-black'>Block</p>
                  </button>
                </Popconfirm>
              )}
            </div>

            {/* Message Preview Section */}
            <div
              ref={chatBoxRef}
              className='max-h-[54vh] h-full overflow-hidden scroll-hide overflow-y-auto pt-10'
            >
              {messages.length ? (
                messages.map((msg, index) => (
                  <div key={index}>
                    <div
                      className={`flex ${
                        msg.sender === userId ? "flex-row-reverse" : "flex-row"
                      } items-start gap-x-4`}
                    >
                      <Image
                        src={msg.sender === userId ? userImg2 : userImg}
                        alt="user's image"
                        className='h-[50px] w-[50px] rounded-full'
                      />
                      <div className='max-w-[50%] space-y-3 overflow-hidden'>
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
          </div>
          <>
            <Divider />

            {/* Preview selected images */}
            <div className='flex flex-col'>
              <div className='flex gap-2 mt-4'>
                {imgPreviews.map((preview, index) => (
                  <div key={index} className='relative'>
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      className='h-[100px] w-auto rounded-md'
                      width={300}
                      height={300}
                    />
                    <button
                      className='absolute top-0 right-0'
                      onClick={() => handleRemoveImage(index)}
                    >
                      <XCircle size={20} color='red' />
                    </button>
                  </div>
                ))}
              </div>

              {/* File input and message send */}
              <div>
                <div className='flex w-full items-center gap-x-6'>
                  <label htmlFor='file'>
                    <input
                      disabled={!socket || userDetails?.isMessageBlock}
                      type='file'
                      multiple // Allow multiple file selection
                      onChange={handleFileChange}
                      name='file'
                      id='file'
                      className='sr-only'
                    />
                    <Paperclip role='button' />
                  </label>

                  {/* Form submission using react-hook-form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex w-full items-stretch gap-x-4'
                  >
                    <div className='w-full flex flex-col justify-center relative'>
                      {typing && typing?.firstName && (
                        <p className='text-sm text-gray-500 absolute -top-6'>
                          {typing?.firstName} {typing?.lastName} is typing...
                        </p>
                      )}
                      {userDetails?.isMessageBlock && (
                        <p className='text-sm text-gray-500 absolute text-center w-full -top-7'>
                          {userDetails?.firstName} {userDetails?.lastName} is blocked
                        </p>
                      )}

                      <input
                        disabled={!socket || userDetails?.isMessageBlock}
                        onFocus={() => handleFocus(true)}
                        placeholder='Type a message'
                        type='text'
                        className='w-full border-2 border-black/50 bg-transparent rounded-lg px-4 py-2'
                        {...register("message", {
                          required: false,
                          onBlur: () => {
                            handleFocus(false);
                          },
                        })}
                      />
                    </div>
                    <Button
                      disabled={!socket || userDetails?.isMessageBlock}
                      htmlType='submit'
                      className='border-2 border-black/50 bg-transparent py-5'
                    >
                      {messageLoading ? (
                        <Loader2 size={22} className='animate-spin' />
                      ) : (
                        <Send color='#000' />
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
