import browserClient from "@/lib/browserClient";
import { IUser } from "@/types/auth.types";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: Pick<IUser, "id" | "name" | "image">;
}

export interface IConversation {
  id: string;
  studentId: string;
  ownerId: string;
  student: Pick<IUser, "id" | "name" | "image">;
  owner: Pick<IUser, "id" | "name" | "image">;
  messages: IMessage[];
  updatedAt: string;
}

// ─── Services ─────────────────────────────────────────────────────────────────
export const getOrCreateConversation = async (
  ownerId: string
): Promise<IConversation> => {
  const res = await browserClient.post("/chat/conversation", { ownerId });
  return res.data.data;
};

export const getMyConversations = async (): Promise<IConversation[]> => {
  const res = await browserClient.get("/chat/conversations");
  return res.data.data;
};

export const getMessages = async (
  conversationId: string
): Promise<IMessage[]> => {
  const res = await browserClient.get(`/chat/messages/${conversationId}`);
  return res.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await browserClient.get("/chat/unread-count");
  return res.data.data.count;
};