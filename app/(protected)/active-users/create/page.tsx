import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CreateConsultationComponent from "./CreateConsultationComponent";

export default async function CreateSessionPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: users } = await supabase
    .from("profiles")
    .select("id, anon_name")
    .order("anon_name", { ascending: true });

  return <CreateConsultationComponent users={users || []} />;
}
