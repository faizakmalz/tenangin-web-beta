"use client";

export default function ThreadList({ threads, activeThread, onSelect }: any) {
  return (
    <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
      <h2 className="font-bold mb-4 text-lg">Daftar Chat</h2>

      {threads.map((t: any) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className={`w-full text-left p-3 rounded-lg mb-2 ${
            activeThread?.id === t.id ? "bg-[#7D2A26] text-white" : "bg-white"
          }`}
        >
          <div className="font-semibold">{t.last_message || "Chat baru"}</div>
          <div className="text-xs text-gray-500">
            {new Date(t.last_message_at || t.created_at).toLocaleString("id-ID")}
          </div>
        </button>
      ))}
    </div>
  );
}
