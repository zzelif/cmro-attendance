// src/app/(auth)/login/LoginForm.tsx
"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/schemas/LoginSchema";
import { signInUser } from "@/actions/authActions";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  async function onSubmit(data: LoginSchema) {
    console.log("Submitting login form with data:", data);

    try {
      const result = await signInUser(data);

      if (result.status === "error") {
        toast.error(result.error as string);
        return;
      }

      const redirectMap: Record<string, string> = {
        member: "/member",
        admin: "/admin",
        super: "/super",
      };

      toast.success("Logged-in successfully");
      router.push(redirectMap[result.data] || "/member");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow flex flex-col gap-4 justify-center">
        <div className="flex justify-center">
          <div className="bg-yellow-400 flex items-center justify-center w-3/12 p-2 rounded">
            <Image
              src="/cmro-icon.png"
              alt="CMRO Logo"
              width={100}
              height={100}
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center">CMR Opportunities</h1>
        <h3 className="text-center text-gray-600">
          Attendance Monitoring System
        </h3>

        {errors.root?.message && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-600">{errors.root.message}</p>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
            disabled={!isValid}
            className="w-full bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Only admins can create accounts
        </p>
      </div>
    </div>
  );
}
