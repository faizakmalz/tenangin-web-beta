"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChatWindow({ thread }: any) {
  const supabase = createClient();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!thread) return;

    loadMessages(thread.id);
    const cleanup = subscribeRealtime(thread.id);

    return () => cleanup(); // cleanup realtime saat thread berganti
  }, [thread]);

  /** ================================
   * LOAD MESSAGE AWAL
   * ================================ */
  async function loadMessages(thread_id: string) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", thread_id)
      .order("created_at");

    if (error) console.error(error);

    setMessages(data || []);

    // scroll ke bawah
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  /** ================================
   * REALTIME LISTENER
   * ================================ */
  function subscribeRealtime(thread_id: string) {
    const channel = supabase
        .channel(`chat-${thread_id}`)
        .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `thread_id=eq.${thread_id}`,
        },
        (payload) => {
            setMessages((prev) => [...prev, payload.new]);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
        }
        )
        .subscribe();

    // Cleanup harus synchronous
    return () => {
        supabase.removeChannel(channel);
    };
    }


  /** ================================
   * SEND MESSAGE
   * ================================ */
  async function sendMessage() {
    if (!input.trim()) return;

    const { error } = await supabase.from("chat_messages").insert({
      thread_id: thread.id,
      sender_type: "admin",
      message: input,
    });

    if (error) console.error(error);

    setInput("");
  }

  /** ================================
   * UI RENDER
   * ================================ */

  if (!thread)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Pilih chat untuk mulai
      </div>
    );

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-4 py-2 rounded-lg max-w-[70%] ${
              msg.sender_type === "admin"
                ? "bg-[#7D2A26] text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.message}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div className="flex gap-2 mt-4">
        <input
          className="border p-3 flex-1 rounded-lg"
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-[#7D2A26] text-white rounded-lg"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
