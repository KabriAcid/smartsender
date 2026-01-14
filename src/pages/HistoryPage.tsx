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
    History,
    Search as SearchIcon,
} from 'lucide-react';

export default function HistoryPage() {
    const { staff } = useAuth();
    const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

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

    // Sort files
    const sortedFiles = [...filteredFiles].sort((a, b) => {
        if (sortBy === 'recent') {
            return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        } else {
            return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        }
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <LoadingSpinner />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-64px)]">
                {/* Header with search and sort */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border-b border-border p-4 lg:p-6 space-y-4 flex-shrink-0"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground mb-1">Shared files</h1>
                        <p className="text-sm text-muted-foreground">Files you've shared with colleagues</p>
                    </div>

                    {/* Search and Sort Bar */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest')}
                            className="px-3 py-2 rounded-lg bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                        >
                            <option value="recent">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </div>
                </motion.div>

                {/* Files List */}
                <div className="flex-1 overflow-y-auto">
                    {sortedFiles.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <EmptyState
                                icon={History}
                                title={searchQuery ? 'No results' : 'No shared files'}
                                description={searchQuery
                                    ? 'Try a different search.'
                                    : 'Files you share will appear here'}
                            />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 lg:p-6 space-y-2"
                        >
                            {sortedFiles.map((file, idx) => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="group flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/40 hover:bg-muted/30 transition-all cursor-default"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xl flex-shrink-0">
                                                {file.category === 'image' && '🖼️'}
                                                {file.category === 'video' && '🎬'}
                                                {file.category === 'document' && '📄'}
                                                {file.category === 'archive' && '📦'}
                                                {!['image', 'video', 'document', 'archive'].includes(file.category) && '📎'}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-foreground truncate text-sm">
                                                    {file.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <span>{formatFileSize(file.size)}</span>
                                                    <span>•</span>
                                                    <span>{formatDateTime(file.uploadedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-8 text-xs text-muted-foreground">
                                            {file.recipientIds.length} recipient{file.recipientIds.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDownload(file)}
                                        className="ml-4 flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
                                        title="Download file"
                                    >
                                        <Download className="w-5 h-5" />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
