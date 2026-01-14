import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  HardDrive,
  Activity,
  TrendingUp,
  Clock,
  Upload,
  Download,
  UserPlus,
  LogIn,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AdminHeader } from '@/components/admin';
import { StatCard } from '@/components/StatCard';
import { StatCardsSkeleton, ChartSkeleton, ActivitySkeleton } from '@/components/skeletons';
import { mockAdminStats, mockAnalyticsData, mockActivityLogs } from '@/data/mockData';
import { AdminStats, AnalyticsData, ActivityLog } from '@/types';
import { cn } from '@/lib/utils';

const CHART_COLORS = ['hsl(0, 0%, 98%)', 'hsl(0, 0%, 70%)', 'hsl(0, 0%, 50%)', 'hsl(0, 0%, 35%)', 'hsl(0, 0%, 20%)'];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function getActionIcon(action: ActivityLog['action']) {
  switch (action) {
    case 'upload': return Upload;
    case 'download': return Download;
    case 'create': return UserPlus;
    case 'login': return LogIn;
    default: return Activity;
  }
}

function getActionColor(action: ActivityLog['action']) {
  switch (action) {
    case 'upload': return 'bg-success/20 text-success';
    case 'download': return 'bg-chart-2/20 text-chart-2';
    case 'create': return 'bg-primary/20 text-primary';
    case 'delete': return 'bg-destructive/20 text-destructive';
    default: return 'bg-muted text-muted-foreground';
  }
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setStats(mockAdminStats);
      setAnalytics(mockAnalyticsData);
      setActivities(mockActivityLogs);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const storagePercentage = stats 
    ? Math.round((stats.storageUsed / stats.storageQuota) * 100) 
    : 0;

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard"
        description="Overview of your institution's SmartSender usage"
      />

      <div className="p-4 lg:p-8 space-y-8">
        {/* Stats Grid */}
        {isLoading ? (
          <StatCardsSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Staff"
              value={stats?.totalStaff || 0}
              icon={Users}
              trend={{ value: 12, direction: 'up', label: 'this month' }}
              delay={0}
            />
            <StatCard
              title="Active Users"
              value={stats?.activeUsers || 0}
              icon={Activity}
              trend={{ value: 8, direction: 'up', label: 'vs last week' }}
              delay={0.1}
            />
            <StatCard
              title="Total Files"
              value={stats?.totalFiles || 0}
              icon={FileText}
              trend={{ value: 23, direction: 'up', label: 'this week' }}
              delay={0.2}
            />
            <StatCard
              title="Storage Used"
              value={formatBytes(stats?.storageUsed || 0)}
              icon={HardDrive}
              trend={{ value: storagePercentage, direction: 'up', label: 'of quota' }}
              delay={0.3}
            />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Uploads Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">File Uploads</h3>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-success">
                <TrendingUp className="w-4 h-4" />
                <span>+23%</span>
              </div>
            </div>
            
            {isLoading ? (
              <ChartSkeleton type="area" height={250} />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={analytics?.uploadsOverTime}>
                  <defs>
                    <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 0%, 98%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 0%, 98%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="hsl(0, 0%, 60%)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(0, 0%, 60%)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 6%)',
                      border: '1px solid hsl(0, 0%, 15%)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(0, 0%, 98%)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(0, 0%, 98%)"
                    strokeWidth={2}
                    fill="url(#uploadGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Storage by Department */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Storage by Department</h3>
                <p className="text-sm text-muted-foreground">In megabytes</p>
              </div>
            </div>
            
            {isLoading ? (
              <ChartSkeleton type="bar" height={250} />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics?.storageByDepartment} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" horizontal={false} />
                  <XAxis 
                    type="number" 
                    stroke="hsl(0, 0%, 60%)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="label" 
                    stroke="hsl(0, 0%, 60%)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 6%)',
                      border: '1px solid hsl(0, 0%, 15%)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(0, 0%, 98%)' }}
                    formatter={(value: number) => [`${value} MB`, 'Storage']}
                  />
                  <Bar dataKey="value" fill="hsl(0, 0%, 98%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">File Types</h3>
            
            {isLoading ? (
              <ChartSkeleton type="pie" height={200} />
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics?.fileTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {analytics?.fileTypeDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 6%)',
                        border: '1px solid hsl(0, 0%, 15%)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  {analytics?.fileTypeDistribution.map((item, index) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Real-time</span>
              </div>
            </div>
            
            {isLoading ? (
              <ActivitySkeleton count={5} />
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity, index) => {
                  const Icon = getActionIcon(activity.action);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        getActionColor(activity.action)
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.performedByName}</span>
                          {' '}
                          <span className="text-muted-foreground">
                            {activity.action === 'upload' && 'uploaded'}
                            {activity.action === 'download' && 'downloaded'}
                            {activity.action === 'create' && 'created'}
                            {activity.action === 'delete' && 'deleted'}
                            {activity.action === 'update' && 'updated'}
                            {activity.action === 'login' && 'logged in'}
                            {activity.action === 'logout' && 'logged out'}
                          </span>
                          {' '}
                          <span className="font-medium truncate">{activity.entityName}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(activity.performedAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
