"use client";

import { useAuth } from "@/providers/AuthProvider";
import { formatDate, getStatusColor } from "@/lib/utils";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  BadgeCheck,
  AlertCircle,
  Building,
  GraduationCap,
} from "lucide-react";
import ChangePasswordButton from "./ChangePasswordButton";
import { cn } from "@/lib/utils";

export default function MyProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Unable to load profile. Please log in again.</p>
      </div>
    );
  }

  const roleIcon =
    user.role === "ADMIN"
      ? ShieldCheck
      : user.role === "OWNER"
      ? Building
      : GraduationCap;

  const RoleIcon = roleIcon;

  const roleColor =
    user.role === "ADMIN"
      ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400"
      : user.role === "OWNER"
      ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
      : "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Profile
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Cover / Avatar Section */}
        <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-600" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-800 overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shadow-md">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
            </div>

            {/* Role Badge */}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium",
                roleColor
              )}
            >
              <RoleIcon className="w-4 h-4" />
              {user.role}
            </div>
          </div>

          {/* Name */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {user.email}
          </p>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
        {/* Name */}
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Full Name
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">
              {user.name}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Email Address
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user.email}
              </p>
              {user.isEmailVerified ? (
                <span className="shrink-0 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Not verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <RoleIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 dark:text-slate-500">Role</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">
              {user.role}
            </p>
          </div>
        </div>

        {/* Account Status */}
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Account Status
            </p>
            <div className="mt-0.5">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  getStatusColor(user.status)
                )}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Member Since
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ChangePasswordButton />
      </div>
    </div>
  );
}