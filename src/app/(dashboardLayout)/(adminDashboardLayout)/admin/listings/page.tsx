"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import browserClient from "@/lib/browserClient";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import { Building, MapPin, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import AdminListingActions from "./AdminListingActions";

export default function AdminListingsPage() {
  const { isLoading: authLoading } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await browserClient.get("/listings/admin/all");
        // ✅ ঠিক
setListings(response?.data?.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load listings");
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const pending = listings.filter((l) => l.status === "PENDING");
  const others = listings.filter((l) => l.status !== "PENDING");

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading listings...</p>
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
          All Listings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {listings.length} total · {pending.length} pending approval
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Pending Approval
            </h3>
          </div>
          {pending.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} showActions />
          ))}
        </div>
      )}

      {/* Others */}
      {others.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            All Listings
          </h3>
          {others.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {listings.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No listings found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Listings will appear here once owners create them
          </p>
        </div>
      )}
    </div>
  );
}

function ListingCard({
  listing,
  showActions,
}: {
  listing: any;
  showActions?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
          {listing.images?.[0]?.url ? (
            <Image
              src={listing.images[0].url}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Building className="w-6 h-6 text-slate-400" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {listing.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                by{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {listing.owner?.name}
                </span>{" "}
                · {listing.owner?.email}
              </p>
            </div>
            <span
              className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}
            >
              {listing.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {listing.area}, {listing.city}
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {listing.type}
            </span>
          </div>

          <div className="mt-2">
            <span className="text-base font-bold text-emerald-600">
              {formatPrice(listing.price || 0)}
            </span>
            <span className="text-xs text-slate-400">/month</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          Created {formatDate(listing.createdAt)}
        </p>
        {showActions && <AdminListingActions listingId={listing.id} />}
      </div>
    </div>
  );
}