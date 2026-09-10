export default function ListingDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
        {/* Breadcrumb / Title Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-80 max-w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-5 w-60 bg-slate-200/70 dark:bg-slate-800/70 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-72 sm:h-96 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 h-full bg-slate-200 dark:bg-slate-800" />
          <div className="hidden md:grid grid-rows-2 gap-4 h-full">
            <div className="h-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Specs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
              ))}
            </div>

            {/* Description Skeleton */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/70 rounded" />
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/70 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800/70 rounded" />
              </div>
            </div>

            {/* Amenities Skeleton */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card Skeleton */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <div className="h-7 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>

              <div className="space-y-3">
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              </div>

              <div className="h-12 bg-emerald-500/20 rounded-xl w-full" />
              <div className="h-4 w-40 mx-auto bg-slate-100 dark:bg-slate-800/70 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
