import { createClient } from "@/lib/supabase/server";
import PaymentDetailView from "./PaymentDetailView";

export default async function PaymentDetailPage({ params }: any) {
  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("payments")
    .select(`
      *,
      profiles ( id, anon_name, avatar, bio ),
      sessions ( id, status, started_at, ended_at )
    `)
    .eq("id", params.id)
    .single();

  return <PaymentDetailView payment={payment} />;
}
