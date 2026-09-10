export default function ListingsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2" />
          <div className="h-5 w-96 max-w-full bg-slate-200/70 dark:bg-slate-800/70 rounded" />
        </div>

        {/* Search & Filter Bar Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Results Counter Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>

        {/* Listing Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 flex flex-col"
            >
              {/* Image Skeleton */}
              <div className="h-48 sm:h-52 bg-slate-200 dark:bg-slate-800 w-full relative">
                <div className="absolute top-3 left-3 h-6 w-16 bg-slate-300 dark:bg-slate-700 rounded-md" />
                <div className="absolute top-3 right-3 h-8 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>

              {/* Body Skeleton */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>

                {/* Amenity Badges Skeleton */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
                  <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
                  <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
                </div>

                {/* Price & Action Skeleton */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-9 w-24 bg-emerald-500/20 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
