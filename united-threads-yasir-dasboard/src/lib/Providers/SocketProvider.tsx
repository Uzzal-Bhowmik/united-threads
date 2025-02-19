"use client";
import { selectToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { createContext, useContext, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  socketLoading: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  socketLoading: true,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socketLoading, setSocketLoading] = useState(true);
  const token = useAppSelector(selectToken);
  const socket = useMemo(() => {
    if (token) {
      const socketStore = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        transports: ["websocket"],
        auth: { token },
      });

      socketStore.on("connect", () => {
        console.log("Connected to socket server");
        setSocketLoading(false);
      });

      socketStore.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      return socketStore;
    }
    return null;
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, socketLoading }}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
