// src\actions\superActions.ts
"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { CreateExecutiveData } from "@/types";
import { revalidatePath } from "next/cache";

export async function getDepartmentPerformance() {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: members } = await supabaseAdmin
      .from("members")
      .select("id, department, total_required_hours, is_active, role")
      .in("role", ["member", "admin"]);

    if (!members)
      return {
        success: false,
        error: "No data found",
      };

    const departmentMap = new Map();

    for (const member of members) {
      const dept = member.department || "Unassigned";

      if (!departmentMap.has(dept)) {
        departmentMap.set(dept, {
          department: dept,
          totalInterns: 0,
          activeInterns: 0,
          totalRequiredHours: 0,
          totalHoursRendered: 0,
        });
      }

      const deptData = departmentMap.get(dept);
      deptData.totalInterns++;
      if (member.is_active) deptData.activeInterns++;
      deptData.totalRequiredHours += member.total_required_hours || 0;

      const { data: logs } = await supabaseAdmin
        .from("attendance_logs")
        .select("time_in, time_out")
        .eq("member_id", member.id)
        .eq("status", "approved")
        .not("time_out", "is", null);

      logs?.forEach((log) => {
        if (log.time_in && log.time_out) {
          const hours =
            (new Date(log.time_out).getTime() -
              new Date(log.time_in).getTime()) /
            (1000 * 60 * 60);
          deptData.totalHoursRendered += hours;
        }
      });
    }
    const departments = Array.from(departmentMap.values()).map((dept) => ({
      ...dept,
      totalHoursRendered: Math.round(dept.totalHoursRendered),
      avgCompletion:
        dept.totalRequiredHours > 0
          ? Math.round(
              (dept.totalHoursRendered / dept.totalRequiredHours) * 100
            )
          : 0,
    }));

    return {
      success: true,
      departments,
    };
  } catch (error) {
    console.error("Error fetching department performance:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function registerExecutive(data: CreateExecutiveData) {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.temporaryPassword,
        email_confirm: true,
      });

    if (authError || !authUser?.user) {
      return { success: false, error: "Failed to create account" };
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from("members")
      .insert({
        user_id: authUser.user.id,
        full_name: data.fullName,
        member_type: data.type,
        department: "Management",
        role: "super",
        total_required_hours: 0,
        start_date: new Date().toISOString().split("T")[0],
        is_active: true,
      })
      .select()
      .single();

    if (memberError) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return { success: false, error: "Failed to create member record" };
    }

    revalidatePath("/super");
    return { success: true, member };
  } catch (error) {
    console.error("Error creating executive:", error);
    return { success: false, error: "An unexpected error occured" };
  }
}
