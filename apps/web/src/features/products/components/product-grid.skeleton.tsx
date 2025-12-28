import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`skeleton-${index.toString()}`}
          className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-4"
        >
          <LoadingSkeleton className="mb-4 h-48 w-full" />
          <LoadingSkeleton className="mb-2 h-4 w-1/2" />
          <LoadingSkeleton className="mb-1 h-4 w-full" />
          <LoadingSkeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
