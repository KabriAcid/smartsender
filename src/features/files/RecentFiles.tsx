import { motion } from 'framer-motion';
import { FileActivity } from '@/types';
import { getRelativeTime } from '@/utils/formatters';
import { Upload, Download, Eye, Share2 } from 'lucide-react';

const actionIcons = {
  uploaded: Upload,
  downloaded: Download,
  viewed: Eye,
  shared: Share2,
};

const actionLabels = {
  uploaded: 'uploaded',
  downloaded: 'downloaded',
  viewed: 'viewed',
  shared: 'shared',
};

interface RecentFilesProps {
  activities: FileActivity[];
  isLoading?: boolean;
}

export function RecentFiles({ activities, isLoading }: RecentFilesProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
            <div className="w-10 h-10 bg-muted rounded-lg" />
            <div className="flex-1">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const Icon = actionIcons[activity.action];
        
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">
                <span className="font-medium">{activity.performedBy}</span>{' '}
                {actionLabels[activity.action]}{' '}
                <span className="font-medium">{activity.fileName}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {getRelativeTime(activity.performedAt)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
