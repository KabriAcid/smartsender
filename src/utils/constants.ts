// SmartSender Constants

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'smartsender_token',
  STAFF_DATA: 'smartsender_staff',
  FILES_DATA: 'smartsender_files',
  ACTIVITY_DATA: 'smartsender_activity',
} as const;

export const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  ppt: '📽️',
  pptx: '📽️',
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
  webp: '🖼️',
  mp4: '🎬',
  mp3: '🎵',
  zip: '📦',
};

export const FILE_CATEGORIES: Record<string, string[]> = {
  document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
  image: ['jpg', 'jpeg', 'png', 'webp'],
  video: ['mp4'],
  audio: ['mp3'],
  archive: ['zip'],
};

export const ALLOWED_FILE_TYPES = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.jpg', '.jpeg', '.png', '.webp',
  '.mp4', '.mp3', '.zip'
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FILES: '/files',
  PROFILE: '/profile',
} as const;
