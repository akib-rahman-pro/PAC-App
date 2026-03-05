
export type UserRole = 'student' | 'teacher' | 'guardian' | 'moderator' | 'cashier' | 'admin' | 'management';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  className?: string; // For students
  mobile?: string;
  email?: string;
}

export type ReactionType = 'Like' | 'Love' | 'Care' | 'Haha' | 'Wow' | 'Sad' | 'Angry';

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  Like: '👍',
  Love: '❤️',
  Care: '🥰',
  Haha: '😂',
  Wow: '😮',
  Sad: '😢',
  Angry: '😡'
};

export interface Reaction {
  userId: string;
  userName: string;
  type: ReactionType;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  replies: Comment[];
}

export interface Post {
  id: number | string;
  author: string;
  authorId: string;
  authorRole: UserRole;
  authorAvatar?: string;
  time: string;
  content: string;
  likes: number; // Legacy count, can be derived from reactions
  reactions: Reaction[];
  comments: number; // Legacy count
  commentList?: Comment[]; // Actual comments
  type: 'notice' | 'resource' | 'discussion';
  images?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  reactions?: { [emoji: string]: number }; // Simplified for chat
  isMe: boolean;
}
