"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import {
  Users,
  Building,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  overview: any;
  listings: any;
  bookings: any;
  payments: any;
  recentBookings: any;
  topOwners: any;
}

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await browserClient.get("/dashboard/admin?range=all");
        setDashboard(res.data?.data || null);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load dashboard");
        setDashboard(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">{error || "Failed to load dashboard"}</p>
      </div>
    );
  }

  const { overview, listings, bookings, payments, recentBookings, topOwners } =
    dashboard;

  const statsCards = [
    {
      label: "Total Users",
      value: overview.totalUsers,
      sub: `${overview.totalStudents} students · ${overview.totalOwners} owners`,
      icon: Users,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    },
    {
      label: "Total Listings",
      value: overview.totalListings,
      sub: `${listings.pending} pending approval`,
      icon: Building,
      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
    },
    {
      label: "Total Bookings",
      value: overview.totalBookings,
      sub: `${bookings.confirmed} confirmed`,
      icon: BookOpen,
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
    },
    {
      label: "Total Revenue",
      value: formatPrice(payments.totalRevenue || 0),
      sub: `Commission: ${formatPrice(payments.totalCommission || 0)}`,
      icon: TrendingUp,
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, {user?.name?.split(" ")[0]}! Here is the platform
          overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {stat.label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listing Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Listings
            </h3>
            <Link
              href="/admin/listings"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Pending",
                value: listings.pending,
                color: "bg-amber-500",
              },
              {
                label: "Approved",
                value: listings.approved,
                color: "bg-emerald-500",
              },
              {
                label: "Rejected",
                value: listings.rejected,
                color: "bg-red-500",
              },
            ].map((item) => {
              const total = overview.totalListings || 1;
              const pct = Math.round((item.value / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.label}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {listings.byType?.room || 0}
                </p>
                <p className="text-slate-400">Room</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {listings.byType?.seat || 0}
                </p>
                <p className="text-slate-400">Seat</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {listings.byType?.basha || 0}
                </p>
                <p className="text-slate-400">Basha</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Bookings
            </h3>
            <Link
              href="/admin/bookings"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Pending",
                value: bookings.pending,
                color: "bg-amber-500",
              },
              {
                label: "Accepted",
                value: bookings.accepted,
                color: "bg-blue-500",
              },
              {
                label: "Confirmed",
                value: bookings.confirmed,
                color: "bg-emerald-500",
              },
              {
                label: "Rejected",
                value: bookings.rejected,
                color: "bg-red-500",
              },
              {
                label: "Cancelled",
                value: bookings.cancelled,
                color: "bg-slate-400",
              },
            ].map((item) => {
              const total = overview.totalBookings || 1;
              const pct = Math.round((item.value / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.label}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commission Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Revenue & Commission
            </h3>
            <Link
              href="/admin/payments"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Revenue
              </p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">
                {formatPrice(payments.totalRevenue || 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Commission
              </p>
              <p className="text-xl font-bold text-purple-600 mt-0.5">
                {formatPrice(payments.totalCommission || 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paid Transactions
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {payments.totalPaidCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Owners */}
      {topOwners?.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Top Owners
            </h3>
            <Link
              href="/admin/users"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all users
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Owner
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Listings
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Bookings
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Confirmed
                  </th>
                </tr>
              </thead>
              <tbody>
                {topOwners.slice(0, 5).map((owner: any) => (
                  <tr
                    key={owner.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-emerald-600">
                            {owner.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {owner.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {owner.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {owner.totalListings}{" "}
                      <span className="text-xs text-slate-400">
                        ({owner.approvedListings} approved)
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {owner.totalBookings}
                    </td>
                    <td className="py-3">
                      <span className="text-emerald-600 font-medium">
                        {owner.confirmedBookings}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      {recentBookings?.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Recent Bookings
            </h3>
            <Link
              href="/admin/bookings"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Student
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Listing
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Payment
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.slice(0, 5).map((b: any) => (
                  <tr
                    key={b.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <td className="py-3">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {b.student?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {b.student?.email}
                      </p>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                      {b.listing?.title}
                      <p className="text-xs">{b.listing?.area}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {b.payment && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(b.payment.status)}`}
                        >
                          {b.payment.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-xs">
                      {formatDate(b.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}