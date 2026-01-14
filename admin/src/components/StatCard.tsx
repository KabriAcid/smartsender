import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardSkeleton } from '@/components/skeletons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  isLoading?: boolean;
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  isLoading = false,
  className,
  delay = 0,
}: StatCardProps) {
  if (isLoading) {
    return <CardSkeleton className={className} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn("stat-card group", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="text-3xl font-bold text-foreground mb-2"
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </motion.div>
      
      {trend && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center text-sm font-medium",
              trend.direction === 'up' ? 'text-success' : 'text-destructive'
            )}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">
            {trend.label || 'vs last period'}
          </span>
        </div>
      )}
    </motion.div>
  );
}
