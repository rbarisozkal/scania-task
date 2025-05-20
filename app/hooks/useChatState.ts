import { useState } from "react";
import { Message } from "@/app/types";

export const useChatState = () => {
    const [messages, setMessages] = useState<Record<string, Message>>({});
    const [currentThread, setCurrentThread] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    return {
        messages,
        setMessages,
        currentThread,
        setCurrentThread,
        input,
        setInput,
        isLoading,
        setIsLoading
    };
};