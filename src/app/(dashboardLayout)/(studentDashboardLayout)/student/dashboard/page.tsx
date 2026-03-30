"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { BookOpen, CreditCard, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DashboardData {
  overview: any;
  activeBookings: any;
  bookingHistory: any;
  payments: any;
}

export default function StudentDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await browserClient.get("/dashboard/student?range=all");
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

  const { overview, activeBookings, bookingHistory, payments } = dashboard;

  const statsCards = [
    {
      label: "Total Bookings",
      value: overview.totalBookings,
      icon: BookOpen,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    },
    {
      label: "Active Bookings",
      value: overview.confirmedBookings,
      icon: CheckCircle,
      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
    },
    {
      label: "Pending Bookings",
      value: overview.pendingBookings,
      icon: Clock,
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
    },
    {
      label: "Total Paid",
      value: formatPrice(overview.totalPaid),
      icon: CreditCard,
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here is your housing summary
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
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Bookings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Active Bookings
            </h3>
            <Link
              href="/student/my-bookings"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          {activeBookings?.length > 0 ? (
            <div className="space-y-3">
              {activeBookings.slice(0, 3).map((booking: any) => (
                <div
                  key={booking.bookingId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    {booking.image ? (
                      <Image
                        src={booking.image}
                        alt={booking.listingTitle}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {booking.listingTitle}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {booking.area}, {booking.city}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-emerald-600">
                      {formatPrice(booking.monthlyRent)}
                    </p>
                    <p className="text-xs text-slate-400">/month</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No active bookings</p>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Payment Summary
            </h3>
            <Link
              href="/student/my-payments"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Total Paid
                </span>
              </div>
              <span className="font-semibold text-emerald-600">
                {formatPrice(payments?.totalPaid || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Total Due
                </span>
              </div>
              <span className="font-semibold text-amber-600">
                {formatPrice(payments?.totalUnpaid || 0)}
              </span>
            </div>
          </div>

          {/* Unpaid Payments */}
          {payments?.unpaidDetails?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Pending Payments
              </p>
              {payments.unpaidDetails.slice(0, 2).map((payment: any) => (
                <div
                  key={payment.paymentId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 mb-2"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                      {payment.listingTitle}
                    </p>
                    <p className="text-xs text-slate-400">
                      {payment.daysWaiting} days waiting
                    </p>
                  </div>
                  <Link
                    href="/student/my-payments"
                    className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Pay Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Booking History */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Recent Booking History
          </h3>
          <Link
            href="/student/my-bookings"
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            View all
          </Link>
        </div>

        {bookingHistory?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Listing
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Area
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
                {bookingHistory.slice(0, 5).map((booking: any) => (
                  <tr
                    key={booking.bookingId}
                    className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <td className="py-3">
                      <p className="font-medium text-slate-900 dark:text-white truncate max-w-[150px]">
                        {booking.listingTitle}
                      </p>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {booking.area}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-xs">
                      {formatDate(booking.bookedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No booking history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}