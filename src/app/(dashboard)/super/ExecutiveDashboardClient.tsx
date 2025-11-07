// src\app\(dashboard)\super\ExecutiveDashboardClient.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDepartmentPerformance } from "@/actions/superActions";
import { DepartmentPerformanceTable } from "@/components/dashboard/super/department-performance-table";
import { AddExecutiveDialog } from "@/components/dashboard/super/add-executive-dialog";

export function ExecutiveDashboardClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddExecutiveDialogOpen, setIsAddExecutiveDialogOpen] =
    useState(false);

  const [departmentFilter, setDepartmentFilter] = useState("all");
  const queryClient = useQueryClient();

  // Fetch department performance
  const { data: departmentData, isLoading } = useQuery({
    queryKey: ["departmentPerformance"],
    queryFn: async () => {
      const result = await getDepartmentPerformance();
      return result.success ? result.departments : [];
    },
  });

  const handleDialogClose = async (open: boolean) => {
    setIsAddExecutiveDialogOpen(open);
    if (!open) {
      queryClient.invalidateQueries({ queryKey: ["departmentPerformance"] });
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
              placeholder="Search Departments..."
              className="pl-10 w-56"
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
        <div className="flex gap-2">
          <Button variant="default" className="bg-blue-500">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => setIsAddExecutiveDialogOpen(true)}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Add Executive
          </Button>
        </div>
      </div>

      {/* Department Performance Section */}
      <Card className="border-gray-300 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">
                Department Performance
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Completion rates by department (e.g., IT – 75%, Graphic Design –
                33%). Good for comparing departments and seeing which ones are
                ahead or behind.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DepartmentPerformanceTable
            data={departmentData || []}
            loading={isLoading}
            searchQuery={searchQuery}
            departmentFilter={departmentFilter}
          />
        </CardContent>
      </Card>

      <AddExecutiveDialog
        open={isAddExecutiveDialogOpen}
        onOpenChange={handleDialogClose}
      />
    </>
  );
}
