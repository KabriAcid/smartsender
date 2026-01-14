import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Search,
  Filter,
  Download,
  Upload,
  LogIn,
  LogOut,
  UserPlus,
  Trash2,
  Edit,
  Calendar,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ActivitySkeleton } from '@/components/skeletons';
import { EmptyState } from '@/components/EmptyState';
import { mockActivityLogs } from '@/data/mockData';
import { ActivityLog } from '@/types';
import { cn } from '@/lib/utils';

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActionIcon(action: ActivityLog['action']) {
  switch (action) {
    case 'upload': return Upload;
    case 'download': return Download;
    case 'create': return UserPlus;
    case 'delete': return Trash2;
    case 'update': return Edit;
    case 'login': return LogIn;
    case 'logout': return LogOut;
    default: return Activity;
  }
}

function getActionColor(action: ActivityLog['action']) {
  switch (action) {
    case 'upload': return 'bg-success/20 text-success border-success/30';
    case 'download': return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
    case 'create': return 'bg-primary/20 text-primary border-primary/30';
    case 'delete': return 'bg-destructive/20 text-destructive border-destructive/30';
    case 'update': return 'bg-warning/20 text-warning border-warning/30';
    case 'login': return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
    case 'logout': return 'bg-muted text-muted-foreground border-border';
    default: return 'bg-muted text-muted-foreground border-border';
  }
}

function getActionLabel(action: ActivityLog['action']) {
  switch (action) {
    case 'upload': return 'Uploaded';
    case 'download': return 'Downloaded';
    case 'create': return 'Created';
    case 'delete': return 'Deleted';
    case 'update': return 'Updated';
    case 'login': return 'Logged in';
    case 'logout': return 'Logged out';
    default: return action;
  }
}

export default function AdminActivityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [entityFilter, setEntityFilter] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate more mock activities
      const extendedActivities = [
        ...mockActivityLogs,
        ...mockActivityLogs.map((a, i) => ({
          ...a,
          id: `extra-${i}`,
          performedAt: new Date(Date.now() - i * 3600000 * 2).toISOString(),
        })),
      ];
      setActivities(extendedActivities);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      const matchesSearch = search
        ? a.performedByName.toLowerCase().includes(search.toLowerCase()) ||
          a.entityName.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesAction = actionFilter ? a.action === actionFilter : true;
      const matchesEntity = entityFilter ? a.entityType === entityFilter : true;
      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [activities, search, actionFilter, entityFilter]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityLog[]> = {};
    
    filteredActivities.forEach((activity) => {
      const date = new Date(activity.performedAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });

    return Object.entries(groups).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  }, [filteredActivities]);

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Activity Log"
        description="Monitor all actions and events across the platform"
      >
        <Button variant="outline" className="gap-2 border-border">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </AdminHeader>

      <div className="p-4 lg:p-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>

          <Select
            value={actionFilter || 'all'}
            onValueChange={(v) => setActionFilter(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-[150px] bg-secondary border-border">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="upload">Upload</SelectItem>
              <SelectItem value="download">Download</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={entityFilter || 'all'}
            onValueChange={(v) => setEntityFilter(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-[150px] bg-secondary border-border">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="department">Departments</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Activity List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="p-6">
              <ActivitySkeleton count={8} />
            </div>
          ) : filteredActivities.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No activity found"
              description={search || actionFilter || entityFilter ? 'Try adjusting your filters.' : 'Activity will be logged here.'}
            />
          ) : (
            <div className="divide-y divide-border">
              {groupedActivities.map(([date, logs]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="px-6 py-3 bg-muted/50 flex items-center gap-2 sticky top-0">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {new Date(date).toLocaleDateString('en-NG', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {logs.length} event{logs.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {/* Activity Items */}
                  <AnimatePresence mode="popLayout">
                    {logs.map((activity, index) => {
                      const Icon = getActionIcon(activity.action);

                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: index * 0.03 }}
                          className="px-6 py-4 flex items-start gap-4 hover:bg-accent/30 transition-colors"
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border",
                              getActionColor(activity.action)
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              <span className="font-semibold">{activity.performedByName}</span>
                              {' '}
                              <span className="text-muted-foreground lowercase">
                                {getActionLabel(activity.action)}
                              </span>
                              {' '}
                              {activity.entityType !== 'staff' && (
                                <>
                                  <span className="text-muted-foreground">{activity.entityType}</span>
                                  {' '}
                                </>
                              )}
                              <span className="font-medium">{activity.entityName}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTimeAgo(activity.performedAt)}
                              <span className="mx-2">•</span>
                              {formatDate(activity.performedAt)}
                            </p>
                          </div>

                          {/* Action Badge */}
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize text-xs hidden sm:inline-flex",
                              getActionColor(activity.action)
                            )}
                          >
                            {activity.action}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
