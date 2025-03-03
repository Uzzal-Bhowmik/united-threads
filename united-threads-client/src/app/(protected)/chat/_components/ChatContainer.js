"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import logo from "/public/logos/logo-normal.svg";
import { useUploadImageMutation } from "@/redux/api/messageApi";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import MessageCard from "./MessageCard";
import { useSocket } from "@/context/SocketContextApi";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { CirclePlus } from "lucide-react";
import { Images } from "lucide-react";
import { SendHorizontal } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { errorToast } from "@/utils/customToast";

export default function ChatContainer() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const [fileUploadFn] = useUploadImageMutation();
  const chatBoxRef = useRef(null);

  const { socket, chatReceiverId } = useSocket();
  const userId = useSelector(selectUser)?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isReceiverOnline, setIsReceiverOnline] = useState(null);
  const [images, setImages] = useState(null);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Function to handle the file input click
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to add emoji in input text
  const handleEmojiClick = (value) => {
    const emoji = value?.emoji;

    // Set react hook form input value
    const currentMessage = getValues("message");
    setValue("message", currentMessage + emoji);

    setShowEmojiPicker(false);
  };

  // Scroll to bottom of chat box
  useEffect(() => {
    if (messages) {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // ------------------ Check if messages exist ------------------
  useEffect(() => {
    if (socket && userId) {
      socket.on("my-messages", (res) => {
        setMessages(res?.data);
      });
    }

    return () => {
      socket?.off("my-messages", (res) => {
        setMessages(res?.data);
      });
    };
  }, [socket, userId]);

  // -------------------- Check if admin is online --------------------
  const onlineUserHandler = (response) => {
    const isOnline = response?.data?.includes("66ed5fedf54918eadde8c63e" || "");

    setIsReceiverOnline(isOnline);
  };

  useEffect(() => {
    if (socket && userId) {
      socket.on("online-users", onlineUserHandler);
    }

    return () => {
      socket?.off("online-users", onlineUserHandler);
    };
  }, [socket, userId]);

  /**
   * Emit `message-page` with receiverId to get
   * 1. Online users -> (onlineUser)
   * 2. Messages -> (message)
   */
  useEffect(() => {
    if (socket && userId) {
      socket.emit("message-page", {});
    }
  }, [socket, userId]);

  /**
   * Listen - New message --> (new-message::receiverId/csrId)
   */
  useEffect(() => {
    if (socket && userId) {
      socket.on(`new-message::${userId}`, async (res) => {
        setMessages((prev) => [...prev, res]);
        setIsLoading(false);
      });
    }

    return () => {
      socket?.off(`new-message::${userId}}`, async (res) => {
        setMessages((prev) => [...prev, res]);
        setIsLoading(false);
      });
    };
  }, [socket, userId]);

  // Send message
  const handleSendMsg = async (data) => {
    setIsLoading(true);

    const payload = {
      text: data?.message,
      file: [],
    };

    try {
      if (images) {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("files", image);
        });

        const res = await fileUploadFn(formData).unwrap();
        payload.file = res?.data;
      }

      if (socket && userId) {
        socket.emit("send-message", payload, async () => {});
      }

      setImgPreviews([]);
      setImages(null);
      fileInputRef.current.value = null;
      reset();
    } catch (error) {
      errorToast(error?.data?.message);
      setIsLoading(false);
    }
  };

  // Image preview
  const [imgPreviews, setImgPreviews] = useState([]);
  useEffect(() => {
    if (images) {
      images.forEach((imgFile) => {
        setImgPreviews((prev) => [...prev, URL.createObjectURL(imgFile)]);
      });
    }
  }, [images]);

  return (
    <div className="border-t-primary-green relative z-10 flex flex-col rounded-xl rounded-t-xl border-t-8 bg-primary-white px-2 py-6 lg:flex-row">
      <div className="flex flex-col justify-between lg:flex-grow lg:px-8">
        <div className="flex-center-between border-b border-b-primary-black/20 pb-1">
          <div className="flex-center-start gap-x-4">
            <Image
              src={logo}
              alt="United Threads logo"
              height={100}
              width={100}
              className="h-16 w-16 rounded-full border border-primary-black/30 p-1"
            />

            <div className="lg:flex-grow">
              <h3 className="text-xl font-bold text-primary-black">
                United Threads
              </h3>

              <div className="flex-center-start gap-x-1">
                {/* Active/Online Indicator */}
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isReceiverOnline ? "bg-green-500" : "bg-yellow-500",
                  )}
                />
                <p className="text-muted-foreground text-sm font-medium">
                  {isReceiverOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="hide-scroll max-h-[65vh] min-h-[65vh] overflow-auto py-10"
          ref={chatBoxRef}
        >
          <div>
            {messages === undefined ? (
              <div className="flex-center min-h-[65vh] w-full gap-x-2 text-2xl font-bold">
                <Loader2 size={50} className="animate-spin" color="#6b7280" />
              </div>
            ) : (
              <>
                {messages?.length > 0 ? (
                  messages?.map((msg, index) => (
                    <MessageCard
                      key={msg?._id}
                      message={msg}
                      userId={userId}
                      previousMessage={index > 0 ? messages[index - 1] : null}
                    />
                  ))
                ) : (
                  <div className="flex-center min-h-[65vh] w-full gap-x-2 text-2xl font-bold">
                    <CirclePlus />
                    <p>Start a conversation</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          {/* Image preview */}
          {imgPreviews?.length > 0 && (
            <div className="border-b-none relative rounded-2xl border-x border-t border-primary-black p-2 lg:w-[89%]">
              <button
                className="absolute right-1 top-1 rounded-full bg-danger p-1 text-white"
                onClick={() => {
                  setImages(null);
                  setImgPreviews([]);
                  fileInputRef.current.value = null;
                }}
              >
                <X size={16} />
              </button>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-7">
                {imgPreviews?.map((imgPreview, idx) => (
                  <Image
                    key={idx}
                    src={imgPreview}
                    alt="image preview"
                    height={250}
                    width={250}
                    className="h-[120px] w-auto rounded-2xl"
                  />
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(handleSendMsg)}
            className="flex-center gap-x-4"
          >
            {/* Message Input */}
            <div className="relative flex-grow">
              <Input
                placeholder="Type a message"
                type="text"
                className={cn(
                  "w-full rounded-full border-[2px] border-primary-black bg-transparent px-4 py-6 pr-14 text-lg font-medium text-primary-black",
                  errors?.message && "outline-red-500",
                )}
                {...register("message", {
                  required: imgPreviews ? false : true,
                })}
              />

              {/* Send Button */}
              <button
                disabled={isLoading}
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border-none bg-black p-2.5 text-primary-white shadow-none disabled:text-gray-400"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <SendHorizontal size={18} />
                )}
              </button>
            </div>

            {/* Buttons */}
            {/* File Input */}
            <button
              type="button"
              disabled={isLoading}
              className="rounded-full bg-slate-200 p-3 disabled:text-gray-400"
              onClick={handleFileInputClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple={true}
                className="hidden"
                onChange={(e) => {
                  setImages([...e.target.files]);
                }}
              />

              <Images size={20} />
            </button>

            {/* Emoji */}
            <div className="relative">
              <button
                type="button"
                className="rounded-full bg-slate-200 p-3 disabled:text-gray-400"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <SmilePlus size={20} />
              </button>

              <div className="absolute bottom-16 right-0">
                <EmojiPicker
                  open={showEmojiPicker}
                  onEmojiClick={handleEmojiClick}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
