"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import {
  getMyConversations,
  getMessages,
  IConversation,
  IMessage,
} from "@/services/chat.service";
import Image from "next/image";

export default function OwnerChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Load conversations ────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    getMyConversations().then((data) => {
      setConversations(data);
    });
  }, [user]);

  // ─── Socket setup ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const socket = connectSocket(user.id);

    socket.on("receive_message", (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === message.conversationId
            ? { ...c, messages: [message], updatedAt: message.createdAt }
            : c
        )
      );
    });

    socket.on("user_typing", (data: { senderName: string }) => {
      setTypingUser(data.senderName);
      setIsTyping(true);
    });

    socket.on("user_stop_typing", () => {
      setIsTyping(false);
      setTypingUser("");
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      disconnectSocket();
    };
  }, [user]);

  // ─── Conversation select ───────────────────────────────────────────────
  const handleSelectConversation = useCallback(
    async (conversation: IConversation) => {
      setActiveConversation(conversation);
      const socket = getSocket();
      socket.emit("join_conversation", conversation.id);

      const data = await getMessages(conversation.id);
      setMessages(data);

      socket.emit("mark_read", {
        conversationId: conversation.id,
        userId: user!.id,
      });
    },
    [user]
  );

  // ─── Auto scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Send message ──────────────────────────────────────────────────────
  const handleSend = () => {
    if (!input.trim() || !activeConversation || !user) return;
    const socket = getSocket();

    socket.emit("send_message", {
      conversationId: activeConversation.id,
      senderId: user.id,
      receiverId: activeConversation.studentId, // ✅ owner থেকে student এ
      content: input.trim(),
    });

    setInput("");
    socket.emit("stop_typing", {
      conversationId: activeConversation.id,
      senderId: user.id,
    });
  };

  // ─── Typing ────────────────────────────────────────────────────────────
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!activeConversation || !user) return;
    const socket = getSocket();

    socket.emit("typing", {
      conversationId: activeConversation.id,
      senderId: user.id,
      senderName: user.name,
    });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", {
        conversationId: activeConversation.id,
        senderId: user.id,
      });
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] border rounded-xl overflow-hidden bg-background">
      {/* ── Sidebar ── */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b font-semibold text-lg">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-center text-muted-foreground text-sm mt-8">
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => {
            // ✅ owner এর জন্য other party হলো student
            const other = conv.student;
            const lastMsg = conv.messages[0];
            const isActive = activeConversation?.id === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors ${
                  isActive ? "bg-muted" : ""
                }`}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted-foreground/20 flex-shrink-0">
                  {other.image ? (
                    <Image
                      src={other.image}
                      alt={other.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center h-full text-sm font-medium">
                      {other.name[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{other.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {lastMsg?.content ?? "Start a conversation"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col">
        {!activeConversation ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted-foreground/20 overflow-hidden relative">
                {activeConversation.student.image ? (
                  <Image
                    src={activeConversation.student.image}
                    alt={activeConversation.student.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full text-sm">
                    {activeConversation.student.name[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {activeConversation.student.name}
                </p>
                {isTyping && (
                  <p className="text-xs text-muted-foreground">
                    {typingUser} is typing...
                  </p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isMe
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString("en-BD", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={handleTyping}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 rounded-full border px-4 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}