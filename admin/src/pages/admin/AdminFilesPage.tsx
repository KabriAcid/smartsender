import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Download,
  Trash2,
  MoreHorizontal,
  Eye,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableSkeleton } from '@/components/skeletons';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { mockFiles } from '@/data/mockData';
import { SharedFile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getFileIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'pdf':
      return FileText;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return FileSpreadsheet;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return FileImage;
    default:
      return File;
  }
}

function getFileTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'text-destructive bg-destructive/10';
    case 'docx':
    case 'doc':
      return 'text-chart-2 bg-chart-2/10';
    case 'xlsx':
    case 'xls':
      return 'text-success bg-success/10';
    case 'pptx':
    case 'ppt':
      return 'text-warning bg-warning/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
}

export default function AdminFilesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [search, setSearch] = useState('');
  const [fileType, setFileType] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SharedFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiles(mockFiles);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = search
        ? f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.uploaderName.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesType = fileType
        ? f.type.toLowerCase() === fileType.toLowerCase()
        : true;
      return matchesSearch && matchesType;
    });
  }, [files, search, fileType]);

  const totalStorage = useMemo(() => {
    return files.reduce((acc, f) => acc + f.size, 0);
  }, [files]);

  const handleDeleteFile = async () => {
    if (!selectedFile) return;

    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 800));

    setFiles((prev) => prev.filter((f) => f.id !== selectedFile.id));
    setIsDeleteOpen(false);
    setSelectedFile(null);
    setIsDeleting(false);

    toast({
      title: 'File Deleted',
      description: 'The file has been permanently removed.',
    });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="File Management"
        description="View and manage all shared files across the institution"
      />

      <div className="p-4 lg:p-8">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Files</p>
            <p className="text-2xl font-bold text-foreground">{files.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Storage</p>
            <p className="text-2xl font-bold text-foreground">{formatBytes(totalStorage)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Downloads</p>
            <p className="text-2xl font-bold text-foreground">
              {files.reduce((acc, f) => acc + f.downloadCount, 0)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">File Types</p>
            <p className="text-2xl font-bold text-foreground">
              {new Set(files.map((f) => f.type)).size}
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files or uploaders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>

          <Select
            value={fileType || 'all'}
            onValueChange={(v) => setFileType(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-[150px] bg-secondary border-border">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">DOCX</SelectItem>
              <SelectItem value="xlsx">XLSX</SelectItem>
              <SelectItem value="pptx">PPTX</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Files Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="p-4">
              <TableSkeleton columns={6} rows={6} />
            </div>
          ) : filteredFiles.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No files found"
              description={search ? 'Try adjusting your search or filters.' : 'Files uploaded by staff will appear here.'}
            />
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
                <div className="col-span-4">File Name</div>
                <div className="col-span-2">Uploader</div>
                <div className="col-span-2">Recipients</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-1">Downloads</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {filteredFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file.type);

                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 table-row-hover"
                      >
                        {/* File Name & Type */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                              getFileTypeColor(file.type)
                            )}
                          >
                            <FileIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground uppercase">{file.type}</p>
                          </div>
                        </div>

                        {/* Uploader */}
                        <div className="hidden md:flex col-span-2 items-center text-sm text-foreground">
                          {file.uploaderName}
                        </div>

                        {/* Recipients */}
                        <div className="hidden md:flex col-span-2 items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {file.recipientNames.length} recipient{file.recipientNames.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>

                        {/* Size */}
                        <div className="hidden md:flex col-span-1 items-center text-sm text-muted-foreground">
                          <HardDrive className="w-3 h-3 mr-1" />
                          {formatBytes(file.size)}
                        </div>

                        {/* Downloads */}
                        <div className="hidden md:flex col-span-1 items-center text-sm text-muted-foreground">
                          <Download className="w-3 h-3 mr-1" />
                          {file.downloadCount}
                        </div>

                        {/* Date */}
                        <div className="hidden md:flex col-span-1 items-center text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(file.createdAt)}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="w-4 h-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Download className="w-4 h-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem
                                className="gap-2 text-destructive focus:text-destructive"
                                onClick={() => {
                                  setSelectedFile(file);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete File"
        description={`Are you sure you want to delete "${selectedFile?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDeleteFile}
        isLoading={isDeleting}
      />
    </div>
  );
}
