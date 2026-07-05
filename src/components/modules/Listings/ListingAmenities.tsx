"use client";

import {
  Wifi,
  Droplet,
  Snowflake,
  ArrowUpDown,
  ShieldCheck,
  Camera,
  ParkingCircle,
  GraduationCap,
  TrainFront,
  Bus,
} from "lucide-react";
import { Amenity, GasType, NearbyLandmarkType } from "@/types/listing.types";

interface ListingAmenitiesProps {
  amenities: Amenity[];
  gasType: GasType;
  nearbyType?: NearbyLandmarkType;
  nearbyName?: string;
}

const AMENITY_CONFIG: Record<Amenity, { label: string; icon: typeof Wifi }> = {
  WIFI: { label: "WiFi", icon: Wifi },
  FILTERED_WATER: { label: "Filtered Water", icon: Droplet },
  AC: { label: "AC", icon: Snowflake },
  LIFT: { label: "Lift", icon: ArrowUpDown },
  SECURITY_24_7: { label: "24/7 Security", icon: ShieldCheck },
  CCTV: { label: "CCTV", icon: Camera },
  PARKING: { label: "Parking", icon: ParkingCircle },
};

const NEARBY_CONFIG: Record<NearbyLandmarkType, { icon: typeof GraduationCap }> = {
  UNIVERSITY: { icon: GraduationCap },
  METRO_STATION: { icon: TrainFront },
  BUS_STOP: { icon: Bus },
};

export default function ListingAmenities({
  amenities,
  gasType,
  nearbyType,
  nearbyName,
}: ListingAmenitiesProps) {
  const hasAmenities = amenities && amenities.length > 0;
  const hasGas = gasType && gasType !== "NOT_AVAILABLE";
  const hasNearby = nearbyType && nearbyName;

  if (!hasAmenities && !hasGas && !hasNearby) {
    return null;
  }

  const NearbyIcon = nearbyType ? NEARBY_CONFIG[nearbyType].icon : null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
        Amenities & Nearby
      </h3>

      {hasAmenities && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {amenities.map((amenity) => {
            const config = AMENITY_CONFIG[amenity];
            if (!config) return null;
            return (
              <div
                key={amenity}
                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3"
              >
                <config.icon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        {hasGas && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-900 dark:text-white">Gas: </span>
            {gasType === "CYLINDER" ? "Cylinder" : "Supply Line"}
          </p>
        )}

        {hasNearby && NearbyIcon && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <NearbyIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Near {nearbyName}</span>
          </div>
        )}
      </div>
    </div>
  );
}