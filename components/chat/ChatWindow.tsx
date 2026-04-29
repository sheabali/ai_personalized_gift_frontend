"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useSocket } from "@/components/providers/SocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Image as ImageIcon, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMessage, IChat } from "@/src/types/chat.type";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  chat: IChat;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<{ userName: string } | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useAppSelector((state) => state.auth.user);
  const { socket } = useSocket();
  const chatId = chat.id;

  useEffect(() => {
    if (!socket || !chatId) return;

    setIsLoading(true);
    // Fetch messages via socket event
    socket.emit("messageList", { receiverId: chatId });

    socket.on("messages", (data: IMessage[]) => {
      setMessages(data);
      setIsLoading(false);
    });

    socket.on("message", (newMessage: IMessage) => {
      if (newMessage.chatId === chatId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socket.on("typing", (data: { chatId: string; userName: string }) => {
      if (data.chatId === chatId) {
        setTypingUser({ userName: data.userName });
        setIsTyping(true);
      }
    });

    socket.on("stopTyping", (data: { chatId: string }) => {
      if (data.chatId === chatId) {
        setIsTyping(false);
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("messages");
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, chatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId) return;

    const content = message;
    setMessage("");

    // Send message via socket event
    socket?.emit("message", { receiverId: chatId, message: content });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!socket || !currentUser) return;

    const currentId = currentUser?.id || currentUser?.userId;

    if (e.target.value.length > 0) {
      socket.emit("typing", { chatId, userId: currentId, userName: currentUser.name });
    } else {
      socket.emit("stopTyping", { chatId, userId: currentId });
    }
  };

  const getChatName = (chat: IChat) => {
    if (chat.isGroup) return chat.name;
    const currentId = (currentUser?.id || currentUser?.userId || currentUser?._id || "").toString().toLowerCase().trim();
    const otherParticipant = chat.participants?.find(
      (p) => (p.userId || p.user?.id || "").toString().toLowerCase().trim() !== currentId
    );
    return otherParticipant?.user.name || chat.name || "Unknown User";
  };

  const getChatAvatar = (chat: IChat) => {
    if (chat.isGroup) return "";
    const currentId = (currentUser?.id || currentUser?.userId || currentUser?._id || "").toString().toLowerCase().trim();
    const otherParticipant = chat.participants?.find(
      (p) => (p.userId || p.user?.id || "").toString().toLowerCase().trim() !== currentId
    );
    return otherParticipant?.user.avatar || "";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={getChatAvatar(chat)} />
            <AvatarFallback>{getChatName(chat)?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-white leading-tight">
              {getChatName(chat)}
            </h2>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="w-5 h-5 text-zinc-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="w-5 h-5 text-zinc-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5 text-zinc-500" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const currentId = (currentUser?.id || currentUser?.userId || currentUser?._id || "").toString().toLowerCase().trim();
              const senderId = (msg.senderId || "").toString().toLowerCase().trim();
              const isMe = senderId === currentId;
              const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;

              // Robustly find sender info from participants
              const sender = chat.participants?.find(p => (p.userId || p.user?.id || "").toString().toLowerCase().trim() === senderId)?.user || msg.sender;

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2",
                    isMe ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {!isMe && (
                    <div className="w-8">
                      {showAvatar && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={sender?.avatar} />
                          <AvatarFallback>{sender?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?"}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[70%] space-y-1",
                    isMe ? "items-end" : "items-start"
                  )}>
                    {!isMe && chat.isGroup && showAvatar && (
                      <p className="text-[10px] font-medium text-zinc-500 ml-1">
                        {sender?.name}
                      </p>
                    )}
                    <div className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                      isMe
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-none border border-zinc-100 dark:border-zinc-700"
                    )}>
                      {msg.content}
                    </div>
                    <p className="text-[10px] text-zinc-400 px-1">
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </p>
                  </div>
                </div>
              );
            })}

            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{typingUser?.userName?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="rounded-full shrink-0">
            <ImageIcon className="w-5 h-5 text-zinc-500" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="rounded-full shrink-0">
            <Smile className="w-5 h-5 text-zinc-500" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="pr-12 py-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim()}
                className="w-8 h-8 rounded-xl bg-primary hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
