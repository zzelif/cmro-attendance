// src\app\(auth)\login\LoginForm.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/lib/schemas/LoginSchema";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [globalError, setGlobalError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setGlobalError("");

    try {
      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setGlobalError(error.message);
        return;
      }

      const { data: member } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      if (!member?.is_active) {
        await supabase.auth.signOut();
        setGlobalError("Your account is inactive");
        return;
      }

      const redirectMap: Record<string, string> = {
        member: "/dashboard/member",
        admin: "/dashboard/admin",
        super: "/dashboard/super",
      };

      router.push(redirectMap[member.role] || "/dashboard/member");
    } catch (err) {
      setGlobalError("An unexpected error occurred");
      console.error("err", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow flex flex-col gap-4 justify-center">
        <div className="flex justify-center">
          <div className="bg-yellow-400 flex items-center justify-center w-3/12 p-2">
            <Image
              src="/cmro-icon.png"
              alt="CMRO Logo"
              width={100}
              height={100}
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center">CMR Opportunities</h1>
        <h3 className="text-center">Attendance Monitoring System</h3>

        {globalError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-600">{globalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            variant="default"
            className="w-full bg-black text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? (
              <>
                <Spinner /> Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Only admins can create accounts
        </p>
      </div>
    </div>
  );
}
