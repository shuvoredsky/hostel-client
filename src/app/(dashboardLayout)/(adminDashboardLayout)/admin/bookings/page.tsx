"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import { BookOpen, MapPin, Calendar } from "lucide-react";

export default function AdminBookingsPage() {
  const { isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<string>("1");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await browserClient.get("/bookings/admin/all", {
          params: {
            status: status || "",
            page: page || "1",
            limit: "20",
          },
        });
        setBookings(response?.data?.bookings || response?.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load bookings");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [status, page]);

  const statusOptions = [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "REJECTED", label: "Rejected" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          All Bookings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {bookings.length} bookings found
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              status === opt.value
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {error ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Error loading bookings
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {error}
          </p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking: any) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-5 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {booking.listing?.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Student:{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {booking.student?.name}
                        </span>{" "}
                        · {booking.student?.email}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Owner:{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {booking.owner?.name}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.listing?.area}, {booking.listing?.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Move-in: {formatDate(booking.moveInDate)}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-base font-bold text-emerald-600">
                      {formatPrice(booking.listing?.price || 0)}
                    </span>
                    <span className="text-xs text-slate-400">/month</span>
                    {booking.payment?.status && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.payment.status)}`}
                      >
                        {booking.payment.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-400">
                  Booked on {formatDate(booking.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No bookings found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}