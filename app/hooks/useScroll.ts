import { useEffect, useRef } from "react";
import { scrollToBottom } from "@/app/lib/utils";

export const useScroll = (dependencies: any[]) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom(messagesEndRef.current);
    }, dependencies);

    return messagesEndRef;
};