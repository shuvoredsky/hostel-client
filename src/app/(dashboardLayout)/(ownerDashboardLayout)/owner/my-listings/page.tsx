import { getMyListings } from "@/services/listing.services";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { Building, MapPin, Tag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import DeleteListingButton from "./DeleteListingButton";
import CreateListingButton from "./CreateListingButton";
import ViewListingButton from "./ViewListingButton";

export default async function MyListingsPage() {
  let listings: any[] = [];

  try {
    const response = await getMyListings();
    listings = response?.data || [];
  } catch {
    listings = [];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Listings
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {listings.length} listing{listings.length !== 1 ? "s" : ""} total
          </p>
        </div>

        <CreateListingButton />
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {listings.map((listing: any) => {
            const imageUrl = listing.images?.[0]?.url || null;

            return (
              <div
                key={listing.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-700">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                      <Tag className="w-3 h-3" />
                      {listing.type}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}
                    >
                      {listing.status}
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        listing.isAvailable
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {listing.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {listing.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {listing.area}, {listing.city}
                    </span>
                  </div>

                  {listing.totalReviews > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {listing.avgRating}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({listing.totalReviews})
                      </span>
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-emerald-600">
                        {formatPrice(listing.price)}
                      </span>
                      <span className="text-xs text-slate-400">/month</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ViewListingButton listingId={listing.id} />
                      <DeleteListingButton listingId={listing.id} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No listings yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Create your first listing to start receiving booking requests
          </p>
          <CreateListingButton />
        </div>
      )}
    </div>
  );
}