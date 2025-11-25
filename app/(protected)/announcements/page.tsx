import { createClient } from "@/lib/supabase/server";
import AnnouncementsComponent from "./AnnouncementComponent";

export default async function AnnouncementPage() {
  const supabase = await createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

    console.log(announcements)

  return <AnnouncementsComponent announcements={announcements || []} />;
}
