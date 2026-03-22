import { getAllListings } from "@/services/listing.services";
import ListingFilters from "@/components/modules/Listings/ListingFilters";
import ListingCard from "@/components/modules/Listings/ListingCard";
import { IListing, IListingFilters } from "@/types/listing.types";
import { Search } from "lucide-react";
import Link from "next/link";

interface ListingsPageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    area?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
}

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const params = await searchParams;

  const filters: IListingFilters = {
    search: params.search,
    type: params.type as any,
    area: params.area,
    city: params.city,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as any,
    page: params.page ? Number(params.page) : 1,
    limit: 9,
  };

  let listings: IListing[] = [];
  let meta = { total: 0, page: 1, limit: 9, totalPages: 0 };

  try {
    const response = await getAllListings(filters);
    listings = response?.data || [];
    meta = response?.meta || meta;
  } catch {
    listings = [];
  }

  const pages = Array.from(
    { length: meta.totalPages },
    (_, i) => i + 1
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Browse Listings
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {meta.total} listings found
            {params.search && (
              <span> for &quot;{params.search}&quot;</span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <ListingFilters filters={filters} />
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            {listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {pages.map((pageNum) => {
                      const pageParams = new URLSearchParams();
                      
                      // Add all existing params
                      if (params.search) pageParams.set("search", params.search);
                      if (params.type) pageParams.set("type", params.type);
                      if (params.area) pageParams.set("area", params.area);
                      if (params.city) pageParams.set("city", params.city);
                      if (params.minPrice) pageParams.set("minPrice", params.minPrice);
                      if (params.maxPrice) pageParams.set("maxPrice", params.maxPrice);
                      if (params.sortBy) pageParams.set("sortBy", params.sortBy);
                      if (params.sortOrder) pageParams.set("sortOrder", params.sortOrder);
                      pageParams.set("page", pageNum.toString());
                      
                      return (
                        <Link
                          key={pageNum}
                          href={`/listings?${pageParams.toString()}`}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            pageNum === meta.page
                              ? "bg-emerald-600 text-white"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No listings found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}