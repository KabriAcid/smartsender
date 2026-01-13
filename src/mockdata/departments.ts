import { Department, Institution } from '@/types';

export const mockInstitutions: Institution[] = [
  {
    id: 'inst-001',
    name: 'University of Lagos',
    shortName: 'UNILAG',
    location: 'Lagos, Nigeria',
  },
  {
    id: 'inst-002',
    name: 'Obafemi Awolowo University',
    shortName: 'OAU',
    location: 'Ile-Ife, Osun State',
  },
  {
    id: 'inst-003',
    name: 'University of Ibadan',
    shortName: 'UI',
    location: 'Ibadan, Oyo State',
  },
  {
    id: 'inst-004',
    name: 'Ahmadu Bello University',
    shortName: 'ABU',
    location: 'Zaria, Kaduna State',
  },
];

export const mockDepartments: Department[] = [
  {
    id: 'dept-001',
    name: 'Computer Science',
    code: 'CSC',
    institution: 'University of Lagos',
  },
  {
    id: 'dept-002',
    name: 'Mathematics',
    code: 'MTH',
    institution: 'University of Lagos',
  },
  {
    id: 'dept-003',
    name: 'Engineering',
    code: 'ENG',
    institution: 'Obafemi Awolowo University',
  },
  {
    id: 'dept-004',
    name: 'Physics',
    code: 'PHY',
    institution: 'University of Ibadan',
  },
  {
    id: 'dept-005',
    name: 'Administration',
    code: 'ADM',
    institution: 'SmartSender Demo',
  },
];
