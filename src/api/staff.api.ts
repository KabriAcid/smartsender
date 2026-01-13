import { ApiResponse, Staff } from '@/types';
import { mockStaff } from '@/mockdata';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all staff members (for recipient selection)
 */
export async function getAllStaff(): Promise<ApiResponse<Staff[]>> {
  await delay(400);
  return { success: true, data: mockStaff };
}

/**
 * Get staff by ID
 */
export async function getStaffById(staffId: string): Promise<ApiResponse<Staff>> {
  await delay(300);
  
  const staff = mockStaff.find(s => s.id === staffId);
  
  if (!staff) {
    return { success: false, error: 'Staff not found' };
  }
  
  return { success: true, data: staff };
}

/**
 * Get staff by department
 */
export async function getStaffByDepartment(department: string): Promise<ApiResponse<Staff[]>> {
  await delay(400);
  
  const staff = mockStaff.filter(s => s.department === department);
  return { success: true, data: staff };
}

/**
 * Search staff by name or email
 */
export async function searchStaff(query: string): Promise<ApiResponse<Staff[]>> {
  await delay(300);
  
  const lowercaseQuery = query.toLowerCase();
  const results = mockStaff.filter(
    s =>
      s.firstName.toLowerCase().includes(lowercaseQuery) ||
      s.lastName.toLowerCase().includes(lowercaseQuery) ||
      s.email.toLowerCase().includes(lowercaseQuery)
  );
  
  return { success: true, data: results };
}
