"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentDetailView({ payment }: any) {
  if (!payment)
    return <div className="p-6 text-gray-500">Pembayaran tidak ditemukan.</div>;

  const user = payment.profiles;
  const session = payment.sessions;

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold">Detail Pembayaran #{payment.id}</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div><strong>User:</strong> {user?.anon_name || "-"}</div>
        <div><strong>Amount:</strong> Rp {Number(payment.amount).toLocaleString()}</div>
        <div><strong>Status:</strong> {payment.status}</div>
        <div><strong>Method:</strong> {payment.method || "-"}</div>
        <div>
          <strong>Dibuat:</strong>{" "}
          {new Date(payment.created_at).toLocaleString("id-ID")}
        </div>

        {payment.paid_at && (
          <div>
            <strong>Dibayar:</strong>{" "}
            {new Date(payment.paid_at).toLocaleString("id-ID")}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="font-semibold mb-3">Informasi Sesi</h2>
        {!session ? (
          <div className="text-gray-500">Belum ada sesi untuk pembayaran ini.</div>
        ) : (
          <div className="space-y-2">
            <div><strong>Session ID:</strong> {session.id}</div>
            <div><strong>Status:</strong> {session.status}</div>
            <Link href={`/active-users/${session.id}`}>
              <Button size="sm" className="mt-2">Lihat Sesi</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {payment.status === "pending" && (
          <Button variant="outline">Approve Pembayaran</Button>
        )}

        {payment.status === "paid" && (
          <Button variant="destructive">Refund</Button>
        )}
      </div>
    </div>
  );
}
