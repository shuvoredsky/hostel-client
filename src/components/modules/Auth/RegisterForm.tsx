"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Home, Building } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, RegisterInput } from "@/zod/auth.validation";
import { registerStudent, registerOwner } from "@/services/auth.client.services";
import { useAuth } from "@/providers/AuthProvider";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { cn } from "@/lib/utils";

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

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response =
        data.role === "STUDENT"
          ? await registerStudent(payload)
          : await registerOwner(payload);

      if (response?.data) {
        await refetchUser();
        toast.success("Account created successfully!");
        const user = response.data;
        router.push(getDefaultDashboardRoute(user.role));
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Registration failed. Try again.";
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
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setValue("role", "STUDENT")}
          className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium",
            selectedRole === "STUDENT"
              ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
          )}
        >
          <User className="w-4 h-4" />
          I'm a Student
        </button>
        <button
          type="button"
          onClick={() => setValue("role", "OWNER")}
          className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium",
            selectedRole === "OWNER"
              ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
          )}
        >
          <Building className="w-4 h-4" />
          I'm an Owner
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