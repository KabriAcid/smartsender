import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { LoadingSpinner, EmptyState } from '@/components/feedback';
import { useAuth } from '@/hooks/useAuth';
import { getMyFiles, downloadFile } from '@/api/files.api';
import { SharedFile } from '@/types';
import { formatFileSize, formatDateTime } from '@/utils/formatters';
import {
  Download,
  History
} from 'lucide-react';

export default function Dashboard() {
  const { staff } = useAuth();
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!staff) return;

      try {
        const res = await getMyFiles();
        if (res.success && res.data) {
          setSharedFiles(res.data);
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
  };

  const filteredFiles = sharedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <History className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Sharing History</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          View all files you've shared with staff members across your institution
        </p>
      </motion.div>

      {/* Search */}
      <div className="px-6 mb-6">
        <input
          type="text"
          placeholder="Search by file name or recipient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Shared Files List */}
      {filteredFiles.length === 0 ? (
        <div className="px-6">
          <EmptyState
            icon={History}
            title="No shared files"
            description={searchQuery
              ? 'No files match your search.'
              : 'You haven\'t shared any files yet.'}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 space-y-3"
        >
          {filteredFiles.map((file, idx) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">
                    {file.category === 'image' && '🖼️'}
                    {file.category === 'video' && '🎬'}
                    {file.category === 'document' && '📄'}
                    {file.category === 'archive' && '📦'}
                    {!['image', 'video', 'document', 'archive'].includes(file.category) && '📎'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{file.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.category}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground ml-11">
                  Shared to {file.recipientIds.length} recipient{file.recipientIds.length !== 1 ? 's' : ''} on {formatDateTime(file.uploadedAt)}
                </p>
              </div>

              <button
                onClick={() => handleDownload(file)}
                className="ml-4 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Download file"
              >
                <Download className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
}
