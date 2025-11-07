// src/components/dashboard/admin/attendance-management.tsx
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AttendanceLog } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { approveAttendance, rejectAttendance } from "@/actions/adminActions";
import { toast } from "react-toastify";

interface AttendanceManagementProps {
  data: AttendanceLog[];
  loading: boolean;
  searchQuery: string;
  departmentFilter: string;
}

export function AttendanceManagement({
  data,
  loading,
  searchQuery,
  departmentFilter,
}: AttendanceManagementProps) {
  const queryClient = useQueryClient();
  const [selectedRecord, setSelectedRecord] = useState<AttendanceLog | null>(
    null
  );
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      const matchesSearch = record.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || record.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [data, searchQuery, departmentFilter]);

  const handleViewDetails = (record: AttendanceLog) => {
    setSelectedRecord(record);
    setIsViewDetailsOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Full Name</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Time</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.fullName}
                  </TableCell>
                  <TableCell>{record.department} Intern</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "approved" ? "default" : "secondary"
                      }
                      className={
                        record.status === "approved"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-400 hover:bg-red-500"
                      }
                    >
                      {record.status === "approved"
                        ? "Approved"
                        : record.status === "rejected"
                        ? "Rejected"
                        : "Pending"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {record.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              // onClick={() => handleApprove(record.id)}
                              disabled={actionLoading === record.id}
                            >
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              // onClick={() => handleReject(record.id)}
                              disabled={actionLoading === record.id}
                              className="text-red-600"
                            >
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(record)}
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Attendance Details</DialogTitle>
            <DialogDescription>
              View detailed information about this attendance record
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4 mt-4">
              {/* Intern Info */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gray-300 text-white">
                    {selectedRecord.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedRecord.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedRecord.department} Intern
                  </p>
                </div>
              </div>

              {/* Attendance Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{selectedRecord.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge
                    variant={
                      selectedRecord.status === "approved"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      selectedRecord.status === "approved"
                        ? "bg-green-500"
                        : selectedRecord.status === "rejected"
                        ? "bg-gray-500"
                        : "bg-red-400"
                    }
                  >
                    {selectedRecord.status === "approved"
                      ? "Approved"
                      : selectedRecord.status === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{selectedRecord.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{selectedRecord.time}</p>
                </div>
              </div>

              {/* Photo */}
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedRecord.type}
                </p>
                {selectedRecord.photoUrl ? (
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={selectedRecord.photoUrl}
                      alt={selectedRecord.type}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No photo available</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedRecord.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      // handleApprove(selectedRecord.id);
                      setIsViewDetailsOpen(false);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    disabled={actionLoading === selectedRecord.id}
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      // handleReject(selectedRecord.id);
                      setIsViewDetailsOpen(false);
                    }}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                    disabled={actionLoading === selectedRecord.id}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
