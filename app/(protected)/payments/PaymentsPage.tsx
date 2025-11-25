"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentTable } from "@/components/tables/PaymentTable";

export default function PaymentsPage({
  payments,
  stats,
}: {
  payments: any[];
  stats: {
    totalTransactions: number;
    totalSuccess: number;
    totalPending: number;
    totalFailed: number;
    totalRevenue: number;
    thisMonthRevenue: number;
  };
}) {
  const [search, setSearch] = useState("");

  const filtered = payments.filter((p) =>
    p.profiles?.anon_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 w-full flex flex-col gap-8">
      <h1 className="text-xl font-bold text-gray-800">Daftar Pembayaran</h1>

      {/* ======================== */}
      {/*         STATS BOX        */}
      {/* ======================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-gray-500 text-sm">Total Transaksi</p>
          <p className="font-bold text-xl">{stats.totalTransactions}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-gray-500 text-sm">Berhasil</p>
          <p className="font-bold text-xl text-green-600">{stats.totalSuccess}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="font-bold text-xl text-yellow-600">{stats.totalPending}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-gray-500 text-sm">Gagal</p>
          <p className="font-bold text-xl text-red-600">{stats.totalFailed}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg col-span-2">
          <p className="text-gray-500 text-sm">Total Pendapatan</p>
          <p className="font-bold text-2xl">
            Rp {stats.totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg col-span-2">
          <p className="text-gray-500 text-sm">Pendapatan Bulan Ini</p>
          <p className="font-bold text-2xl">
            Rp {stats.thisMonthRevenue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <Input
          placeholder="Cari nama pengguna..."
          className="w-[250px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <PaymentTable data={filtered} />
    </div>
  );
}
