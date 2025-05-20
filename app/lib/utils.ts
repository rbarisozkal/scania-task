import { Message } from "@/app/types";
export const generateUniqueId = () => {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
};

export const scrollToBottom = (element: HTMLElement | null) => {
    element?.scrollIntoView({ behavior: "smooth" });
};
export const sanitizeMessageContent = (content: string): string => {

    content = content.replace(/\*\*(.*?)\*\*/g, '$1');
    content = content.replace(/^\d+\.\s+/gm, '');
    content = content.replace(/^#+\s+/gm, '');
    return content.trim();
};

export const processStreamingResponse = async (
    reader: ReadableStreamDefaultReader<any>,
    onChunk: (chunk: string) => void
) => {
    const decoder = new TextDecoder();
    let streamedResponse = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        lines.forEach((line) => {
            if (line.startsWith("data: ")) {
                streamedResponse += line.slice(6);
                onChunk(streamedResponse);
            }
        });
    }

    return streamedResponse;
};

export const createMessage = (
    type: Message['type'],
    content: string,
    parentId: string | null
): Message => ({
    id: generateUniqueId(),
    type,
    content,
    parentId,
    children: []
});

export const updateMessageChildren = (
    messages: Record<string, Message>,
    parentId: string,
    childId: string
) => ({
    ...messages,
    [parentId]: {
        ...messages[parentId],
        children: [...messages[parentId].children, childId]
    }
});