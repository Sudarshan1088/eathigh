export default function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-lg mx-auto bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-6 shadow-2xl animate-pulse">
      {/* Image Skeleton */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-neutral-800 rounded-2xl" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Title & Brand Skeleton */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-7 w-3/4 bg-neutral-800 rounded-lg" />
          <div className="h-4 w-1/3 bg-neutral-800 rounded-md" />
        </div>

        {/* Rating Bar Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-full bg-neutral-800 rounded-full" />
          <div className="flex justify-between items-center">
            <div className="h-6 w-12 bg-neutral-800 rounded-md" />
            <div className="h-4 w-16 bg-neutral-800 rounded-md" />
          </div>
        </div>

        {/* AI Summary Skeleton */}
        <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="h-5 w-24 bg-neutral-800 rounded-md" />
          <div className="h-4 w-full bg-neutral-800 rounded-md" />
          <div className="h-4 w-full bg-neutral-800 rounded-md" />
          <div className="h-4 w-2/3 bg-neutral-800 rounded-md" />
        </div>

        {/* Nutrition Grid Skeleton */}
        <div>
          <div className="h-4 w-32 bg-neutral-800 rounded-md mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
