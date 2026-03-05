import { UserRole } from '../constants';

export interface UserData {
  uid: string;
  name: string;
  phone: string;
  role: UserRole | 'admin' | 'management';
  status: 'pending' | 'approved' | 'rejected';
  passwordHash?: string;
  submissionDate?: string;
  
  // Student specific
  schoolName?: string;
  classGrade?: string;
  schoolRoll?: string;
  
  // Guardian specific
  linkedCoachingRoll?: string;

  // Admin specific
  securityKey?: string;
}

// Initial Mock Data
export const MOCK_USERS: UserData[] = [
  {
    uid: 'u1',
    name: 'করিম রহমান',
    phone: '01711000001',
    role: 'student',
    status: 'pending',
    submissionDate: '2024-03-01',
    schoolName: 'ঢাকা কলেজ',
    classGrade: 'দ্বাদশ',
    schoolRoll: '১২০৫',
    passwordHash: 'hashed_123456_secure'
  },
  {
    uid: 'u2',
    name: 'রহিমা বেগম',
    phone: '01811000002',
    role: 'guardian',
    status: 'pending',
    submissionDate: '2024-03-02',
    linkedCoachingRoll: 'PAC-2024-1001',
    passwordHash: 'hashed_123456_secure'
  },
  {
    uid: 'u3',
    name: 'আব্দুল জব্বার',
    phone: '01911000003',
    role: 'management',
    status: 'pending',
    submissionDate: '2024-03-03',
    passwordHash: 'hashed_123456_secure'
  },
  {
    uid: 'm1',
    name: 'মডারেটর ১',
    phone: '01500000001',
    role: 'moderator',
    status: 'approved',
    passwordHash: 'hashed_123456_secure'
  },
  {
    uid: 'admin-001',
    name: 'Akib Rahman',
    phone: '01913500250',
    role: 'admin',
    status: 'approved',
    passwordHash: 'hashed_123456_secure',
    securityKey: 'SYSTEM_KEY_INIT'
  }
];
