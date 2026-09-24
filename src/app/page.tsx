import { redirect } from "next/navigation";

import { createClient } from "@/features/model/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  redirect(data.user ? "/dashboard" : "/login");
}