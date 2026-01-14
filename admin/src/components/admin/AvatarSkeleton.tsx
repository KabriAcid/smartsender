import { cn } from '@/lib/utils';

interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function AvatarSkeleton({ size = 'md', className }: AvatarSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-full skeleton-shimmer",
        sizeClasses[size],
        className
      )}
    />
  );
}

interface ActivitySkeletonProps {
  count?: number;
  className?: string;
}

export function ActivitySkeleton({ count = 5, className }: ActivitySkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-lg"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <AvatarSkeleton size="sm" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 skeleton-shimmer rounded" />
            <div className="h-3 w-1/4 skeleton-shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
