import { cn } from '@/lib/utils';

interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie' | 'area';
  className?: string;
  height?: number;
}

export function ChartSkeleton({ type = 'bar', className, height = 300 }: ChartSkeletonProps) {
  if (type === 'pie') {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="w-48 h-48 rounded-full skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2 px-4 pb-8">
        {type === 'bar' && (
          <>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 skeleton-shimmer rounded-t"
                style={{
                  height: `${30 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </>
        )}
        
        {(type === 'line' || type === 'area') && (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 skeleton-shimmer rounded opacity-30" />
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path
                d="M 0 80 Q 50 40, 100 60 T 200 50 T 300 70 T 400 30"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="opacity-20"
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between px-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-3 w-8 skeleton-shimmer rounded"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
}
