// app/payments/page.tsx
import { createClient } from "@/lib/supabase/server";
import PaymentsPage from "./PaymentsPage";

export default async function Payments() {
  const supabase = await createClient();

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*, sessions(*), profiles(*)")
    .order("created_at", { ascending: false });

  const list = payments || [];

  // ===============================
  // HITUNG STATS DI SINI
  // ===============================
  const totalTransactions = list.length;

  const totalSuccess = list.filter((p) => p.status === "paid").length;
  const totalPending = list.filter((p) => p.status === "pending").length;
  const totalFailed = list.filter((p) => p.status === "failed").length;

  const totalRevenue = list
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const now = new Date();
  const thisMonthRevenue = list
    .filter((p) => {
      if (p.status !== "paid") return false;
      const d = new Date(p.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const stats = {
    totalTransactions,
    totalSuccess,
    totalPending,
    totalFailed,
    totalRevenue,
    thisMonthRevenue,
  };

  return <PaymentsPage payments={list} stats={stats} />;
}
