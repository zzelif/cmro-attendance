// src\types\index.d.ts

import { z } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | z.core.$ZodIssue[] };

type AttendanceLog = {
  id: string;
  date: string;
  time_in: string;
  time_out: string | null;
  status: string;
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
