import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ActiveUsersComponent from "./ActiveUsersComponent";

export default async function ActiveUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: sessions } = await supabase
    .from("consultation_sessions")
    .select("*, profiles(anon_name)")
    .order("created_at", { ascending: false });

  const { data: users } = await supabase
    .from("profiles")
    .select("*")

  return (
    <ActiveUsersComponent
      sessionData={sessions || []}
      userData={users || []}
    />
  );
}
