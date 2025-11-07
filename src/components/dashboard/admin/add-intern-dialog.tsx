// src/components/dashboard/admin/add-intern-dialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { registerIntern } from "@/actions/adminActions";
import { useForm, Controller } from "react-hook-form";
import { registerSchema, RegisterSchema } from "@/lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { DEPARTMENT_CONFIG } from "@/lib/mappings";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

interface AddInternDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddInternDialog({ open, onOpenChange }: AddInternDialogProps) {
  const {
    register,
    reset,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      role: "member",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedDepartment = watch("department");

  useEffect(() => {
    if (selectedDepartment && selectedDepartment in DEPARTMENT_CONFIG) {
      const config =
        DEPARTMENT_CONFIG[selectedDepartment as keyof typeof DEPARTMENT_CONFIG];
      setValue("type", config.type, { shouldValidate: true });
      setValue("role", config.role, { shouldValidate: true });
    }
  }, [selectedDepartment, setValue]);

  const onClick = async (data: RegisterSchema) => {
    console.log("Submitting register form with data:", data);

    try {
      const result = await registerIntern(data);

      if (!result || !result.success) {
        toast.error(result?.error || "Failed to register intern");
        return;
      }

      toast.success("Successfully registered an intern");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Register error:", error);
      toast.error("An error occurred while registering");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Intern
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onClick)} className="space-y-6 mt-4">
          {/* Row 1: Full Name & Email */}
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
                placeholder="borre.cmro.intern@example.com"
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

          {/* Row 2: Temporary Password & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                type="text"
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
              <Label htmlFor="department">Department</Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        errors.department && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Design">Graphic Design</SelectItem>
                      <SelectItem value="Content">Content Creation</SelectItem>
                      <SelectItem value="Video">Video Editor</SelectItem>
                      <SelectItem value="Esports">E-Sports</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.department && (
                <p className="text-sm text-destructive mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
          </div>

          {/* HR Admin Warning */}
          {selectedDepartment === "HR" && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
              <p className="text-xs text-purple-700 font-medium">
                HR department members are automatically assigned{" "}
                <span className="font-bold">Admin</span> role and can manage HR
                and interns.
              </p>
            </div>
          )}

          {/* Row 3: Type & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type (Auto-filled)</Label>
              <Input
                id="type"
                placeholder="Department Intern"
                className={cn(
                  "bg-gray-50",
                  errors.type && "border-destructive"
                )}
                {...register("type")}
                readOnly
              />
              {errors.type && (
                <p className="text-sm text-destructive mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role (Auto-assigned)</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ""} disabled>
                    <SelectTrigger
                      className={cn(
                        "w-full bg-gray-50",
                        errors.role && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder="Auto-assigned based on department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-sm text-destructive mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Start Date & Required Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Required Hours</Label>
              <Input
                id="hours"
                type="number"
                placeholder="120"
                className={cn(errors.requiredHours && "border-destructive")}
                {...register("requiredHours")}
              />
              {errors.requiredHours && (
                <p className="text-sm text-destructive mt-1">
                  {errors.requiredHours.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.startDate && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive mt-1">
                  {errors.startDate.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
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
                  Adding intern...
                </>
              ) : (
                "Add Intern"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
