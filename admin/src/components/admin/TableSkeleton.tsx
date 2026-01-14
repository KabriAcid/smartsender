import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function TableSkeleton({ columns = 5, rows = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex gap-4 py-4 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="h-4 skeleton-shimmer rounded flex-1"
            style={{ maxWidth: i === 0 ? '200px' : '150px' }}
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex gap-4 py-4 border-b border-border/50"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 skeleton-shimmer rounded flex-1"
              style={{
                maxWidth: colIndex === 0 ? '200px' : '150px',
                animationDelay: `${rowIndex * 0.1}s`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
