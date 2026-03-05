import React, { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  MessageCircle, 
  Share2, 
  ThumbsUp,
  Heart,
  Smile,
  Frown,
  Angry
} from 'lucide-react';
import { MOCK_POSTS } from '../constants';
import { Card, Badge } from '../components/ui';
import { UserProfile, UserProfileData } from '../components/chat/UserProfile';
import { ReactionPicker, ReactionType } from '../components/social/ReactionPicker';
import { ShareSheet } from '../components/social/ShareSheet';
import { CommentSection } from '../components/social/CommentSection';
import { PostInputBar } from '../components/social/PostInputBar';
import { CreatePostModal } from '../components/social/CreatePostModal';
import { ReactionListModal } from '../components/social/ReactionListModal';
import { AnimatePresence, motion } from 'framer-motion';
import { UserRole, REACTION_EMOJIS, Comment } from '../types';

interface FeedProps {
  userRole: UserRole;
}

export default function Feed({ userRole }: FeedProps) {
  const [filter, setFilter] = useState<'all' | 'student' | 'teacher'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(null);
  
  // Interaction States
  const [activeReactionPost, setActiveReactionPost] = useState<number | null>(null);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [postReactions, setPostReactions] = useState<Record<number, ReactionType[]>>({});
  const [userReaction, setUserReaction] = useState<Record<number, ReactionType | null>>({});
  const [activeReactionListPost, setActiveReactionListPost] = useState<number | null>(null);
  
  // Comment State: Map postId to array of comments
  const [postComments, setPostComments] = useState<Record<number, any[]>>({
    1: [
      { id: '101', author: 'Student A', content: 'স্যার, ক্লাসটি কি রেকর্ড করা থাকবে?', timestamp: '১ ঘণ্টা আগে', likes: 2, replies: [] },
      { id: '102', author: 'Teacher B', content: 'হ্যাঁ, ক্লাস শেষে রেকর্ডিং দেওয়া হবে।', timestamp: '৩০ মিনিট আগে', likes: 5, replies: [] }
    ],
    2: [
      { id: '201', author: 'Student C', content: 'ধন্যবাদ স্যার!', timestamp: '১০ মিনিট আগে', likes: 1, replies: [] }
    ]
  });

  // Create Post Modal State
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleProfileClick = (post: any) => {
    const userData: UserProfileData = {
      id: post.authorId || 'unknown',
      name: post.author,
      role: post.authorRole,
      className: post.authorRole === 'student' ? '১০ম শ্রেণী' : undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`,
      mobile: post.authorRole === 'student' ? undefined : '01700000000',
      email: `${post.authorId}@school.edu`
    };
    setSelectedUser(userData);
  };

  const handleReactionSelect = (postId: number, type: ReactionType) => {
    setUserReaction(prev => ({
      ...prev,
      [postId]: type
    }));
    
    // Add to total reactions if not already there (mock logic)
    setPostReactions(prev => {
      const current = prev[postId] || [];
      // In a real app, we'd remove previous reaction and add new one
      return {
        ...prev,
        [postId]: [...current, type] 
      };
    });
    
    setActiveReactionPost(null);
  };

  const handleLikeClick = (postId: number) => {
    if (userReaction[postId]) {
      // Unlike
      setUserReaction(prev => ({ ...prev, [postId]: null }));
    } else {
      // Default Like
      handleReactionSelect(postId, 'Like');
    }
  };

  const handleCreatePost = (content: string, privacy: 'public' | 'friends') => {
    const newPost = {
      id: Date.now(),
      author: 'Current User', // Replace with actual user name
      authorId: 'current_user',
      authorRole: userRole,
      time: 'এইমাত্র',
      content: content,
      likes: 0,
      comments: 0,
      type: 'discussion',
      privacy: privacy
    };
    // @ts-ignore - ignoring strict type check for mock post
    setPosts([newPost, ...posts]);
  };

  const handleAddComment = (postId: number, text: string, parentId?: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: text,
      timestamp: 'এইমাত্র',
      likes: 0,
      replies: []
    };

    setPostComments(prev => {
      const currentComments = prev[postId] || [];
      
      if (parentId) {
        // Handle reply (nested comment) - simplified for 1 level nesting
        return {
          ...prev,
          [postId]: currentComments.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), newComment] };
            }
            return c;
          })
        };
      }

      return {
        ...prev,
        [postId]: [...currentComments, newComment]
      };
    });

    // Update comment count on post
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p
    ));
  };

  const handleShare = (targets: string[], message?: string) => {
    console.log('Sharing to:', targets, 'Message:', message);
    // Implement actual sharing logic here
    alert(`সফলভাবে ${targets.length} জনের সাথে শেয়ার করা হয়েছে!`);
    setShowShareSheet(false);
  };

  const getReactionButtonContent = (postId: number) => {
    const reaction = userReaction[postId];
    if (!reaction) {
      return (
        <>
          <ThumbsUp size={18} />
          <span>লাইক</span>
        </>
      );
    }

    const config = {
      Like: { icon: ThumbsUp, color: 'text-blue-600', label: 'লাইক' },
      Love: { icon: Heart, color: 'text-red-500', label: 'লাভ' },
      Care: { icon: Heart, color: 'text-pink-500', label: 'কেয়ার' }, // Using Heart as fallback
      Haha: { icon: Smile, color: 'text-yellow-500', label: 'হা হা' },
      Wow: { icon: Smile, color: 'text-yellow-500', label: 'ওয়াও' },
      Sad: { icon: Frown, color: 'text-yellow-500', label: 'স্যাড' },
      Angry: { icon: Angry, color: 'text-orange-600', label: 'রাগী' },
    }[reaction];

    const Icon = config.icon;
    
    return (
      <div className={`flex items-center gap-2 ${config.color} font-semibold animate-in zoom-in duration-200`}>
        {['Like', 'Love', 'Care', 'Haha', 'Wow', 'Sad', 'Angry'].includes(reaction) ? (
           <span className="text-lg">{REACTION_EMOJIS[reaction]}</span>
        ) : (
           <Icon size={18} className={config.color} />
        )}
        <span>{config.label}</span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-0">
      {/* Create Post Box */}
      <PostInputBar 
        userRole={userRole}
        onClick={() => setIsCreatePostModalOpen(true)}
      />

      {/* Filter Bar */}
      {['teacher', 'admin', 'moderator'].includes(userRole) && (
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-slate-800">সাম্প্রতিক পোস্ট</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-500 border border-slate-200'}`}
            >
              সব দেখুন
            </button>
            <button 
              onClick={() => setFilter('student')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-500 border border-slate-200'}`}
            >
              স্টুডেন্ট
            </button>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-0 overflow-visible">
            {/* Post Header */}
            <div className="p-4 flex items-start justify-between">
              <div className="flex gap-3 cursor-pointer" onClick={() => handleProfileClick(post)}>
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt={post.author} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm hover:underline">{post.author}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{post.time}</span>
                    <span>•</span>
                    <Badge variant={post.authorRole === 'admin' ? 'default' : 'secondary'} >
                      {post.authorRole === 'admin' ? 'অ্যাডমিন' : post.authorRole === 'teacher' ? 'শিক্ষক' : 'শিক্ষার্থী'}
                    </Badge>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-2">
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-[15px]">
                {post.content}
              </p>
            </div>

            {/* Post Stats */}
            <div className="px-4 py-3 flex items-center justify-between text-xs text-slate-500 border-b border-slate-50">
              <div 
                className="flex items-center gap-1 cursor-pointer hover:underline"
                onClick={() => setActiveReactionListPost(post.id as number)}
              >
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white border border-white">👍</div>
                  {(postReactions[post.id as number]?.some(r => r === 'Love') || userReaction[post.id as number] === 'Love') && (
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white border border-white">❤️</div>
                  )}
                </div>
                <span>
                  {(post.likes || 0) + (postReactions[post.id as number]?.length || 0) + (userReaction[post.id as number] ? 1 : 0)} জন
                </span>
              </div>
              <span 
                className="hover:underline cursor-pointer"
                onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id as number)}
              >
                {post.comments} টি মন্তব্য
              </span>
            </div>

            {/* Actions */}
            <div className="px-2 py-1 flex items-center justify-between relative">
              {/* Reaction Button Container */}
              <div 
                className="flex-1 relative group"
                onMouseLeave={() => setActiveReactionPost(null)}
              >
                <ReactionPicker 
                  isVisible={activeReactionPost === post.id}
                  onSelect={(type) => handleReactionSelect(post.id as number, type)}
                  onClose={() => setActiveReactionPost(null)}
                  position="top"
                />
                <button 
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors text-sm font-medium active:scale-95 ${
                    userReaction[post.id as number] ? '' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                  onMouseEnter={() => setActiveReactionPost(post.id as number)}
                  onTouchStart={(e) => {
                    const timer = setTimeout(() => setActiveReactionPost(post.id as number), 500);
                    e.target.addEventListener('touchend', () => clearTimeout(timer), { once: true });
                  }}
                  onClick={() => handleLikeClick(post.id as number)}
                >
                  {getReactionButtonContent(post.id as number)}
                </button>
              </div>

              <button 
                className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id as number)}
              >
                <MessageCircle size={18} />
                <span>কমেন্ট</span>
              </button>
              
              <button 
                className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setShowShareSheet(true)}
              >
                <Share2 size={18} />
                <span>শেয়ার</span>
              </button>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {expandedComments === post.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100 bg-slate-50/50 px-4 pb-4"
                >
                  <CommentSection 
                    comments={postComments[post.id as number] || []}
                    onAddComment={(text, parentId) => handleAddComment(post.id as number, text, parentId)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* Share Sheet Modal */}
      <ShareSheet 
        isOpen={showShareSheet} 
        onClose={() => setShowShareSheet(false)} 
        onShare={handleShare} 
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
        userRole={userRole}
      />

      {/* Reaction List Modal */}
      {activeReactionListPost !== null && (
        <ReactionListModal
          isOpen={activeReactionListPost !== null}
          onClose={() => setActiveReactionListPost(null)}
          reactions={[
            // Mock reactions for demo
            ...(userReaction[activeReactionListPost] ? [{ user: 'You', type: userReaction[activeReactionListPost]! }] : []),
            ...(postReactions[activeReactionListPost] || []).map((type, i) => ({ user: `User ${i + 1}`, type })),
            // Add some random ones if empty for better demo
            ...((postReactions[activeReactionListPost]?.length || 0) === 0 ? [
              { user: 'Rahim', type: 'Like' as ReactionType },
              { user: 'Karim', type: 'Love' as ReactionType },
              { user: 'Suma', type: 'Haha' as ReactionType }
            ] : [])
          ]}
        />
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfile
          user={selectedUser}
          viewerRole={userRole}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onBlock={() => {
            alert('ব্লক করা হয়েছে');
            setSelectedUser(null);
          }}
          onUnblock={() => {
            alert('আনব্লক করা হয়েছে');
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
