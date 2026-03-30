"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import { ClipboardList, MapPin, Calendar, MessageSquare, BookOpen } from "lucide-react";
import Image from "next/image";
import BookingStatusButtons from "./BookingStatusButtons";
import AddExtraChargeButton from "./AddExtraChargeButton";

export default function BookingRequestsPage() {
  const { isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await browserClient.get("/bookings/owner");
        setBookings(response?.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load booking requests");
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
        <p className="text-slate-500">Loading booking requests...</p>
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

  const pending = bookings.filter((b) => b.status === "PENDING");
  const others = bookings.filter((b) => b.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Booking Requests
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {bookings.length} total · {pending.length} pending
        </p>
      </div>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Pending Requests
            </h3>
          </div>
          {pending.map((booking: any) => (
            <BookingCard key={booking.id} booking={booking} showActions />
          ))}
        </div>
      )}

      {/* Other Bookings */}
      {others.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            All Requests
          </h3>
          {others.map((booking: any) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}

      {/* Empty */}
      {bookings.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No booking requests yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Requests will appear here once students apply to your listings
          </p>
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  showActions,
}: {
  booking: any;
  showActions?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row gap-4">
        {/* Listing Image */}
        <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
          {booking.listing?.images?.[0]?.url ? (
            <Image
              src={booking.listing.images[0].url}
              alt={booking.listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-slate-400" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {booking.listing?.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                by{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {booking.student?.name}
                </span>{" "}
                · {booking.student?.email}
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

          {booking.message && (
            <div className="flex items-start gap-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
              <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{booking.message}</span>
            </div>
          )}

          <div className="mt-2">
            <span className="text-base font-bold text-emerald-600">
              {formatPrice(booking.listing?.price || 0)}
            </span>
            <span className="text-xs text-slate-400">/month</span>
          </div>

          {/* Extra Charges */}
          {booking.extraCharges?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {booking.extraCharges.map((ec: any) => (
                <span
                  key={ec.id}
                  className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg"
                >
                  {ec.title}: {formatPrice(ec.amount)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          Requested on {formatDate(booking.createdAt)}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Extra Charge — for accepted/confirmed bookings */}
          {(booking.status === "ACCEPTED" ||
            booking.status === "CONFIRMED") && (
            <AddExtraChargeButton bookingId={booking.id} />
          )}

          {/* Accept / Reject — only for pending */}
          {showActions && (
            <BookingStatusButtons bookingId={booking.id} />
          )}
        </div>
      </div>
    </div>
  );
}