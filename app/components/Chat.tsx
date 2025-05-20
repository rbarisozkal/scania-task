"use client";

import React from "react";
import { useChat } from "@/app/hooks/useChat";
import ChatBubble from "@/app/components/ChatBubble";
import ChatSendForm from "@/app/components/ChatSendForm";

export default function Chat() {
  const {
    messages,
    currentThread,
    isLoading,
    input,
    setInput,
    handleSubmit,
    regenerateMessage,
    handlePagination,
    messagesEndRef,
  } = useChat();

  return (
      <div className="w-screen bg-gray-200 h-screen">
        <div className="flex flex-col max-w-3xl mx-auto text-black h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentThread.map((messageId) => {
              const message = messages[messageId];
              const parent = message?.parentId ? messages[message.parentId] : null;
              const siblingsCount = parent?.children?.length || 0;
              const currentIndex = parent?.children?.indexOf(messageId) ?? 0;

              return (
                  <ChatBubble
                      key={messageId}
                      message={message}
                      isLoading={isLoading}
                      onRegenerate={regenerateMessage}
                      onPaginate={handlePagination}
                      siblingsCount={siblingsCount}
                      currentIndex={currentIndex}
                  />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <ChatSendForm
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
          />
        </div>
      </div>
  );
}