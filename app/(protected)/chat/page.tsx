"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ThreadList from "@/components/chat/ThreadList";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatAdminPage() {
  const supabase = createClient();

  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any>(null);

  useEffect(() => {
    loadThreads();
    subscribeRealtime();
  }, []);

  // Load initial threads
  async function loadThreads() {
    const { data, error } = await supabase
      .from("chat_threads")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (error) console.error(error);

    setThreads(data || []);
  }

  // Subscribe realtime (INSERT / UPDATE)
  function subscribeRealtime() {
    supabase
      .channel("chat_threads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_threads" },
        (payload) => {
          loadThreads(); // reload daftar thread
        }
      )
      .subscribe();
  }

  return (
    <div className="flex h-full border rounded-lg overflow-hidden">
      <ThreadList
        threads={threads}
        activeThread={activeThread}
        onSelect={setActiveThread}
      />

      <ChatWindow thread={activeThread} />
    </div>
  );
}
