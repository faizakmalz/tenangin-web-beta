'use client';

import { useEffect, useState } from "react";
import { SessionTable } from "@/components/tables/SessionTable";
import { useRouter } from "next/navigation";
import { BriefcaseIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon, UsersIcon } from "@heroicons/react/20/solid";

interface DashboardComponentProps {
  initialData: any[]
}

export default function DashboardComponent({ initialData }: DashboardComponentProps) {
  const [data, setData] = useState<any[]>(initialData);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 pt-6 w-full">
      <div className="w-full pt-20 mx-auto sm:px-6 lg:px-8 flex flex-col">

        <h1 className="font-bold text-[45px] pl-2 mb-2 text-gray-700">
          Selamat Datang Admin!
        </h1>

        <div className="flex flex-col w-full mb-2">
          <h1 className="font-semibold text-2xl pl-2 mb-4 text-gray-700">
           Berikut Ringkasan Aktivitas Hari Ini!
          </h1>

          <div className="flex flex-wrap gap-4 w-full mb-4">
            <div className="relative p-6 h-56 flex flex-col items-start justify-center rounded-2xl bg-[#fff8d3] flex-1 text-center text-[#555168]">
              <UsersIcon className="h-8 w-8 text-[#b7a3ff] top-4 left-4" />
              <p className="text-[32px] font-bold">1.284</p>
              <p className="font-semibold">Pengguna</p>
            </div>

            <div className="relative p-6 h-56 flex flex-col items-start justify-center rounded-2xl bg-[#fff8d3] flex-1 text-center text-[#555168]">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#b7a3ff] top-4 left-4" />
              <p className="text-[32px] font-bold">42</p>
              <p className="font-semibold">Sesi</p>
            </div>

            <div className="relative p-6 h-56 flex flex-col items-start justify-center rounded-2xl bg-[#fff8d3] flex-1 text-center text-[#555168]">
              <CurrencyDollarIcon className="h-8 w-8 text-[#b7a3ff] top-4 left-4" />
              <p className="text-[32px] font-bold">Rp920.000</p>
              <p className="font-semibold">Pembayaran Masuk</p>
            </div>

            <div className="relative p-6 h-56 flex flex-col items-start justify-center rounded-2xl bg-[#fff8d3] flex-1 text-center text-[#555168]">
              <BriefcaseIcon className="h-8 w-8 text-[#b7a3ff]  top-4 left-4" />
              <p className="text-[32px] font-bold">6</p>
              <p className="font-semibold">Admin Aktif</p>
            </div>

          </div>

        </div>

          <SessionTable data={data} />

      </div>
    </div>
  );
}
