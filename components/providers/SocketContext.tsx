"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/redux/hooks";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Extract base URL from NEXT_PUBLIC_BASE_URL (remove /api/v1)
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const socketUrl = apiUrl.replace("/api/v1", "");

    const newSocket = io(socketUrl, {
      auth: {
        token: token,
      },
      transports: ["websocket"], // Recommended for performance
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    newSocket.on("connect_error", (error: any) => {
      console.error("Connection error:", error.message);
      setIsConnected(false);
    });

    newSocket.on("socketError", (error: { message: string }) => {
      console.error("Socket logic error:", error.message);
    });

    newSocket.on("error", (error: any) => {
      console.error("General error:", error);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, user?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
