import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { LoadingPage, EmptyState } from '@/components/feedback';
import { FileCard, UploadPanel } from '@/features/files';
import { useAuth } from '@/hooks/useAuth';
import { getMyFiles, downloadFile } from '@/api/files.api';
import { SharedFile, FileCategory } from '@/types';
import { Grid, List, Search, Filter, X } from 'lucide-react';

const categories: { value: FileCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Files' },
  { value: 'document', label: 'Documents' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'archive', label: 'Archives' },
];

export default function FilesPage() {
  const { staff } = useAuth();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<SharedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | 'all'>('all');
  const [showUpload, setShowUpload] = useState(false);

  const loadFiles = async () => {
    try {
      const response = await getMyFiles();
      if (response.success && response.data) {
        setFiles(response.data);
        setFilteredFiles(response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Filter files when search or category changes
  useEffect(() => {
    let result = files;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((file) => file.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (file) =>
          file.name.toLowerCase().includes(query) ||
          file.senderName.toLowerCase().includes(query) ||
          file.description?.toLowerCase().includes(query)
      );
    }

    setFilteredFiles(result);
  }, [files, searchQuery, selectedCategory]);

  const handleDownload = async (file: SharedFile) => {
    if (!staff) return;
    await downloadFile(file.id, `${staff.firstName} ${staff.lastName}`);
    loadFiles();
  };

  const handleUploadSuccess = () => {
    loadFiles();
    setShowUpload(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingPage text="Loading files..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            Files
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Manage and share your files securely
          </motion.p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary"
        >
          {showUpload ? 'Cancel' : 'Upload File'}
        </motion.button>
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <UploadPanel onSuccess={handleUploadSuccess} />
        </motion.div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files by name, sender, or description..."
            className="input-field pl-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <EmptyState
          variant="files"
          title={searchQuery || selectedCategory !== 'all' ? 'No files found' : 'No files yet'}
          description={
            searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Upload a file or wait for colleagues to share files with you'
          }
          action={
            searchQuery || selectedCategory !== 'all'
              ? {
                  label: 'Clear filters',
                  onClick: () => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  },
                }
              : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <FileCard file={file} onDownload={handleDownload} variant="grid" />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card-elevated divide-y divide-border">
          {filteredFiles.map((file) => (
            <FileCard key={file.id} file={file} onDownload={handleDownload} variant="list" />
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredFiles.length > 0 && (
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Showing {filteredFiles.length} of {files.length} files
        </p>
      )}
    </DashboardLayout>
  );
}
