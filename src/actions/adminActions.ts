// src\actions\adminActions.ts
"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { CreateInternData, AttendanceLogResponse } from "@/types";
import { capitalize } from "@/lib/utils";

export async function registerIntern(data: CreateInternData) {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.temporaryPassword,
        email_confirm: true,
      });

    if (authError) {
      console.error("Auth error:", authError);
      return {
        success: false,
        error: authError.message || "Failed to create user account",
      };
    }

    if (!authUser?.user) {
      return { success: false, error: "No user returned from auth" };
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from("members")
      .insert({
        user_id: authUser.user.id,
        full_name: data.fullName,
        member_type: data.type,
        department: data.department,
        role: data.role,
        total_required_hours: parseInt(data.requiredHours),
        startDate: data.startDate.toISOString().split("T")[0],
        is_active: true,
      })
      .select()
      .single();

    if (memberError) {
      console.error("Member creation error:", memberError);

      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);

      return {
        success: false,
        error: memberError.message || "Failed to create member record",
      };
    }

    revalidatePath("/admin");

    return { success: true, member, role: data.role };
  } catch (error) {
    console.error("Error creating intern:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getDashboardStats() {
  try {
    const supabaseAdmin = await createAdminClient();

    const { data: members, error: membersError } = await supabaseAdmin
      .from("members")
      .select("id, total_required_hours, is_active")
      .in("role", ["member", "admin"]);

    if (membersError) throw membersError;

    const totalInterns = members?.length || 0;
    const activeInterns = members?.filter((m) => m.is_active).length || 0;

    const memberIds = members?.map((m) => m.id) || [];

    let totalHoursRendered = 0;
    let totalRequiredHours = 0;

    if (memberIds.length > 0) {
      const { data: attendanceLogs } = await supabaseAdmin
        .from("attendance_logs")
        .select("member_id, time_in, time_out, status")
        .in("member_id", memberIds)
        .eq("status", "approved")
        .not("time_out", "is", null);

      attendanceLogs?.forEach((log) => {
        if (log.time_in && log.time_out) {
          const hours =
            (new Date(log.time_out).getTime() -
              new Date(log.time_in).getTime()) /
            (1000 * 60 * 60);
          totalHoursRendered += hours;
        }
      });

      totalRequiredHours =
        members?.reduce((sum, m) => sum + (m.total_required_hours || 0), 0) ||
        0;
    }
    const avgCompletion =
      totalRequiredHours > 0
        ? Math.round((totalHoursRendered / totalRequiredHours) * 100)
        : 0;

    return {
      success: true,
      stats: {
        totalInterns,
        activeInterns,
        avgCompletion: `${avgCompletion}%`,
        totalHours: Math.round(totalHoursRendered),
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getInterns() {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: members, error } = await supabaseAdmin
      .from("members")
      .select(
        "id, full_name, department, member_type, role, total_required_hours, is_active"
      )
      .in("role", ["member", "admin"])
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Calculate progress and hours for each member
    const internsWithProgress = await Promise.all(
      members.map(async (member) => {
        // Get hours rendered
        const { data: logs } = await supabaseAdmin
          .from("attendance_logs")
          .select("time_in, time_out")
          .eq("member_id", member.id)
          .eq("status", "approved")
          .not("time_out", "is", null);

        let hoursRendered = 0;
        logs?.forEach((log) => {
          if (log.time_in && log.time_out) {
            const hours =
              (new Date(log.time_out).getTime() -
                new Date(log.time_in).getTime()) /
              (1000 * 60 * 60);
            hoursRendered += hours;
          }
        });

        const progress =
          member.total_required_hours > 0
            ? Math.round((hoursRendered / member.total_required_hours) * 100)
            : 0;

        return {
          id: member.id,
          fullName: member.full_name,
          department: member.department,
          type: member.member_type,
          role: capitalize(member.role),
          hours: `${Math.round(hoursRendered)}/${member.total_required_hours}`,
          progress: `${progress}%`,
          isActive: member.is_active,
        };
      })
    );

    return {
      success: true,
      interns: internsWithProgress,
    };
  } catch (error) {
    console.error("Error fetching interns:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getAttendanceLogs() {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: logs, error } = await supabaseAdmin
      .from("attendance_logs")
      .select(
        `
        id,
        date,
        time_in,
        time_out,
        status,
        time_in_photo_url,
        member:members!attendance_logs_member_id_fkey(full_name, department, role)
      `
      )
      .order("date", { ascending: false })
      .order("time_in", { ascending: false })
      .limit(50)
      .overrideTypes<AttendanceLogResponse[]>();

    if (error) throw error;

    const filteredLogs = logs.filter((log) => log.member?.role !== "super");

    const formattedLogs = filteredLogs.map((log) => ({
      id: log.id,
      fullName: log.member?.full_name || "Unknown",
      department: log.member?.department || "N/A",
      type: (log.time_out ? "Time Out" : "Time In") as "Time In" | "Time Out",
      date: new Date(log.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      time: new Date(log.time_out || log.time_in).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: log.status || "pending",
      photoUrl: log.time_in_photo_url,
    }));

    return {
      success: true,
      logs: formattedLogs,
    };
  } catch (error) {
    console.error("Error fetching attendance logs:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getInternOverview() {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: members, error } = await supabaseAdmin
      .from("members")
      .select("id, full_name, member_type, total_required_hours")
      .in("role", ["member", "admin"])
      .eq("is_active", true)
      .limit(3);

    if (error) throw error;

    const overviewData = await Promise.all(
      members.map(async (member) => {
        const { data: logs } = await supabaseAdmin
          .from("attendance_logs")
          .select("time_in, time_out")
          .eq("member_id", member.id)
          .eq("status", "approved")
          .not("time_out", "is", null);

        let hoursRendered = 0;
        logs?.forEach((log) => {
          if (log.time_in && log.time_out) {
            const hours =
              (new Date(log.time_out).getTime() -
                new Date(log.time_in).getTime()) /
              (1000 * 60 * 60);
            hoursRendered += hours;
          }
        });

        const progress =
          member.total_required_hours > 0
            ? Math.round((hoursRendered / member.total_required_hours) * 100)
            : 0;

        return {
          id: member.id,
          fullName: member.full_name,
          department: member.member_type,
          progress: `${progress}%`,
          hours: `${Math.round(hoursRendered)}/${member.total_required_hours}`,
        };
      })
    );

    return {
      success: true,
      overview: overviewData,
    };
  } catch (error) {
    console.error("Error fetching intern overview:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function approveAttendance(attendanceId: string, adminId: string) {
  try {
    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin
      .from("attendance_logs")
      .update({
        status: "approved",
        approved_by: adminId,
        approved_at: new Date().toISOString(),
      })
      .eq("id", attendanceId);

    if (error) throw error;

    revalidatePath("/admin");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error approving attendance:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function rejectAttendance(attendanceId: string) {
  try {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from("attendance_logs")
      .update({
        status: "rejected",
      })
      .eq("id", attendanceId);

    if (error) throw error;

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error rejecting attendance:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
