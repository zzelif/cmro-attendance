// app/page.tsx
import { redirect } from "next/navigation";
import { getMember } from "@/actions/authActions";

export default async function Home() {
  const member = await getMember();

  // If user is authenticated, redirect to their dashboard based on role
  if (member) {
    const redirectMap: Record<string, string> = {
      member: "/member",
      admin: "/admin",
      super: "/super",
    };

    redirect(redirectMap[member?.role as string] || "/member");
  }

  // If not authenticated, redirect to login
  redirect("/login");
}
