export interface Message {
    id: string;
    type: "user" | "ai";
    content: string;
    parentId: string | null;
    children: string[];
}