import React from "react";
import { Message } from "@/app/types";
import { Orbit, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import {sanitizeMessageContent} from "@/app/lib/utils";

interface ChatBubbleProps {
    message: Message;
    isLoading: boolean;
    onRegenerate: (id: string) => Promise<void>;
    onPaginate: (id: string, direction: "prev" | "next") => void;
    siblingsCount: number;
    currentIndex: number;
}

export default function ChatBubble({message,isLoading,onRegenerate,onPaginate, siblingsCount,currentIndex}: ChatBubbleProps) {
    if (!message) return null;
    const cleanedContent = sanitizeMessageContent(message.content);

    return (
        <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            {message.type === "ai" && (
                <div className="flex items-start gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full mr-2">
                        <Orbit className="text-gray-100 w-5 h-5" />
                    </div>
                </div>
            )}

            <div
                className={`relative group max-w-[80%] px-4 py-2 ${
                    message.type === "user"
                        ? "bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl"
                        : "bg-gray-100 text-gray-900 rounded-t-2xl rounded-br-2xl"
                }`}
            >
                <p className="whitespace-pre-wrap">{cleanedContent}</p>

                {message.type === "ai" && (
                    <div className="absolute bottom-0 left-0 flex items-center space-x-2 translate-y-full text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            className="flex items-center text-blue-500 hover:text-blue-700"
                            onClick={() => onRegenerate(message.id)}
                            disabled={isLoading}
                        >
                            <RefreshCw className="w-4 h-4 mr-1 hover:animate-spin" />

                        </button>

                        {siblingsCount > 1 && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onPaginate(message.id, "prev")}
                                    disabled={currentIndex === 0}
                                    className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <span>
                                    {currentIndex + 1}/{siblingsCount}
                                </span>
                                <button
                                    onClick={() => onPaginate(message.id, "next")}
                                    disabled={currentIndex === siblingsCount - 1}
                                    className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
