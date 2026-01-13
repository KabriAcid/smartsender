import { ApiResponse, LoginCredentials, Staff } from '@/types';
import { mockStaff, mockCredentials, demoStaff } from '@/mockdata';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Simulate network delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Login staff member
 */
export async function loginStaff(credentials: LoginCredentials): Promise<ApiResponse<{ staff: Staff; token: string }>> {
  await delay(800); // Simulate network latency
  
  const { email, password } = credentials;
  
  // Check credentials
  if (mockCredentials[email] !== password) {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }
  
  // Find staff or use demo account
  let staff = mockStaff.find(s => s.email === email);
  if (email === 'demo@smartsender.ng') {
    staff = { ...demoStaff, lastLogin: new Date().toISOString() };
  }
  
  if (!staff) {
    return {
      success: false,
      error: 'Staff account not found',
    };
  }
  
  // Generate mock token
  const token = `ss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store in localStorage
  storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  storage.set(STORAGE_KEYS.STAFF_DATA, staff);
  
  return {
    success: true,
    data: { staff, token },
  };
}

/**
 * Logout staff member
 */
export async function logoutStaff(): Promise<ApiResponse<null>> {
  await delay(300);
  
  storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  storage.remove(STORAGE_KEYS.STAFF_DATA);
  
  return { success: true };
}

/**
 * Get current authenticated staff
 */
export async function getCurrentStaff(): Promise<ApiResponse<Staff>> {
  await delay(200);
  
  const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  const staff = storage.get<Staff>(STORAGE_KEYS.STAFF_DATA);
  
  if (!token || !staff) {
    return {
      success: false,
      error: 'Not authenticated',
    };
  }
  
  return {
    success: true,
    data: staff,
  };
}

/**
 * Verify token validity
 */
export async function verifyToken(): Promise<boolean> {
  const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
}
