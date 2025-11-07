// app/(dashboard)/_components/navbar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/actions/authActions";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface NavbarProps {
  role: string;
}

export function Navbar({ role }: NavbarProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      signOutUser();
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }

  // Role-based header content
  const headerContent = {
    member: {
      title: "Attendance Management - Intern",
    },
    admin: {
      title: "Admin Dashboard",
    },
    super: {
      title: "Executive Dashboard",
    },
  };

  const { title } =
    headerContent[role as keyof typeof headerContent] || headerContent.member;

  return (
    <nav className="bg-brand-header shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side - Role-based header */}
        <div className="flex-1 flex-row flex gap-8">
          <Image src="/cmro-icon.png" alt="CMRO Logo" width={50} height={50} />
          <div>
            <h1 className="text-xl font-bold text-brand-yellow">
              CMR Opportunities
            </h1>
            <p className="text-sm text-muted mt-0.5">{title}</p>
          </div>
        </div>

        {/* Right side - Logout button */}
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className="text-white font-bold text-lg hover:bg-transparent hover:text-brand-yellow"
        >
          <LogOut className="mr-2" />
          {isLoading ? "Logging out..." : "Log Out"}
        </Button>
      </div>
    </nav>
  );
}
