import { UserRole } from '../constants';

// --- 1. Screen & Content Security Logic ---

/**
 * Determines if the screen should be secured (prevention of screenshots/recording).
 * In a native app, this would call `FlutterWindowManager.addFlags(FlutterWindowManager.FLAG_SECURE)`.
 */
export const shouldEnableScreenSecurity = (role: UserRole): boolean => {
  // Allowed roles (can screenshot): Admin, Moderator
  const allowedRoles: UserRole[] = ['admin', 'moderator'];
  
  // If role is NOT in allowed list, enable security
  return !allowedRoles.includes(role);
};

// --- 2. Encrypted In-App PDF Viewer Logic ---

interface SecureFile {
  id: string;
  fileName: string;
  encryptedPath: string; // Internal storage path
  downloadedAt: Date;
}

/**
 * Simulates downloading a file to internal encrypted storage.
 * In a real app, this would use `path_provider` and AES encryption.
 */
export const downloadSecurePDF = async (url: string, fileName: string): Promise<SecureFile> => {
  console.log(`Downloading ${fileName} from ${url}...`);
  console.log('Encrypting file content with AES-256...');
  console.log('Saving to Application Documents Directory (Hidden from Gallery)...');
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    fileName,
    encryptedPath: `internal://secure_storage/${fileName}.enc`,
    downloadedAt: new Date()
  };
};

// --- 3. Moderator's Monitoring (Spy Mode) Logic ---

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'private' | 'group';
  groupName?: string;
}

/**
 * Fetches read-only chat history for a specific student.
 * This mocks a backend query like: `db.collection('chats').where('participants', 'array-contains', studentId)`
 */
export const getStudentChatHistory = (studentId: string): ChatMessage[] => {
  // Mock data
  return [
    {
      id: 'm1',
      senderId: studentId,
      senderName: 'Target Student',
      content: 'স্যার, আগামীকালের পরীক্ষার সিলেবাসটা কি একটু বলবেন?',
      timestamp: '১০ মিনিট আগে',
      type: 'group',
      groupName: 'দশম শ্রেণী - পদার্থবিজ্ঞান'
    },
    {
      id: 'm2',
      senderId: 't1',
      senderName: 'রাফসান আহমেদ (Teacher)',
      content: 'অধ্যায় ৫ এবং ৬। ভালো করে পড়ে আসবে।',
      timestamp: '৮ মিনিট আগে',
      type: 'group',
      groupName: 'দশম শ্রেণী - পদার্থবিজ্ঞান'
    },
    {
      id: 'm3',
      senderId: 's2',
      senderName: 'সাদিয়া ইসলাম (Friend)',
      content: 'দোস্ত, তুই কি ম্যাথ নোটসটা করেছিস?',
      timestamp: '৫ মিনিট আগে',
      type: 'private'
    },
    {
      id: 'm4',
      senderId: studentId,
      senderName: 'Target Student',
      content: 'হ্যাঁ, ছবি তুলে পাঠাচ্ছি।',
      timestamp: '২ মিনিট আগে',
      type: 'private'
    }
  ];
};

// --- 4. Push Notification & Real-time Alerts ---

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'global' | 'class' | 'academic';
  timestamp: Date;
}

export const generateNotification = (type: 'post_global' | 'post_class' | 'marks_update' | 'attendance_absent'): Notification => {
  switch (type) {
    case 'post_global':
      return {
        id: 'n1',
        title: 'নতুন নোটিশ',
        body: 'অ্যাডমিন প্যানেল থেকে একটি নতুন ঘোষণা দেওয়া হয়েছে।',
        type: 'global',
        timestamp: new Date()
      };
    case 'post_class':
      return {
        id: 'n2',
        title: 'ক্লাস আপডেট',
        body: 'আপনার পদার্থবিজ্ঞান গ্রুপে নতুন লেকচার শিট আপলোড করা হয়েছে।',
        type: 'class',
        timestamp: new Date()
      };
    case 'marks_update':
      return {
        id: 'n3',
        title: 'ফলাফল প্রকাশ',
        body: 'আপনার সন্তানের গণিত পরীক্ষার ফলাফল প্রকাশ করা হয়েছে।',
        type: 'academic',
        timestamp: new Date()
      };
    case 'attendance_absent':
      return {
        id: 'n4',
        title: 'উপস্থিতি অ্যালার্ট',
        body: 'আপনার সন্তান আজ ক্লাসে অনুপস্থিত ছিল।',
        type: 'academic',
        timestamp: new Date()
      };
  }
};

// --- 5. Progress Graph Logic ---

export interface AcademicRecord {
  subject: string;
  marks: number;
  totalMarks: number;
  date: string;
  attendanceStatus?: 'present' | 'absent';
}

export const calculateProgress = (records: AcademicRecord[]) => {
  // 1. Calculate Attendance Percentage
  const attendanceRecords = records.filter(r => r.attendanceStatus);
  const presentCount = attendanceRecords.filter(r => r.attendanceStatus === 'present').length;
  const attendancePercentage = attendanceRecords.length > 0 
    ? (presentCount / attendanceRecords.length) * 100 
    : 0;

  // 2. Format Exam Trends for Graph
  const examTrends = records
    .filter(r => !r.attendanceStatus) // Filter out attendance records
    .map(r => ({
      subject: r.subject,
      percentage: (r.marks / r.totalMarks) * 100,
      date: r.date
    }));

  return {
    attendance: {
      total: attendanceRecords.length,
      present: presentCount,
      percentage: attendancePercentage.toFixed(1)
    },
    examTrends
  };
};

// Mock Data for Graphs
export const MOCK_ACADEMIC_RECORDS: AcademicRecord[] = [
  { subject: 'Math', marks: 85, totalMarks: 100, date: '2024-01-10' },
  { subject: 'Physics', marks: 78, totalMarks: 100, date: '2024-01-12' },
  { subject: 'Chemistry', marks: 92, totalMarks: 100, date: '2024-01-15' },
  { subject: 'Biology', marks: 88, totalMarks: 100, date: '2024-01-20' },
  { subject: 'Math', marks: 90, totalMarks: 100, date: '2024-02-10' }, // Trend data
  { subject: 'Physics', marks: 82, totalMarks: 100, date: '2024-02-12' },
  { subject: 'Chemistry', marks: 95, totalMarks: 100, date: '2024-02-15' },
  
  // Attendance
  { subject: 'Attendance', marks: 0, totalMarks: 0, date: '2024-01-01', attendanceStatus: 'present' },
  { subject: 'Attendance', marks: 0, totalMarks: 0, date: '2024-01-02', attendanceStatus: 'present' },
  { subject: 'Attendance', marks: 0, totalMarks: 0, date: '2024-01-03', attendanceStatus: 'absent' },
  { subject: 'Attendance', marks: 0, totalMarks: 0, date: '2024-01-04', attendanceStatus: 'present' },
];
