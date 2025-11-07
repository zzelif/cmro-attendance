// src/app/(dashboard)/admin/AdminDashboardClient.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttendanceManagement } from "@/components/dashboard/admin/attendance-management";
import { ManageInterns } from "@/components/dashboard/admin/manage-interns";
import { RecentActivity } from "@/components/dashboard/admin/recent-activity";
import { InternOverview } from "@/components/dashboard/admin/intern-overview";
import { AddInternDialog } from "@/components/dashboard/admin/add-intern-dialog";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAttendanceLogs,
  getInterns,
  getInternOverview,
} from "@/actions/adminActions";
import { AttendanceLog, Intern, InternOverviewItem } from "@/types";

export function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [isAddInternDialogOpen, setIsAddInternDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const queryClient = useQueryClient();

  // Fetch attendance logs
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendanceLogs"],
    queryFn: async () => {
      const result = await getAttendanceLogs();
      return result.success ? (result.logs as AttendanceLog[]) : [];
    },
  });

  // Fetch interns
  const { data: internsData, isLoading: internsLoading } = useQuery({
    queryKey: ["interns"],
    queryFn: async () => {
      const result = await getInterns();
      return result.success ? (result.interns as Intern[]) : [];
    },
  });

  // Fetch intern overview
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ["internOverview"],
    queryFn: async () => {
      const result = await getInternOverview();
      return result.success ? (result.overview as InternOverviewItem[]) : [];
    },
  });

  // Handle dialog close and invalidate queries
  const handleDialogClose = async (open: boolean) => {
    setIsAddInternDialogOpen(open);

    if (!open) {
      // Invalidate and refetch queries after adding intern
      queryClient.invalidateQueries({ queryKey: ["interns"] });
      queryClient.invalidateQueries({ queryKey: ["internOverview"] });
    }
  };

  return (
    <>
      {/* Search, Filter, Export */}
      <div className="flex items-center gap-2 w-full bg-white p-4 rounded-lg justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search Interns..."
              className="pl-10 w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Design">Graphic Design</SelectItem>
              <SelectItem value="Content">Content Creation</SelectItem>
              <SelectItem value="Video">Video Editor</SelectItem>
              <SelectItem value="Esports">E-Sports</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="default" size="sm" className="bg-blue-500">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Management Section with Tabs */}
      <Card className="border-gray-300 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">
                Attendance Management
              </CardTitle>
              {activeTab === "manage-interns" && (
                <CardDescription>
                  Manage intern attendance and progress
                </CardDescription>
              )}
            </div>

            {activeTab === "manage-interns" && (
              <Button
                onClick={() => setIsAddInternDialogOpen(true)}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Add Intern
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="attendance"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="manage-interns">Manage Interns</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="attendance" className="space-y-4">
              <AttendanceManagement
                data={attendanceData || []}
                loading={attendanceLoading}
                searchQuery={searchQuery}
                departmentFilter={departmentFilter}
              />
              <RecentActivity />
            </TabsContent>

            <TabsContent value="manage-interns" className="space-y-4">
              <ManageInterns
                data={internsData || []}
                loading={internsLoading}
                searchQuery={searchQuery}
                departmentFilter={departmentFilter}
              />
              <InternOverview
                data={overviewData || []}
                loading={overviewLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddInternDialog
        open={isAddInternDialogOpen}
        onOpenChange={handleDialogClose}
      />
    </>
  );
}
