// src/components/dashboard/super/department-performance-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { useMemo } from "react";

interface DepartmentPerformance {
  department: string;
  totalInterns: number;
  activeInterns: number;
  avgCompletion: number;
  totalHoursRendered: number;
  totalRequiredHours: number;
}

interface DepartmentPerformanceTableProps {
  data: DepartmentPerformance[];
  loading: boolean;
  searchQuery: string;
  departmentFilter: string;
}

export function DepartmentPerformanceTable({
  data,
  loading,
  searchQuery,
  departmentFilter,
}: DepartmentPerformanceTableProps) {
  const filteredData = useMemo(() => {
    return data.filter((dept) => {
      const matchesSearch = dept.department
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || dept.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [data, searchQuery, departmentFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {searchQuery || departmentFilter !== "all"
          ? "No departments found"
          : "No data available"}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Total Interns</TableHead>
            <TableHead className="font-semibold">Active</TableHead>
            <TableHead className="font-semibold">Hours</TableHead>
            <TableHead className="font-semibold">Completion</TableHead>
            <TableHead className="font-semibold">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((dept) => (
            <TableRow key={dept.department} className="hover:bg-gray-50">
              <TableCell className="font-medium">{dept.department}</TableCell>
              <TableCell>{dept.totalInterns}</TableCell>
              <TableCell className="text-green-600">
                {dept.activeInterns}
              </TableCell>
              <TableCell>
                {dept.totalHoursRendered}/{dept.totalRequiredHours}
              </TableCell>
              <TableCell>
                <span className="font-semibold">{dept.avgCompletion}%</span>
              </TableCell>
              <TableCell>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#FFC107] h-2.5 rounded-full transition-all"
                    style={{ width: `${dept.avgCompletion}%` }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
