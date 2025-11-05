// app/(dashboard)/_components/navbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavbarProps {
  fullName: string;
  memberType?: string;
  department?: string;
  role: string;
}

export function Navbar({
  fullName,
  memberType,
  department,
  role,
}: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }

  // Role-based header content
  const headerContent = {
    member: {
      title: `Welcome ${fullName}`,
      subtitle:
        memberType && department ? `${memberType} • ${department}` : "Member",
    },
    admin: {
      title: "Admin Dashboard",
      subtitle: "Manage intern attendance and progress",
    },
    super: {
      title: "Executive Dashboard",
      subtitle: "High-level analytics and oversight",
    },
  };

  const { title, subtitle } =
    headerContent[role as keyof typeof headerContent] || headerContent.member;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side - Role-based header */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
        </div>

        {/* Right side - Logout button */}
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </nav>
  );
}
