// src/components/dashboard/admin/manage-interns.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMemo } from "react";
import { Intern } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ManageInternsProps {
  data: Intern[];
  loading: boolean;
  searchQuery: string;
  departmentFilter: string;
}

export function ManageInterns({
  data,
  loading,
  searchQuery,
  departmentFilter,
}: ManageInternsProps) {
  const filteredData = useMemo(() => {
    return data.filter((intern) => {
      const matchesSearch = intern.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || intern.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [data, searchQuery, departmentFilter]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Full Name</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Hours</TableHead>
              <TableHead className="font-semibold">Progress</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No interns found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((intern) => (
                <TableRow key={intern.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-300 text-white text-xs">
                        {intern.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{intern.fullName}</span>
                  </TableCell>
                  <TableCell>{intern.department}</TableCell>
                  <TableCell>{intern.type}</TableCell>
                  <TableCell>{intern.role}</TableCell>
                  <TableCell>{intern.hours}</TableCell>
                  <TableCell>{intern.progress}</TableCell>
                  <TableCell>
                    <Badge className="bg-brand-green text-white">
                      {intern.progress ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
