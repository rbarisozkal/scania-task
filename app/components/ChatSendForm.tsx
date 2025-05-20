import React from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatSendFormProps {
    input: string;
    setInput: (input: string) => void;
    handleSubmit: (input: string) => void;
    isLoading: boolean;
}

export default function ChatSendForm ({input,setInput,handleSubmit,isLoading}:ChatSendFormProps) {
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(input);
        setInput("");
    };

    return (
        <form onSubmit={onSubmit} className="p-4">
            <div className="flex items-center gap-2 bg-white rounded-lg overflow-hidden shadow-md">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 focus:outline-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full p-2 transition-colors duration-200 mr-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                </button>
            </div>
        </form>
    );
};