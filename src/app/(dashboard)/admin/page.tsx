// src/app/(dashboard)/admin/page.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Clock } from "lucide-react";
import { getDashboardStats } from "@/actions/adminActions";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminPage() {
  const statsResult = await getDashboardStats();
  const stats = statsResult.success
    ? statsResult.stats
    : {
        totalInterns: 0,
        activeInterns: 0,
        avgCompletion: "0%",
        totalHours: 0,
      };

  return (
    <div className="flex gap-5 sm:gap-6 flex-col p-2 sm:p-4 mx-auto">
      {/* Welcome Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage intern attendance and progress
        </p>
      </div>

      {/* Intern Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-300 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Total Interns
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 flex items-center gap-4">
              <Users className="w-8 h-8" />
              <span>{stats?.totalInterns}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Active Interns
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 flex items-center gap-4">
              <TrendingUp className="w-8 h-8" />
              <span>{stats?.activeInterns}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Avg. Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-black">
              {stats?.avgCompletion}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-[#FFC107] flex items-center gap-4">
              <Clock className="w-8 h-8" />
              <span>{stats?.totalHours}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client-side component for interactive features */}
      <AdminDashboardClient />
    </div>
  );
}
