import { Staff } from '@/types';

export const mockStaff: Staff[] = [
  {
    id: 'staff-001',
    email: 'adebayo.johnson@unilag.edu.ng',
    firstName: 'Adebayo',
    lastName: 'Johnson',
    department: 'Computer Science',
    institution: 'University of Lagos',
    role: 'staff',
    createdAt: '2024-01-15T09:00:00Z',
    lastLogin: '2025-01-12T14:30:00Z',
  },
  {
    id: 'staff-002',
    email: 'chioma.okafor@unilag.edu.ng',
    firstName: 'Chioma',
    lastName: 'Okafor',
    department: 'Mathematics',
    institution: 'University of Lagos',
    role: 'staff',
    createdAt: '2024-02-20T10:00:00Z',
    lastLogin: '2025-01-11T09:15:00Z',
  },
  {
    id: 'staff-003',
    email: 'emeka.nwankwo@oauife.edu.ng',
    firstName: 'Emeka',
    lastName: 'Nwankwo',
    department: 'Engineering',
    institution: 'Obafemi Awolowo University',
    role: 'staff',
    createdAt: '2024-03-10T08:00:00Z',
    lastLogin: '2025-01-10T16:45:00Z',
  },
];

// Mock credentials (email -> password mapping)
export const mockCredentials: Record<string, string> = {
  'adebayo.johnson@unilag.edu.ng': 'password123',
  'chioma.okafor@unilag.edu.ng': 'password123',
  'emeka.nwankwo@oauife.edu.ng': 'password123',
  'demo@smartsender.ng': 'demo1234',
};

// Demo account for easy testing
export const demoStaff: Staff = {
  id: 'staff-demo',
  email: 'demo@smartsender.ng',
  firstName: 'Demo',
  lastName: 'User',
  department: 'Administration',
  institution: 'SmartSender Demo',
  role: 'staff',
  createdAt: '2025-01-01T00:00:00Z',
  lastLogin: new Date().toISOString(),
};
