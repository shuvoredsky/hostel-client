"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BedDouble, Users, Heart, Wifi, Droplet, Snowflake, ArrowUpDown, ShieldCheck, Camera, ParkingCircle, Flame } from "lucide-react";
import { IListing } from "@/types/listing.types";
import { formatPrice } from "@/lib/utils";
import { toggleWishlist } from "@/services/wishlist.services";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";
import ListingOfferBadges from "@/components/modules/Listings/ListingOfferBadges";

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

const AMENITY_ICON_MAP: Record<string, { icon: typeof Wifi; label: string }> = {
  WIFI: { icon: Wifi, label: "WiFi" },
  FILTERED_WATER: { icon: Droplet, label: "Water" },
  AC: { icon: Snowflake, label: "AC" },
  LIFT: { icon: ArrowUpDown, label: "Lift" },
  SECURITY_24_7: { icon: ShieldCheck, label: "Security" },
  CCTV: { icon: Camera, label: "CCTV" },
  PARKING: { icon: ParkingCircle, label: "Parking" },
};

interface ListingCardProps {
  listing: IListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { user, isAuthenticated } = useAuth();
  const canBookOrInteract = user?.role === "STUDENT" || user?.role === "TENANT";
  const [isWishlisted, setIsWishlisted] = useState(
    listing.isWishlisted || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const TypeIcon = typeIcons[listing.type];
  const firstImage = listing.images?.[0]?.url;

  const topAmenities = (listing.amenities || []).slice(0, 3);
  const hasGas = listing.gasType && listing.gasType !== "NOT_AVAILABLE";

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login as a student or tenant to save listings");
      return;
    }
    if (!canBookOrInteract) {
      toast.error("Only students and tenants can save listings");
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


        {/* নতুন — Not Available Overlay */}
  {!listing.isAvailable && (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
      <span className="text-white font-semibold px-4 py-1.5 rounded-full bg-black/40 border border-white/30">
        Not Available
      </span>
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

        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {/* Offer Badges */}
          <div className="min-w-[110px] max-w-[180px] text-right">
            <ListingOfferBadges
              studentDiscountPercent={listing.studentDiscountPercent}
              genderPreference={listing.genderPreference}
              variant="compact"
            />
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            disabled={isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
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


        {(topAmenities.length > 0 || hasGas) && (
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
            {topAmenities.map((amenity) => {
              const config = AMENITY_ICON_MAP[amenity];
              if (!config) return null;
              return (
                <div key={amenity} className="flex items-center gap-1">
                  <config.icon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{config.label}</span>
                </div>
              );
            })}
            {hasGas && (
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gas</span>
              </div>
            )}
          </div>
        )}

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