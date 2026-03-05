import { 
  Home, 
  Users, 
  BarChart2, 
  CreditCard, 
  Menu, 
  Bell, 
  LogOut, 
  Shield, 
  BookOpen,
  MessageCircle,
  Search,
  FileText,
  User
} from 'lucide-react';
import type { UserRole } from './types';

export type { UserRole };

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'feed', label: 'হোম', icon: Home, roles: ['student', 'teacher', 'guardian', 'moderator', 'admin', 'cashier', 'management'] },
  { id: 'class', label: 'আমার ক্লাস', icon: Users, roles: ['student', 'teacher'] },
  { id: 'messages', label: 'মেসেজ', icon: MessageCircle, roles: ['student', 'teacher', 'moderator', 'admin', 'management'] },
  { id: 'progress', label: 'প্রগ্রেস', icon: BarChart2, roles: ['student', 'guardian', 'teacher', 'moderator', 'admin'] },
  { id: 'profile', label: 'প্রোফাইল', icon: User, roles: ['student', 'teacher', 'guardian', 'moderator', 'admin', 'cashier', 'management'] },
];

export const MOCK_POSTS = [
  {
    id: 1,
    author: 'প্রজ্ঞা একাডেমিক কেয়ার',
    authorId: 'admin',
    authorRole: 'admin',
    time: '২ ঘণ্টা আগে',
    content: 'আগামীকাল দশম শ্রেণীর পদার্থবিজ্ঞান ক্লাসটি বিকাল ৪টার পরিবর্তে ৫টায় অনুষ্ঠিত হবে। সকলকে যথাসময়ে উপস্থিত থাকার জন্য অনুরোধ করা হলো।',
    likes: 45,
    comments: 12,
    type: 'notice'
  },
  {
    id: 2,
    author: 'রাফসান আহমেদ',
    authorId: 'teacher1',
    authorRole: 'teacher',
    time: '৫ ঘণ্টা আগে',
    content: 'জীববিজ্ঞান অধ্যায়-৫ এর নোটস আপলোড করা হয়েছে। ক্লাস গ্রুপ থেকে সবাই পিডিএফটি ডাউনলোড করে নিবে।',
    likes: 32,
    comments: 5,
    type: 'resource'
  },
  {
    id: 3,
    author: 'সাদিয়া ইসলাম',
    authorId: 'student1',
    authorRole: 'student',
    time: '১ দিন আগে',
    content: 'গণিত ক্লাসের বাড়ির কাজ কি কেউ শেয়ার করতে পারবে?',
    likes: 8,
    comments: 15,
    type: 'discussion'
  }
];
