"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnnouncementTable } from "@/components/tables/AnnouncementTable";

export default function AnnouncementsComponent({ announcements }: { announcements: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Berita & Pengumuman</h1>

        <Link href="/announcements/create">
          <Button>+ Tambah Baru</Button>
        </Link>
      </div>

      <div className="flex justify-end">
        <Input
          placeholder="Cari..."
          className="w-[250px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <AnnouncementTable data={filtered} />
    </div>
  );
}
