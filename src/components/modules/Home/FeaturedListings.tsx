import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BedDouble, Users, ArrowRight } from "lucide-react";
import { getAllListings } from "@/services/listing.services";
import { IListing } from "@/types/listing.types";
import { formatPrice } from "@/lib/utils";

const typeColors = {
  ROOM: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SEAT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  BASHA: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const typeIcons = {
  ROOM: BedDouble,
  SEAT: Users,
  BASHA: BedDouble,
};

function ListingCard({ listing }: { listing: IListing }) {
  const TypeIcon = typeIcons[listing.type];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0].url}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <BedDouble className="w-10 h-10 text-slate-400" />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              typeColors[listing.type]
            }`}
          >
            <TypeIcon className="w-3 h-3" />
            {listing.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1 truncate group-hover:text-emerald-600 transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {listing.area}, {listing.city}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-emerald-600">
              {formatPrice(listing.price)}
            </span>
            <span className="text-xs text-slate-400">/month</span>
          </div>

          {listing.avgRating ? (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {listing.avgRating.toFixed(1)}
              </span>
              <span className="text-slate-400">
                ({listing.totalReviews})
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}

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
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}