"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import { BookOpen, Calendar, MapPin, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CancelBookingButton from "./CancelBookingButton";

export default function MyBookingsPage() {
  const { isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await browserClient.get("/bookings/my-bookings");
        setBookings(response?.data?.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load bookings");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Bookings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-5 flex flex-col sm:flex-row gap-4">
                {/* Image */}
                <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0">
                  {booking.listing?.images?.[0]?.url ? (
                    <Image
                      src={booking.listing.images[0].url}
                      alt={booking.listing.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {booking.listing?.title}
                    </h3>
                    <span
                      className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {booking.listing?.area}, {booking.listing?.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Move-in: {formatDate(booking.moveInDate)}
                    </span>
                  </div>

                  {booking.message && (
                    <div className="flex items-start gap-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{booking.message}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-emerald-600">
                        {formatPrice(booking.listing?.price || 0)}
                      </span>
                      <span className="text-xs text-slate-400">/month</span>
                    </div>

                    {/* Extra Charges */}
                    {booking.extraCharges?.length > 0 && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        +{booking.extraCharges.length} extra charge(s)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Booked on {formatDate(booking.createdAt)}
                </p>

                <div className="flex items-center gap-2">
                  {/* Payment Status */}
                  {booking.payment && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.payment.status)}`}
                    >
                      {booking.payment.status}
                    </span>
                  )}

                  {/* Cancel Button */}
                  {booking.status === "PENDING" && (
                    <CancelBookingButton bookingId={booking.id} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No bookings yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Browse listings and send your first booking request
          </p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      )}
    </div>
  );
}