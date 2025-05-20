import { useChatState } from "./useChatState";
import { useMessageHandlers } from "./useMessageHandlers";
import { useScroll } from "./useScroll";

export const useChat = () => {
    const {
        messages,
        setMessages,
        currentThread,
        setCurrentThread,
        input,
        setInput,
        isLoading,
        setIsLoading
    } = useChatState();

    const { handleSubmit, regenerateMessage, handlePagination } = useMessageHandlers(
        messages,
        setMessages,
        currentThread,
        setCurrentThread,
        setIsLoading
    );

    const messagesEndRef = useScroll([currentThread]);

    return {
        messages,
        currentThread,
        isLoading,
        input,
        setInput,
        handleSubmit,
        regenerateMessage,
        handlePagination,
        messagesEndRef
    };
};