// app/(dashboard)/layout.tsx
import { getMember } from "@/actions/authActions";
import { Navbar } from "@/components/dashboard/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getMember();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <Navbar
          fullName={member.full_name}
          memberType={member.member_type}
          department={member.department}
          role={member.role}
        />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
