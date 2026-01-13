import { ApiResponse, SharedFile, FileActivity, DashboardStats } from '@/types';
import { mockFiles, mockActivities } from '@/mockdata';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/constants';
import { getFileCategory } from '@/utils/formatters';
import type { FileType } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get stored files or initialize with mock data
 */
function getStoredFiles(): SharedFile[] {
  const stored = storage.get<SharedFile[]>(STORAGE_KEYS.FILES_DATA);
  if (!stored) {
    storage.set(STORAGE_KEYS.FILES_DATA, mockFiles);
    return mockFiles;
  }
  return stored;
}

/**
 * Get stored activities or initialize with mock data
 */
function getStoredActivities(): FileActivity[] {
  const stored = storage.get<FileActivity[]>(STORAGE_KEYS.ACTIVITY_DATA);
  if (!stored) {
    storage.set(STORAGE_KEYS.ACTIVITY_DATA, mockActivities);
    return mockActivities;
  }
  return stored;
}

/**
 * Get all files for current user (received + sent)
 */
export async function getMyFiles(): Promise<ApiResponse<SharedFile[]>> {
  await delay(400);
  
  const files = getStoredFiles();
  return { success: true, data: files };
}

/**
 * Get files received by current user
 */
export async function getReceivedFiles(staffId: string): Promise<ApiResponse<SharedFile[]>> {
  await delay(400);
  
  const files = getStoredFiles();
  const received = files.filter(f => f.recipientIds.includes(staffId));
  
  return { success: true, data: received };
}

/**
 * Get files sent by current user
 */
export async function getSentFiles(staffId: string): Promise<ApiResponse<SharedFile[]>> {
  await delay(400);
  
  const files = getStoredFiles();
  const sent = files.filter(f => f.senderId === staffId);
  
  return { success: true, data: sent };
}

/**
 * Get single file by ID
 */
export async function getFileById(fileId: string): Promise<ApiResponse<SharedFile>> {
  await delay(300);
  
  const files = getStoredFiles();
  const file = files.find(f => f.id === fileId);
  
  if (!file) {
    return { success: false, error: 'File not found' };
  }
  
  return { success: true, data: file };
}

/**
 * Upload a new file
 */
export async function uploadFile(
  file: File,
  recipientIds: string[],
  senderId: string,
  senderName: string,
  description?: string
): Promise<ApiResponse<SharedFile>> {
  await delay(1000); // Simulate upload time
  
  const extension = file.name.split('.').pop()?.toLowerCase() as FileType;
  
  const newFile: SharedFile = {
    id: `file-${Date.now()}`,
    name: file.name,
    type: extension,
    category: getFileCategory(extension),
    size: file.size,
    senderId,
    senderName,
    recipientIds,
    uploadedAt: new Date().toISOString(),
    downloadCount: 0,
    isDownloaded: false,
    description,
  };
  
  const files = getStoredFiles();
  files.unshift(newFile);
  storage.set(STORAGE_KEYS.FILES_DATA, files);
  
  // Add activity
  const activities = getStoredActivities();
  activities.unshift({
    id: `act-${Date.now()}`,
    fileId: newFile.id,
    fileName: newFile.name,
    action: 'uploaded',
    performedBy: senderName,
    performedAt: new Date().toISOString(),
  });
  storage.set(STORAGE_KEYS.ACTIVITY_DATA, activities);
  
  return { success: true, data: newFile };
}

/**
 * Mark file as downloaded
 */
export async function downloadFile(fileId: string, downloaderName: string): Promise<ApiResponse<SharedFile>> {
  await delay(500);
  
  const files = getStoredFiles();
  const fileIndex = files.findIndex(f => f.id === fileId);
  
  if (fileIndex === -1) {
    return { success: false, error: 'File not found' };
  }
  
  files[fileIndex].downloadCount++;
  files[fileIndex].isDownloaded = true;
  storage.set(STORAGE_KEYS.FILES_DATA, files);
  
  // Add activity
  const activities = getStoredActivities();
  activities.unshift({
    id: `act-${Date.now()}`,
    fileId,
    fileName: files[fileIndex].name,
    action: 'downloaded',
    performedBy: downloaderName,
    performedAt: new Date().toISOString(),
  });
  storage.set(STORAGE_KEYS.ACTIVITY_DATA, activities);
  
  return { success: true, data: files[fileIndex] };
}

/**
 * Get recent file activities
 */
export async function getRecentActivities(limit: number = 10): Promise<ApiResponse<FileActivity[]>> {
  await delay(300);
  
  const activities = getStoredActivities();
  return { success: true, data: activities.slice(0, limit) };
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(staffId: string): Promise<ApiResponse<DashboardStats>> {
  await delay(500);
  
  const files = getStoredFiles();
  const activities = getStoredActivities();
  
  const received = files.filter(f => f.recipientIds.includes(staffId));
  const sent = files.filter(f => f.senderId === staffId);
  const totalStorage = files.reduce((acc, f) => acc + f.size, 0);
  
  return {
    success: true,
    data: {
      totalFiles: files.length,
      totalReceived: received.length,
      totalSent: sent.length,
      storageUsed: totalStorage,
      recentActivity: activities.slice(0, 5),
    },
  };
}
