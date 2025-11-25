// app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";


export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <main className="min-h-screen flex w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 pl-64 overflow-x-hidden bg-gray-50">{children}</div>
    </main>
  );
}
