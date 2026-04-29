"use client";

import React, { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { IChat } from "@/src/types/chat.type";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <div className={`${selectedChat ? "hidden md:block" : "block"} w-full md:w-auto h-full`}>
        <ChatSidebar
          selectedChatId={selectedChat?.id}
          onSelectChat={(chatId) => {
            // Find chat object from sidebar or just pass ID if we prefer
            // For now, let's just update the ID and keep ChatWindow capable of fetching if needed
          }}
          onSelectFullChat={setSelectedChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`${!selectedChat ? "hidden md:flex" : "flex"} flex-1 h-full flex-col`}>
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Your Messages</h2>
              <p className="text-zinc-500 max-w-xs mx-auto">
                Select a conversation from the list to start chatting with your friends and colleagues.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
