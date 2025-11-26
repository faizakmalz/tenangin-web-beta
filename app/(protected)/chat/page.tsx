"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ThreadList from "@/components/chat/ThreadList";
import ChatWindow from "@/components/chat/ChatWindow";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function ChatAdminPage() {
  const supabase = createClient();

  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
    const channel = subscribeRealtime();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load initial threads
  async function loadThreads() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("chat_threads")
        .select("*")
      console.log(data, 'asdaasdsa')

      if (error) {
        console.error("Error loading threads:", error);
        return;
      }

      setThreads(data || []);
    } catch (err) {
      console.error("Failed to load threads:", err);
    } finally {
      setLoading(false);
    }
  }

  // Subscribe realtime for thread changes
  function subscribeRealtime(): RealtimeChannel {
    const channel = supabase
      .channel("admin-chat-threads")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "chat_threads" 
        },
        (payload) => {
          console.log("Thread change:", payload);
          
          if (payload.eventType === "INSERT") {
            setThreads((prev) => [payload.new as any, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setThreads((prev) =>
              prev.map((t) =>
                t.id === (payload.new as any).id ? (payload.new as any) : t
              )
            );
          } else if (payload.eventType === "DELETE") {
            setThreads((prev) => prev.filter((t) => t.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe((status) => {
        console.log("Thread subscription status:", status);
      });

    return channel;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen border rounded-lg overflow-hidden">
      <ThreadList
        threads={threads}
        activeThread={activeThread}
        onSelect={setActiveThread}
      />

      <ChatWindow thread={activeThread} />
    </div>
  );
}