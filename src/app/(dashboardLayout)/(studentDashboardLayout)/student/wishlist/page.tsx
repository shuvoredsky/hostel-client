import { getMyWishlist } from "@/services/wishlist.services";
import { formatPrice, getStatusColor } from "@/lib/utils";
import { Heart, MapPin, Star, BedDouble, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RemoveWishlistButton from "./RemoveWishlistButton";

export default async function WishlistPage() {
  let wishlist: any[] = [];

  try {
    const response = await getMyWishlist();
    wishlist = response?.data || [];
  } catch {
    wishlist = [];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Wishlist
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {wishlist.length} saved listing{wishlist.length !== 1 ? "s" : ""}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{wishlist.length} saved</span>
          </div>
        )}
      </div>

      {/* Wishlist Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {wishlist.map((item: any) => {
            const listing = item.listing;
            const imageUrl = listing?.images?.[0]?.url || null;

            return (
              <div
                key={item.wishlistId}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={listing?.title || "Listing"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BedDouble className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                      <Tag className="w-3 h-3" />
                      {listing?.type}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {listing?.status && (
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}
                      >
                        {listing.status}
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <div className="absolute bottom-3 right-3">
                    <RemoveWishlistButton listingId={listing?.id} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1">
                    {listing?.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {listing?.area}, {listing?.city}
                    </span>
                  </div>

                  {/* Rating */}
                  {listing?.totalReviews > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {listing.avgRating}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        ({listing.totalReviews} review{listing.totalReviews !== 1 ? "s" : ""})
                      </span>
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div>
                      <span className="text-lg font-bold text-emerald-600">
                        {formatPrice(listing?.price || 0)}
                      </span>
                      <span className="text-xs text-slate-400">/month</span>
                    </div>

                    <Link
                      href={`/listings/${listing?.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "text-xs rounded-lg"
                      )}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-rose-300 dark:text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No saved listings yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Browse listings and save your favourites by clicking the heart icon
          </p>
          <Link
            href="/listings"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            Browse Listings
          </Link>
        </div>
      )}
    </div>
  );
}