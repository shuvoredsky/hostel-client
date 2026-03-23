"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Moon,
  Sun,
  Bell,
  Menu,
  X,
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
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/auth.types";
import { logout } from "@/services/auth.client.services";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getDefaultDashboardRoute } from "@/lib/authUtils";

interface DashboardNavbarProps {
  user: IUser;
}

const studentLinks = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/student/my-bookings", icon: BookOpen },
  { label: "My Payments", href: "/student/my-payments", icon: CreditCard },
  { label: "Wishlist", href: "/student/wishlist", icon: Heart },
];

const ownerLinks = [
  { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { label: "My Listings", href: "/owner/my-listings", icon: Building },
  { label: "Create Listing", href: "/owner/create-listing", icon: PlusCircle },
  { label: "Booking Requests", href: "/owner/booking-requests", icon: ClipboardList },
  { label: "Payments", href: "/owner/payments", icon: CreditCard },
];

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Listings", href: "/admin/listings", icon: Building },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
];

const getPageTitle = (pathname: string): string => {
  const allLinks = [...studentLinks, ...ownerLinks, ...adminLinks];
  const match = allLinks.find((l) => pathname.startsWith(l.href));
  if (match) return match.label;
  if (pathname.includes("my-profile")) return "My Profile";
  if (pathname.includes("change-password")) return "Change Password";
  return "Dashboard";
};

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const roleLinks =
    user.role === "STUDENT"
      ? studentLinks
      : user.role === "OWNER"
      ? ownerLinks
      : adminLinks;

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
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
        {/* Left — Page Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Home Link */}
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push("/")}>
            <Home className="w-4 h-4" />
          </Button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.image} />
              <AvatarFallback className="bg-emerald-600 text-white text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">
                {user.name?.split(" ")[0]}
              </p>
              <p className="text-xs text-emerald-600 leading-none mt-0.5">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Dhaka<span className="text-emerald-600">Stay</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-emerald-600">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {roleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    pathname === link.href || pathname.startsWith(link.href)
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <Link
                  href="/my-profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link
                  href="/change-password"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4" />
                  Change Password
                </Link>
              </div>
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}