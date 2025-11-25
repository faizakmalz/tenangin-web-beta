"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("news");
  const [content, setContent] = useState("");

  async function submit() {
    await supabase.from("announcements").insert({
      title,
      category,
      content,
    });

    router.push("/announcements");
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Tambah Berita / Pengumuman</h1>

      <Input placeholder="Judul" value={title} onChange={(e) => setTitle(e.target.value)} />

      <select
        className="border p-2 rounded-lg"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="news">Berita</option>
        <option value="announcement">Pengumuman</option>
      </select>

      <textarea
        className="border p-3 rounded-lg w-full h-48"
        placeholder="Isi konten..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button onClick={submit}>Simpan</Button>
    </div>
  );
}
