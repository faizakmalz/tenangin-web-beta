"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_type: "user" | "admin";
  message: string;
  created_at: string;
}

interface Thread {
  id: string;
  user_id: string;
  status: string;
}

export default function ChatWindow({ thread }: { thread: Thread | null }) {
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!thread) {
      setMessages([]);
      return;
    }

    loadMessages(thread.id);
    subscribeRealtime(thread.id);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [thread?.id]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  /** Load initial messages */
  async function loadMessages(thread_id: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("thread_id", thread_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      setMessages(data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }

  /** Subscribe to realtime messages */
  function subscribeRealtime(thread_id: string) {
    // Remove previous channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`chat-messages-${thread_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `thread_id=eq.${thread_id}`,
        },
        (payload) => {
          console.log("New message received:", payload);
          const newMessage = payload.new as Message;
          
          setMessages((prev) => {
            // Prevent duplicates
            if (prev.some((m) => m.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .subscribe((status) => {
        console.log("Message subscription status:", status);
      });

    channelRef.current = channel;
  }

  /** Send message as admin */
  async function sendMessage() {
    if (!input.trim() || !thread) return;

    try {
      setSending(true);

      // Get current admin user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user");
        return;
      }

      const { error } = await supabase.from("chat_messages").insert({
        thread_id: thread.id,
        sender_id: user.id, // Admin's user ID
        sender_type: "admin",
        message: input.trim(),
      });

      if (error) {
        console.error("Error sending message:", error);
        alert("Gagal mengirim pesan: " + error.message);
        return;
      }

      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  }

  /** Handle Enter key */
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  /** UI Render */
  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Pilih chat untuk mulai
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 bg-gray-50">
        <h3 className="font-semibold">Chat dengan User</h3>
        <p className="text-sm text-gray-500">
          User ID: {thread.user_id.substring(0, 16)}...
        </p>
        <p className="text-xs text-gray-400">Status: {thread.status}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">Belum ada pesan</div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_type === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] break-words ${
                  msg.sender_type === "admin"
                    ? "bg-[#7D2A26] text-white"
                    : "bg-white text-black border"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.message}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender_type === "admin"
                      ? "text-gray-200"
                      : "text-gray-400"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <textarea
            className="border p-3 flex-1 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#7D2A26]"
            placeholder="Ketik pesan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={2}
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="px-6 py-2 bg-[#7D2A26] text-white rounded-lg hover:bg-[#651F1C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? "Sending..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}