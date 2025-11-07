// src/components/dashboard/super/add-executive-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerExecutive } from "@/actions/superActions";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ExecutiveSchema,
  executiveSchema,
} from "@/lib/schemas/ExecutiveSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface AddExecutiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExecutiveDialog({
  open,
  onOpenChange,
}: AddExecutiveDialogProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ExecutiveSchema>({
    resolver: zodResolver(executiveSchema),
    mode: "onTouched",
  });

  const onClick = async (data: ExecutiveSchema) => {
    console.log("Submitting register form with data:", data);

    try {
      const result = await registerExecutive(data);

      if (!result || !result.success) {
        toast.error(result?.error || "Failed to register executive");
        return;
      }

      toast.success("Successfully registered an executive");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Register error:", error);
      toast.error("An error occurred while registering");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Executive
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onClick)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Klein Borre"
                className={cn(errors.fullName && "border-destructive")}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="borre.cmro.executive@example.com"
                className={cn(errors.email && "border-destructive")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="abcd.123"
                className={cn(errors.temporaryPassword && "border-destructive")}
                {...register("temporaryPassword")}
              />
              {errors.temporaryPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.temporaryPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                placeholder="Chief Technology Officer"
                className={cn(
                  "bg-gray-50",
                  errors.type && "border-destructive"
                )}
                {...register("type")}
              />
              {errors.type && (
                <p className="text-sm text-destructive mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Adding executive...
                </>
              ) : (
                "Add Executive"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
