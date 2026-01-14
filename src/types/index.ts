// SmartSender Type Definitions

export interface Staff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  institution: string;
  role: 'staff' | 'admin';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  institution: string;
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  location: string;
}

export type FileType =
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'xls'
  | 'xlsx'
  | 'ppt'
  | 'pptx'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'webp'
  | 'mp4'
  | 'mp3'
  | 'zip';

export type FileCategory = 'document' | 'image' | 'video' | 'audio' | 'archive';

export interface SharedFile {
  id: string;
  name: string;
  type: FileType;
  category: FileCategory;
  size: number; // in bytes
  senderId: string;
  senderName: string;
  recipientIds: string[];
  uploadedAt: string;
  downloadCount: number;
  isDownloaded: boolean;
  description?: string;
  expiresAt?: string;
}

export interface FileActivity {
  id: string;
  fileId: string;
  fileName: string;
  action: 'uploaded' | 'downloaded' | 'viewed' | 'shared';
  performedBy: string;
  performedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  staff: Staff | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalFiles: number;
  totalReceived: number;
  totalSent: number;
  storageUsed: number; // in bytes
  recentActivity: FileActivity[];
}

// Messaging and Chat Types
export type MessageMediaType = 'image' | 'video' | 'document' | 'file';

export interface MessageMedia {
  id: string;
  type: MessageMediaType;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnail?: string; // for images and videos
  duration?: number; // for videos
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  media?: MessageMedia[];
  sentAt: string;
  readAt?: string;
  isEdited: boolean;
  editedAt?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: Staff[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface ConversationListItem extends Omit<Conversation, 'participants'> {
  otherParticipant: Staff; // The other person in the conversation (excluding current user)
  lastMessagePreview: string;
  isOnline?: boolean;
}

