"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import BookingList from "./BookingList";

export default function MyBookingsPageContent() {
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
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Bookings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <BookingList bookings={bookings} />
    </div>
  );
}
