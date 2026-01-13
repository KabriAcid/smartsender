import { motion } from 'framer-motion';
import { SharedFile } from '@/types';
import { formatFileSize, formatDate, getRelativeTime, truncateText } from '@/utils/formatters';
import { FILE_TYPE_ICONS } from '@/utils/constants';
import { Download, Eye, Clock, User } from 'lucide-react';

interface FileCardProps {
  file: SharedFile;
  onDownload?: (file: SharedFile) => void;
  onPreview?: (file: SharedFile) => void;
  variant?: 'grid' | 'list';
}

export function FileCard({ file, onDownload, onPreview, variant = 'grid' }: FileCardProps) {
  const icon = FILE_TYPE_ICONS[file.type] || '📄';

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
        className="flex items-center gap-4 p-4 border-b border-border cursor-pointer transition-colors"
        onClick={() => onPreview?.(file)}
      >
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{file.name}</h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {file.senderName}
            </span>
            <span>{formatFileSize(file.size)}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getRelativeTime(file.uploadedAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {file.isDownloaded && (
            <span className="badge-success">Downloaded</span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.(file);
            }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-elevated p-5 cursor-pointer group"
      onClick={() => onPreview?.(file)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center text-3xl">
          {icon}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.(file);
            }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.(file);
            }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <h4 className="font-medium text-foreground mb-1 truncate" title={file.name}>
        {truncateText(file.name, 28)}
      </h4>
      
      {file.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {file.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
        <span>{formatFileSize(file.size)}</span>
        <span>{getRelativeTime(file.uploadedAt)}</span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
          <User className="w-3 h-3 text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground truncate">{file.senderName}</span>
        {file.isDownloaded && (
          <span className="ml-auto badge-success">✓</span>
        )}
      </div>
    </motion.div>
  );
}
