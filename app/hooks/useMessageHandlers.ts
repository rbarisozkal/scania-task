import { Message } from "@/app/types";
import { processStreamingResponse, createMessage, updateMessageChildren } from "@/app/lib/utils";

export const useMessageHandlers = (
    messages: Record<string, Message>,
    setMessages: React.Dispatch<React.SetStateAction<Record<string, Message>>>,
    currentThread: string[],
    setCurrentThread: React.Dispatch<React.SetStateAction<string[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const handleSubmit = async (userInput: string) => {
        if (!userInput.trim()) return;

        const userMessage = createMessage('user', userInput, currentThread[currentThread.length - 1] || null);
        const parentId = userMessage.parentId;

        setMessages(prev => ({
            ...prev,
            [userMessage.id]: userMessage,
            ...(parentId ? updateMessageChildren(prev, parentId, userMessage.id) : {})
        }));

        setCurrentThread(prev => [...prev, userMessage.id]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userInput }),
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const aiMessage = createMessage('ai', '', userMessage.id);

            setMessages(prev => ({
                ...prev,
                [aiMessage.id]: aiMessage,
                [userMessage.id]: {
                    ...prev[userMessage.id],
                    children: [...prev[userMessage.id].children, aiMessage.id]
                }
            }));

            setCurrentThread(prev => [...prev, aiMessage.id]);

            const reader = response.body?.getReader();
            if (reader) {
                await processStreamingResponse(reader, (chunk) => {
                    setMessages(prev => ({
                        ...prev,
                        [aiMessage.id]: {
                            ...prev[aiMessage.id],
                            content: chunk
                        }
                    }));
                });
            }
        } catch (error) {
           console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const regenerateMessage = async (id: string) => {
        const targetMessage = messages[id];
        if (!targetMessage || targetMessage.type !== 'ai') return; //edge case for not to regenerating user message

        const parentMessage = messages[targetMessage.parentId!];
        if (!parentMessage || parentMessage.type !== 'user') return; // same edge case

        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: parentMessage.content }),
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const newAiMessage = createMessage('ai', '', parentMessage.id);

            setMessages(prev => ({
                ...prev,
                [newAiMessage.id]: newAiMessage,
                [parentMessage.id]: {
                    ...prev[parentMessage.id],
                    children: [...prev[parentMessage.id].children, newAiMessage.id]
                }
            }));

            const parentIndex = currentThread.indexOf(parentMessage.id);
            const newThread = [...currentThread.slice(0, parentIndex + 1), newAiMessage.id];
            setCurrentThread(newThread);

            const reader = response.body?.getReader();
            if (reader) {
                await processStreamingResponse(reader, (chunk) => {
                    setMessages(prev => ({
                        ...prev,
                        [newAiMessage.id]: {
                            ...prev[newAiMessage.id],
                            content: chunk
                        }
                    }));
                });
            }
        } catch (error) {
           console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const handlePagination = (id: string, direction: "prev" | "next") => {
        const currentMessage = messages[id];
        if (!currentMessage || currentMessage.type !== 'ai') return;

        const parent = messages[currentMessage.parentId!];
        if (!parent || parent.type !== 'user') return;

        const siblings = parent.children;
        const currentIndex = siblings.indexOf(id);
        if (currentIndex === -1) return;

        const newIndex = Math.max(0, Math.min(
            direction === 'next' ? currentIndex + 1 : currentIndex - 1,
            siblings.length - 1
        ));

        const newSiblingId = siblings[newIndex];
        const threadIndex = currentThread.indexOf(id);

        if (threadIndex !== -1) {
            setCurrentThread(prev => [
                ...prev.slice(0, threadIndex),
                newSiblingId
            ]);
        }
    };

    return { handleSubmit, regenerateMessage, handlePagination };
};