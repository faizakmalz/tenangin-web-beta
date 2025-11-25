"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Session, AnonUser } from "@/lib/types";
import { SessionTable } from "@/components/tables/SessionTable";
import { AnonUsersTable } from "@/components/tables/AnonUsersTable";

interface Props {
  sessionData: Session[];
  userData: AnonUser[];
}

export default function ActiveUsersComponent({ sessionData, userData }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredSessions = sessionData.filter((s) =>
    s.anon_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full flex flex-col gap-12">

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sesi Konsultasi</h2>

        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => router.push("/active-users/create")}>
            + Buat Sesi
          </Button>

          <Input
            placeholder="Cari sesi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[250px]"
          />
        </div>

        <SessionTable data={filteredSessions} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">User Anonim</h2>

        <AnonUsersTable data={userData} />
      </section>

    </div>
  );
}
