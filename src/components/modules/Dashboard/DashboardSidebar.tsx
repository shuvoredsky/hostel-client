"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Heart,
  Building,
  PlusCircle,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";
import { IUser } from "@/types/auth.types";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth.client.services";
import { toast } from "sonner";
import Image from "next/image";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

const studentLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/student/my-bookings", icon: BookOpen },
  { label: "My Payments", href: "/student/my-payments", icon: CreditCard },
  { label: "Wishlist", href: "/student/wishlist", icon: Heart },
];

const ownerLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { label: "My Listings", href: "/owner/my-listings", icon: Building },
  { label: "Create Listing", href: "/owner/create-listing", icon: PlusCircle },
  { label: "Booking Requests", href: "/owner/booking-requests", icon: ClipboardList },
  { label: "Payments", href: "/owner/payments", icon: CreditCard },
];

const adminLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Listings", href: "/admin/listings", icon: Building },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const commonLinks: SidebarLink[] = [
  { label: "My Profile", href: "/my-profile", icon: User },
  { label: "Change Password", href: "/change-password", icon: Settings },
];

interface DashboardSidebarProps {
  user: IUser;
  logo?: string | null;
}

export default function DashboardSidebar({ user, logo }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const roleLinks =
    user.role === "STUDENT"
      ? studentLinks
      : user.role === "OWNER"
        ? ownerLinks
        : adminLinks;

  const roleIcon =
    user.role === "STUDENT"
      ? User
      : user.role === "OWNER"
        ? Building
        : ShieldCheck;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3 }}
      className="hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="Logo" className="h-7 w-auto object-contain" />
            ) : (
              <>
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Dhaka<span className="text-emerald-600">Stay</span>
                </span>
              </>
            )}
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <span className="text-emerald-600 font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-emerald-600 font-medium">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Role Links */}
        {!collapsed && (
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 mb-2">
            {user.role === "ADMIN" ? "Admin" : user.role === "OWNER" ? "Owner" : "Student"}
          </p>
        )}
        {roleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              pathname === link.href || pathname.startsWith(link.href)
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}

        {/* Common Links */}
        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 mb-2">
              Account
            </p>
          )}
          {commonLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}