import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Star, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  content: string;
  timestamp: Date;
  isRead: boolean;
  actor?: {
    name: string;
    avatar: string;
  };
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    content: 'أعجب أحمد محمد بمنشورك "فكرة منصة تعليمية"',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isRead: false,
    actor: { name: 'أحمد محمد', avatar: 'https://i.pravatar.cc/150?u=1' }
  },
  {
    id: '2',
    type: 'comment',
    content: 'علقت سارة علي على مشروعك: "فكرة ممتازة! هل فكرت في..."',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isRead: false,
    actor: { name: 'سارة علي', avatar: 'https://i.pravatar.cc/150?u=2' }
  },
  {
    id: '3',
    type: 'follow',
    content: 'بدأ خالد عمر بمتابعتك',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: true,
    actor: { name: 'خالد عمر', avatar: 'https://i.pravatar.cc/150?u=3' }
  },
  {
    id: '4',
    type: 'system',
    content: 'مرحباً بك في ruwadverse! أكمل ملفك الشخصي لزيادة فرصك.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true
  }
];

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={20} className="text-red-500" fill="currentColor" />;
      case 'comment': return <MessageCircle size={20} className="text-blue-500" />;
      case 'follow': return <UserPlus size={20} className="text-green-500" />;
      case 'system': return <Star size={20} className="text-[#FFD700]" />;
      default: return <Bell size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          الإشعارات
          {notifications.some(n => !n.isRead) && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {notifications.filter(n => !n.isRead).length} جديد
            </span>
          )}
        </h1>
        <button 
          onClick={handleMarkAllAsRead}
          className="text-sm text-[#FFD700] hover:underline"
        >
          تحديد الكل كمقروء
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Bell size={48} className="mx-auto mb-4 opacity-20" />
              <p>لا توجد إشعارات حالياً</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-2xl border transition-colors flex gap-4 items-start group ${
                  notification.isRead 
                    ? 'bg-[#141517] border-white/5' 
                    : 'bg-[#1C1D20] border-[#FFD700]/20'
                }`}
              >
                <div className="mt-1 p-2 bg-white/5 rounded-full shrink-0">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm mb-1 ${notification.isRead ? 'text-gray-300' : 'text-white font-medium'}`}>
                      {notification.content}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap mr-2">
                      {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    {!notification.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-[#FFD700] hover:underline flex items-center gap-1"
                      >
                        <Check size={12} /> تحديد كمقروء
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(notification.id)}
                      className="text-xs text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <Trash2 size={12} /> حذف
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
