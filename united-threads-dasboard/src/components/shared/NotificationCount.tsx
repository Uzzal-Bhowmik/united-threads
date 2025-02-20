"use client";
import { useSocket } from "@/lib/Providers/SocketProvider";
import { useGetNotificationsQuery } from "@/redux/api/notificationApi";
import { useAppSelector } from "@/redux/hooks";
import { TChatList, TResponse } from "@/types/global";
import { TNotification } from "@/types/notificationTypes";
import { MessageSquareText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoBell } from "react-icons/go";

const NotificationCount = () => {
  const [chatList, setChatList] = useState<TChatList[]>([]);

  const user = useAppSelector((state) => state.auth.user);
  const [notification, setNotification] = useState<any>(null);
  const { socket, socketLoading } = useSocket();

  const { data, refetch } = useGetNotificationsQuery(
    [
      { label: "limit", value: "100000000000000" },
      {
        label: "seen",
        value: "false",
      },
    ],
    {
      skip: !user,
    },
  );

  useEffect(() => {
    if (socket) {
      socket.on(`chat-list::${user?._id}`, (data) => {
        setChatList(data?.data || []);
      });
    }

    return () => {
      if (socket) {
        socket.off(`chat-list::${user?._id}`, (data) => {
          setChatList(data?.data || []);
        });
      }
    };
  }, [user, socket]);

  useEffect(() => {
    if (user && socket && !socketLoading) {
      socket?.on("notification::" + user?._id, (data) => {
        refetch();
        setNotification(data.data);
      });
    }

    return () => {
      if (socket) {
        socket.off("notification::" + user?._id, (data) => {
          refetch();
          setNotification(data.data);
        });
      }
    };
  }, [socket, user?._id, user, socketLoading, refetch]);

  const unreadMessageCount = chatList
    ?.map((item) => item?.unreadMessageCount)
    .reduce((a, b) => a + b, 0);

  //const senderId = chatList[0]?.participants?.find((item) => item.user !== user?._id);
  const lastMessageSender =
    chatList[0]?.latestMessage.seen === false ? chatList[0]?.latestMessage.sender : null;

  const notifications = data as TResponse<TNotification[]>;

  const notificationLength = notifications?.data?.length;

  return (
    <div className='flex items-center gap-x-4'>
      <>
        {user?.role === "CSR" && (
          <Link
            href={`${lastMessageSender ? "/csr/message/" + lastMessageSender : "/csr/messages"}`}
          >
            <div
              role='button'
              className='relative aspect-square size-12 rounded-full bg-info flex-item-center'
            >
              <MessageSquareText size={20} />
              {unreadMessageCount > 0 && (
                <span className='absolute top-1.5 right-1.5 size-[18px] bg-warning text-primaryWhite rounded-full text-sm flex-item-center'>
                  {unreadMessageCount}
                </span>
              )}
            </div>
          </Link>
        )}

        <>
          <Link href={`${user?.role === "ADMIN" ? "/admin/notifications" : "/csr/notifications"}`}>
            <div
              role='button'
              className='relative aspect-square size-12 rounded-full bg-info flex-item-center'
            >
              <GoBell size={20} />
              {notificationLength > 0 && (
                <span className='absolute top-1 right-1 size-[16px] p-[10px] bg-warning text-primaryWhite rounded-full text-xs flex items-center justify-center'>
                  {notificationLength > 9 ? "9+" : notificationLength}
                </span>
              )}
            </div>
          </Link>
        </>
      </>
    </div>
  );
};

export default NotificationCount;
