import { getOwnerDashboard } from "@/services/dashboard.services";
import { getMe } from "@/services/auth.services";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import {
  Building,
  CreditCard,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function OwnerDashboardPage() {
  let dashboard: any = null;
  let user: any = null;

  try {
    const [dashboardRes, userRes] = await Promise.all([
      getOwnerDashboard(),
      getMe(),
    ]);
    dashboard = dashboardRes?.data || null;
    user = userRes?.data || null;
  } catch {
    dashboard = null;
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Failed to load dashboard</p>
      </div>
    );
  }

  const { overview, bookings, listingStats, payments, recentBookings } =
    dashboard;

  const statsCards = [
    {
      label: "Total Listings",
      value: overview.totalListings,
      sub: `${overview.approvedListings} approved`,
      icon: Building,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    },
    {
      label: "Total Bookings",
      value: overview.totalBookings,
      sub: `${overview.totalPaidCount} paid`,
      icon: BookOpen,
      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
    },
    {
      label: "Total Revenue",
      value: formatPrice(overview.totalRevenue || 0),
      sub: `${overview.totalUnpaidCount} unpaid`,
      icon: TrendingUp,
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
    },
    {
      label: "Pending Requests",
      value: bookings?.pending || 0,
      sub: `${bookings?.accepted || 0} accepted`,
      icon: Clock,
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
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
          Here is your property overview
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Booking Status
            </h3>
            <Link
              href="/owner/booking-requests"
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Pending",
                value: bookings?.pending || 0,
                color: "bg-amber-500",
              },
              {
                label: "Accepted",
                value: bookings?.accepted || 0,
                color: "bg-blue-500",
              },
              {
                label: "Confirmed",
                value: bookings?.confirmed || 0,
                color: "bg-emerald-500",
              },
              {
                label: "Rejected",
                value: bookings?.rejected || 0,
                color: "bg-red-500",
              },
              {
                label: "Cancelled",
                value: bookings?.cancelled || 0,
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

        {/* Payment Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Payment Summary
            </h3>
            <Link
              href="/owner/payments"
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
                  Total Revenue
                </span>
              </div>
              <span className="font-semibold text-emerald-600">
                {formatPrice(payments?.totalRevenue || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Pending Payments
                </span>
              </div>
              <span className="font-semibold text-amber-600">
                {payments?.unpaidCount || 0}
              </span>
            </div>
          </div>

          {/* Pending Payments List */}
          {payments?.pendingPayments?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Awaiting Payment
              </p>
              {payments.pendingPayments.slice(0, 2).map((p: any) => (
                <div
                  key={p.paymentId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 mb-2"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                      {p.studentName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.listingTitle} · {p.daysWaiting}d waiting
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatPrice(p.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Listing Stats */}
      {listingStats?.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Listing Performance
            </h3>
            <Link
              href="/owner/my-listings"
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
                    Listing
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Applicants
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {listingStats.slice(0, 5).map((ls: any) => (
                  <tr
                    key={ls.listingId}
                    className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          {ls.image ? (
                            <Image
                              src={ls.image}
                              alt={ls.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                              <Building className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white truncate max-w-[150px]">
                            {ls.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {ls.area}, {ls.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ls.status)}`}
                      >
                        {ls.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{ls.stats?.totalApplicants || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-emerald-600">
                      {formatPrice(ls.stats?.totalRevenue || 0)}
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
              href="/owner/booking-requests"
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.slice(0, 5).map((b: any) => (
                  <tr
                    key={b.bookingId || b.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                  >
                    <td className="py-3">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {b.studentName}
                      </p>
                      <p className="text-xs text-slate-400">{b.studentEmail}</p>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                      {b.listingTitle}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(b.bookingStatus || b.status)}`}
                      >
                        {b.bookingStatus || b.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-xs">
                      {formatDate(b.bookedAt || b.createdAt)}
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