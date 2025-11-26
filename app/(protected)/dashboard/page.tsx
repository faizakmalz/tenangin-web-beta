import { createClient } from "@/lib/supabase/server"; // ✅ Server client
import { redirect } from "next/navigation";
import DashboardComponent from "./DashboardComponent";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data, error } = await supabase
  .from("consultation_sessions")
  .select("*, profiles(anon_name)")
  .order("created_at", { ascending: false });

  if (data) {
    console.log(data, 'asdhasohdaoihdaois')
  }

  if (error) {
    console.error('Error fetching anggota:', error);
  }

  return <DashboardComponent initialData={data || []} />;
}