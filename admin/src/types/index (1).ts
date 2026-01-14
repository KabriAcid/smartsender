// Types for SmartSender Admin Dashboard

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: 'staff' | 'admin';
  status: 'active' | 'inactive';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  filesShared: number;
  storageUsed: number;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  staffCount: number;
  storageUsed: number;
  createdAt: string;
}

export interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploaderId: string;
  uploaderName: string;
  recipientIds: string[];
  recipientNames: string[];
  downloadCount: number;
  createdAt: string;
  expiresAt?: string;
}

export interface AdminStats {
  totalStaff: number;
  activeUsers: number;
  totalFiles: number;
  storageUsed: number;
  storageQuota: number;
  pendingApprovals: number;
}

export interface ActivityLog {
  id: string;
  action: 'login' | 'logout' | 'upload' | 'download' | 'delete' | 'create' | 'update';
  entityType: 'staff' | 'file' | 'department' | 'system';
  entityId: string;
  entityName: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

export interface AnalyticsData {
  uploadsOverTime: ChartDataPoint[];
  storageByDepartment: ChartDataPoint[];
  activeUsersTrend: ChartDataPoint[];
  fileTypeDistribution: ChartDataPoint[];
}

export interface StaffFilters {
  search: string;
  department: string | null;
  role: 'all' | 'staff' | 'admin';
  status: 'all' | 'active' | 'inactive';
}

export interface FileFilters {
  search: string;
  dateFrom: string | null;
  dateTo: string | null;
  fileType: string | null;
  uploaderId: string | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface CreateStaffDTO {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: 'staff' | 'admin';
  password?: string;
}

export interface UpdateStaffDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  role?: 'staff' | 'admin';
  status?: 'active' | 'inactive';
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin';
  avatar?: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
