"use client";

import React, { useEffect, useState } from "react";
import { IChat } from "@/src/types/chat.type";
import { useAppSelector } from "@/redux/hooks";
import { useSocket } from "@/components/providers/SocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useGetMeQuery } from "@/redux/api/authApi";

interface ChatSidebarProps {
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
  onSelectFullChat?: (chat: IChat) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedChatId,
  onSelectChat,
  onSelectFullChat,
}) => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: userData } = useGetMeQuery(undefined);
  const fullCurrentUser = userData?.data || currentUser;
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Fetch chat list via socket event
    socket.emit("fetchChats");

    socket.on("myAdminChats", (data: IChat[]) => {
      setChats(data);
      setIsLoading(false);
    });

    return () => {
      socket.off("myAdminChats");
    };
  }, [socket]);

  const getChatName = (chat: IChat) => {
    if (chat.isGroup) return chat.name;
    const currentId = (fullCurrentUser?.id || fullCurrentUser?.userId || fullCurrentUser?._id || "").toString().toLowerCase().trim();
    const otherParticipant = chat.participants?.find(
      (p) => (p.userId || p.user?.id || "").toString().toLowerCase().trim() !== currentId
    );
    return otherParticipant?.user.name || chat.name || "Unknown User";
  };

  const getChatAvatar = (chat: IChat) => {
    if (chat.isGroup) return "";
    const currentId = (fullCurrentUser?.id || fullCurrentUser?.userId || fullCurrentUser?._id || "").toString().toLowerCase().trim();
    const otherParticipant = chat.participants?.find(
      (p) => (p.userId || p.user?.id || "").toString().toLowerCase().trim() !== currentId
    );
    return otherParticipant?.user.avatar || "";
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 w-full md:w-80 lg:w-96">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Messages</h1>
        <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search chats..."
            className="pl-9 bg-zinc-100 dark:bg-zinc-800 border-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col gap-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 items-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-zinc-500">No conversations yet</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  onSelectFullChat?.(chat);
                }}
                className={cn(
                  "flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left",
                  selectedChatId === chat.id && "bg-zinc-100 dark:bg-zinc-800"
                )}
              >
                <Avatar className="w-12 h-12 border border-zinc-200 dark:border-zinc-700">
                  <AvatarImage src={getChatAvatar(chat)} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getChatName(chat)?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                      {getChatName(chat)}
                    </h3>
                    {chat.updatedAt && (
                      <span className="text-xs text-zinc-400">
                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: false })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 truncate">
                    {chat.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
