// src\types\index.d.ts

import { z } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | z.core.$ZodIssue[] };

type AttendanceLog = {
  id: string;
  fullName: string;
  department: string;
  type: "Time In" | "Time Out";
  date: string;
  time: string;
  status: "pending" | "approved" | "rejected";
  photoUrl: string | null;
};

type MemberStats = {
  totalRequired: number;
  hoursRendered: number;
  hoursRemaining: number;
  completionPercentage: number;
  todayHours: number;
  isClockedIn: boolean;
  currentAttendanceId: string | null;
};

interface Intern {
  id: string;
  fullName: string;
  department: string;
  role: string;
  hours: string;
  progress: string;
  isActive: boolean;
}

interface InternOverviewItem {
  id: string;
  fullName: string;
  department: string;
  progress: string;
  hours: string;
}
interface DashboardStats {
  totalInterns: number;
  activeInterns: number;
  avgCompletion: string;
  totalHours: number;
}

interface AttendanceLogResponse {
  id: string;
  date: string;
  time_in: string;
  time_out: string | null;
  status: string | null;
  time_in_photo_url: string | null;
  member: {
    full_name: string;
    department: string;
  } | null;
}

interface CreateInternData {
  fullName: string;
  email: string;
  temporaryPassword: string;
  department: string;
  role: string;
  type: string;
  requiredHours: string;
  startDate: Date;
}
