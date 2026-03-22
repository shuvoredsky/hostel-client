"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BedDouble, Users, Heart } from "lucide-react";
import { IListing } from "@/types/listing.types";
import { formatPrice } from "@/lib/utils";
import { toggleWishlist } from "@/services/wishlist.services";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";

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

interface ListingCardProps {
  listing: IListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(
    listing.isWishlisted || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const TypeIcon = typeIcons[listing.type];
  const firstImage = listing.images?.[0]?.url;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || user?.role !== "STUDENT") {
      toast.error("Please login as a student to save listings");
      return;
    }

    try {
      setIsLoading(true);
      await toggleWishlist(listing.id);
      setIsWishlisted((prev) => !prev);
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
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

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={isLoading}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`}
          />
        </button>
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

          {listing.avgRating > 0 ? (
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