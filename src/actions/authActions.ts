"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getMember() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !member) {
    redirect("/login");
  }

  return member;
}
