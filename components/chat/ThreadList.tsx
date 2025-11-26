"use client";

interface Thread {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
}

interface ThreadListProps {
  threads: Thread[];
  activeThread: Thread | null;
  onSelect: (thread: Thread) => void;
}

export default function ThreadList({ 
  threads, 
  activeThread, 
  onSelect 
}: ThreadListProps) {
  return (
    <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
      <h2 className="font-bold mb-4 text-lg">Daftar Chat</h2>

      {threads.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          Belum ada chat
        </div>
      ) : (
        threads.map((t) => {
          const isActive = activeThread?.id === t.id;
          const isWaiting = t.status === "waiting";

          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`w-full text-left p-3 rounded-lg mb-2 relative ${
                isActive 
                  ? "bg-[#7D2A26] text-white" 
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {/* Waiting indicator */}
              {isWaiting && (
                <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
              )}

              <div className="font-semibold truncate pr-4">
                {t.last_message || "Chat baru - menunggu"}
              </div>
              
              <div className={`text-xs mt-1 ${
                isActive ? "text-gray-200" : "text-gray-500"
              }`}>
                User: {t.user_id.substring(0, 8)}...
              </div>

              <div className={`text-xs ${
                isActive ? "text-gray-300" : "text-gray-400"
              }`}>
                {new Date(t.last_message_at || t.created_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}