import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { LoadingPage } from '@/components/feedback';
import { StatCard } from '@/features/staff';
import { FileCard, RecentFiles } from '@/features/files';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardStats, getReceivedFiles, downloadFile } from '@/api/files.api';
import { DashboardStats, SharedFile } from '@/types';
import { formatFileSize } from '@/utils/formatters';
import { 
  FolderOpen, 
  Download, 
  Upload, 
  HardDrive,
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export default function Dashboard() {
  const { staff } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentFiles, setRecentFiles] = useState<SharedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!staff) return;

      try {
        const [statsRes, filesRes] = await Promise.all([
          getDashboardStats(staff.id),
          getReceivedFiles(staff.id),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (filesRes.success && filesRes.data) {
          setRecentFiles(filesRes.data.slice(0, 4));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [staff]);

  const handleDownload = async (file: SharedFile) => {
    if (!staff) return;
    await downloadFile(file.id, `${staff.firstName} ${staff.lastName}`);
    // Refresh data
    const filesRes = await getReceivedFiles(staff.id);
    if (filesRes.success && filesRes.data) {
      setRecentFiles(filesRes.data.slice(0, 4));
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingPage text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground"
        >
          Welcome back, {staff?.firstName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-1"
        >
          Here's an overview of your file sharing activity
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Files"
          value={stats?.totalFiles || 0}
          icon={FolderOpen}
          subtitle="In your workspace"
        />
        <StatCard
          title="Files Received"
          value={stats?.totalReceived || 0}
          icon={Download}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Files Sent"
          value={stats?.totalSent || 0}
          icon={Upload}
        />
        <StatCard
          title="Storage Used"
          value={formatFileSize(stats?.storageUsed || 0)}
          icon={HardDrive}
          subtitle="Total file size"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Files */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Files</h2>
            <Link
              to={ROUTES.FILES}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FileCard
                    file={file}
                    onDownload={handleDownload}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card-elevated p-8 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No files received yet</p>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="card-elevated p-4">
            <RecentFiles
              activities={stats?.recentActivity || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
