import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  className?: string;
  showIcon?: boolean;
  showTrend?: boolean;
}

export function CardSkeleton({ className, showIcon = true, showTrend = true }: CardSkeletonProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 w-24 skeleton-shimmer rounded" />
        {showIcon && (
          <div className="h-10 w-10 skeleton-shimmer rounded-lg" />
        )}
      </div>
      
      <div className="h-8 w-32 skeleton-shimmer rounded mb-2" />
      
      {showTrend && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 skeleton-shimmer rounded" />
          <div className="h-4 w-20 skeleton-shimmer rounded" />
        </div>
      )}
    </div>
  );
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
