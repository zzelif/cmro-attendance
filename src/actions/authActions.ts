// src/actions/authActions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ActionResult } from "@/types";
import { LoginSchema } from "@/lib/schemas/LoginSchema";

export async function signInUser(
  credentials: LoginSchema
): Promise<ActionResult<string>> {
  const supabase = await createClient();

  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { status: "error", error: "Invalid credentials" };
    }

    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("role, is_active")
      .eq("user_id", data.user.id)
      .single();

    if (memberError || !member) {
      return { status: "error", error: "User profile not found" };
    }

    if (!member.is_active) {
      await supabase.auth.signOut();
      return { status: "error", error: "Your account is inactive" };
    }

    return { status: "success", data: member.role };
  } catch (error) {
    console.error("Login error:", error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function signOutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

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
