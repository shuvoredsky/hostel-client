import Link from "next/link";
import { BedDouble, ArrowRight } from "lucide-react";
import { getAllListings } from "@/services/listing.services";
import { IListing } from "@/types/listing.types";
import ListingCard from "@/components/modules/Listings/ListingCard";

export default async function FeaturedListings() {
  let listings: IListing[] = [];

  try {
    const response = await getAllListings({ limit: 6, sortBy: "createdAt", sortOrder: "desc" });
    listings = response?.data || [];
  } catch {
    listings = [];
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-emerald-600 font-medium text-sm mb-2">
              ✦ Featured Listings
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Find Your Perfect Place
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Verified and student-friendly housing options in Dhaka
            </p>
          </div>
          <Link
            href="/listings"
            className="hidden sm:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No listings available yet</p>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-emerald-600 font-medium"
          >
            View All Listings
            <ArrowRight className="w-4 h-4 sm:ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedListingsSkeleton() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2" />
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 h-80 flex flex-col justify-between"
            >
              <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse w-full" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-24" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}