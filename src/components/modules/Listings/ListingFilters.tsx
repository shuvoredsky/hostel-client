"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IListingFilters } from "@/types/listing.types";

const listingTypes = [
  { value: "", label: "All Types" },
  { value: "ROOM", label: "Room" },
  { value: "SEAT", label: "Seat" },
  { value: "BASHA", label: "Basha" },
];

const sortOptions = [
  { value: "", label: "Latest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const popularAreas = [
  "Mirpur",
  "Dhanmondi",
  "Mohammadpur",
  "Uttara",
  "Bashundhara",
  "Gulshan",
  "Banani",
  "Rayer Bazar",
];

interface ListingFiltersProps {
  filters: IListingFilters;
}

export default function ListingFilters({ filters }: ListingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(filters.search || "");
  const [type, setType] = useState(filters.type || "");
  const [area, setArea] = useState(filters.area || "");
  const [minPrice, setMinPrice] = useState(
    filters.minPrice?.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice?.toString() || ""
  );
  const [sort, setSort] = useState(
    filters.sortBy
      ? `${filters.sortBy}-${filters.sortOrder || "asc"}`
      : ""
  );

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    if (area) params.set("area", area);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) {
      const [sortBy, sortOrder] = sort.split("-");
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }
    params.set("page", "1");
    router.push(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setType("");
    setArea("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    router.push("/listings");
  };

  const hasActiveFilters =
    search || type || area || minPrice || maxPrice || sort;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-9"
          />
        </div>
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Type
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {listingTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                type === t.value
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-emerald-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div className="space-y-1.5">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Area
        </Label>
        <Input
          placeholder="Enter area..."
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {popularAreas.map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`text-xs px-2 py-1 rounded-full border transition-all ${
                area === a
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-emerald-400"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-1.5">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Price Range (BDT)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-slate-400">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-1.5">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Sort By
        </Label>
        <div className="space-y-1">
          {sortOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                sort === s.value
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-emerald-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <Button
        onClick={applyFilters}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        Apply Filters
      </Button>
    </div>
  );
}