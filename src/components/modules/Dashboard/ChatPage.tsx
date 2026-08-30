"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase";
import browserClient from "@/lib/browserClient";
import { useSearchParams } from "next/navigation";
import {
  getMyConversations,
  getMessages,
  IConversation,
  IMessage,
} from "@/services/chat.service";
import Image from "next/image";

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const broadcastChannelRef = useRef<any>(null);

  const searchParams = useSearchParams();

  const activeConversationRef = useRef<IConversation | null>(null);
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    if (!user) return;
    getMyConversations().then((data) => {
      setConversations(data);

      const conversationId = searchParams.get("conversationId");
      if (conversationId) {
        const target = data.find((c) => c.id === conversationId);
        if (target) handleSelectConversation(target);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, searchParams]);

  // ─── Realtime Message Listener ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    let isCancelled = false;
    let activeChannel: any;
    let client: any;

    getSupabaseClient().then((supabaseClient) => {
      if (isCancelled) return;
      client = supabaseClient;

      activeChannel = supabaseClient.channel("message-updates")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "Message" },
          (payload) => {
            const newMessage = payload.new as any;
            const active = activeConversationRef.current;

            // Format sender details
            const senderDetails =
              newMessage.senderId === user.id
                ? { id: user.id, name: user.name, image: user.image }
                : active && active.id === newMessage.conversationId
                ? {
                    id: active.owner.id,
                    name: active.owner.name,
                    image: active.owner.image,
                  }
                : { id: newMessage.senderId, name: "User", image: null };

            const formattedMessage: IMessage = {
              ...newMessage,
              sender: senderDetails,
            };

            // If it belongs to our active conversation, append it
            if (active && newMessage.conversationId === active.id) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === formattedMessage.id)) return prev;
                return [...prev, formattedMessage];
              });
            }

            // Update conversation list item
            setConversations((prev) =>
              prev.map((c) =>
                c.id === newMessage.conversationId
                  ? {
                      ...c,
                      messages: [formattedMessage],
                      updatedAt: newMessage.createdAt,
                    }
                  : c
              )
            );
          }
        );

      activeChannel.subscribe();
    });

    return () => {
      isCancelled = true;
      if (activeChannel && client) {
        client.removeChannel(activeChannel);
      }
    };
  }, [user]);

  // ─── Typing Indicators Listener ──────────────────────────────────────
  useEffect(() => {
    if (!user || !activeConversation) return;

    let channel: any;

    getSupabaseClient().then((supabaseClient) => {
      channel = supabaseClient.channel(`typing:${activeConversation.id}`, {
        config: { broadcast: { self: false } },
      });

      channel
        .on("broadcast", { event: "typing" }, (payload: any) => {
          setTypingUser(payload.payload.senderName);
          setIsTyping(true);
        })
        .on("broadcast", { event: "stop_typing" }, () => {
          setIsTyping(false);
          setTypingUser("");
        })
        .subscribe();

      broadcastChannelRef.current = channel;
    });

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
      broadcastChannelRef.current = null;
    };
  }, [user, activeConversation]);

  const handleSelectConversation = useCallback(
    async (conversation: IConversation) => {
      setActiveConversation(conversation);

      const data = await getMessages(conversation.id);
      setMessages(data);

      try {
        await browserClient.post(`/chat/mark-read/${conversation.id}`);
      } catch (err) {
        console.error("Failed to mark read:", err);
      }
    },
    []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConversation || !user) return;
    const content = input.trim();
    setInput("");

    try {
      await browserClient.post("/chat/messages", {
        conversationId: activeConversation.id,
        content,
      });

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.send({
          type: "broadcast",
          event: "stop_typing",
          payload: { senderId: user.id },
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!activeConversation || !user) return;

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { senderName: user.name, senderId: user.id },
      });
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.send({
          type: "broadcast",
          event: "stop_typing",
          payload: { senderId: user.id },
        });
      }
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] border rounded-xl overflow-hidden bg-background">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b font-semibold text-lg">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-center text-muted-foreground text-sm mt-8">
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => {
            const other = conv.owner;
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
                    <Image src={other.image} alt={other.name} fill className="object-cover" />
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

      <div className="flex-1 flex flex-col">
        {!activeConversation ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted-foreground/20 overflow-hidden relative">
                {activeConversation.owner.image ? (
                  <Image
                    src={activeConversation.owner.image}
                    alt={activeConversation.owner.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full text-sm">
                    {activeConversation.owner.name[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{activeConversation.owner.name}</p>
                {isTyping && (
                  <p className="text-xs text-muted-foreground">{typingUser} is typing...</p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
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
                          isMe ? "text-primary-foreground/70" : "text-muted-foreground"
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
