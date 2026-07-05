"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  Building,
  Briefcase,
  Users,
  Mars,
  Venus,
  Circle,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, RegisterInput } from "@/zod/auth.validation";
import {
  registerStudent,
  registerOwner,
  registerTenant,
} from "@/services/auth.client.services";
import { useAuth } from "@/providers/AuthProvider";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { cn } from "@/lib/utils";

const tenantTypeOptions = [
  { value: "JOB_HOLDER", label: "Job Holder" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "INTERN", label: "Intern" },
  { value: "BUSINESS_PERSON", label: "Business Person" },
  { value: "FAMILY", label: "Family" },
  { value: "OTHERS", label: "Others" },
] as const;

const professionOptions = [
  { value: "SOFTWARE_ENGINEER", label: "Software Engineer" },
  { value: "DOCTOR", label: "Doctor" },
  { value: "TEACHER", label: "Teacher" },
  { value: "BANKER", label: "Banker" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "BUSINESS", label: "Business" },
  { value: "OTHERS", label: "Others" },
] as const;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { refetchUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STUDENT" },
  });

  const selectedRole = watch("role");
  const selectedGender = watch("gender");
  const selectedTenantType = watch("tenantType");

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true);

      let response;

      if (data.role === "STUDENT") {
        response = await registerStudent({
          name: data.name,
          email: data.email,
          password: data.password,
          gender: data.gender!,
        });
      } else if (data.role === "TENANT") {
        response = await registerTenant({
          name: data.name,
          email: data.email,
          password: data.password,
          gender: data.gender!,
          tenantType: data.tenantType!,
          profession: data.profession,
        });
      } else {
        response = await registerOwner({
          name: data.name,
          email: data.email,
          password: data.password,
          whatsappNumber: data.whatsappNumber!,
        });
      }

      if (response?.data) {
        await refetchUser();
        toast.success("Account created successfully!");
        const user = response.data;
        router.push(getDefaultDashboardRoute(user.role));
      }
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Create Account
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Join DhakaStay and find your perfect home
        </p>
      </div>

      {/* Role Selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          type="button"
          onClick={() => setValue("role", "STUDENT")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-medium",
            selectedRole === "STUDENT"
              ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
          )}
        >
          <User className="w-4 h-4" />
          Student
        </button>
        <button
          type="button"
          onClick={() => setValue("role", "TENANT")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-medium",
            selectedRole === "TENANT"
              ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
          )}
        >
          <Users className="w-4 h-4" />
          Tenant
        </button>
        <button
          type="button"
          onClick={() => setValue("role", "OWNER")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-medium",
            selectedRole === "OWNER"
              ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
          )}
        >
          <Building className="w-4 h-4" />
          Owner
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-slate-700 dark:text-slate-300">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="John Doe"
              className="pl-10"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-slate-700 dark:text-slate-300">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {selectedRole === "OWNER" && (
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300">
              Contact Number (WhatsApp)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="tel"
                placeholder="01XXXXXXXXX"
                className="pl-10"
                {...register("whatsappNumber")}
              />
            </div>
            {errors.whatsappNumber && (
              <p className="text-red-500 text-xs">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>
        )}

        {/* Gender — Student & Tenant only */}
        {(selectedRole === "STUDENT" || selectedRole === "TENANT") && (
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300">
              Gender
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { value: "MALE", label: "Male", icon: Mars },
                  { value: "FEMALE", label: "Female", icon: Venus },
                  { value: "OTHER", label: "Other", icon: Circle },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("gender", option.value)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 p-2.5 rounded-lg border-2 transition-all text-xs font-medium",
                    selectedGender === option.value
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  )}
                >
                  <option.icon className="w-3.5 h-3.5" />
                  {option.label}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender.message}</p>
            )}
          </div>
        )}

        {/* Tenant Type — Tenant only */}
        {selectedRole === "TENANT" && (
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300">
              Which best describes you?
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {tenantTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("tenantType", option.value)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 p-2.5 rounded-lg border-2 transition-all text-xs font-medium",
                    selectedTenantType === option.value
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.tenantType && (
              <p className="text-red-500 text-xs">
                {errors.tenantType.message}
              </p>
            )}
          </div>
        )}

        {/* Profession — Tenant only, optional */}
        {selectedRole === "TENANT" && (
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300">
              Profession{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                {...register("profession")}
                defaultValue=""
                className="w-full h-10 pl-10 pr-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="" disabled>
                  Select profession
                </option>
                {professionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Password */}
        <div className="space-y-1.5">
          <Label className="text-slate-700 dark:text-slate-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label className="text-slate-700 dark:text-slate-300">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 mt-2 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Create Account
            </div>
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
