import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '@/hooks/useFileUpload';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { formatFileSize } from '@/utils/formatters';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

interface UploadPanelProps {
  onSuccess?: () => void;
}

export function UploadPanel({ onSuccess }: UploadPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const { isUploading, progress, error, upload, resetState } = useFileUpload();
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      resetState();
      setUploadSuccess(false);
    }
  }, [resetState]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'video/mp4': ['.mp4'],
      'audio/mpeg': ['.mp3'],
      'application/zip': ['.zip'],
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    // For demo, we'll share to all staff (in production, this would be a selection UI)
    const result = await upload(selectedFile, ['staff-001', 'staff-002', 'staff-003'], description);
    
    if (result) {
      setUploadSuccess(true);
      setSelectedFile(null);
      setDescription('');
      onSuccess?.();
      
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setDescription('');
    resetState();
    setUploadSuccess(false);
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Upload File</h3>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-foreground bg-muted/50'
            : 'border-border hover:border-muted-foreground'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          {isDragActive ? (
            <p className="text-foreground font-medium">Drop the file here</p>
          ) : (
            <>
              <p className="text-foreground font-medium">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOC, XLS, PPT, Images, MP4, MP3, ZIP (Max {formatFileSize(MAX_FILE_SIZE)})
              </p>
            </>
          )}
        </div>
      </div>

      {/* Selected File */}
      <AnimatePresence mode="wait">
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                onClick={handleClear}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="input-field mt-3 resize-none"
              rows={2}
            />

            {/* Progress */}
            {isUploading && (
              <div className="mt-3">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Uploading... {progress}%
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="btn-primary w-full mt-4"
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 mt-4 p-3 bg-success/10 text-success rounded-lg"
          >
            <Check className="w-4 h-4" />
            <p className="text-sm font-medium">File uploaded successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
