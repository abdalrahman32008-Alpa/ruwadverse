import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  created_at: string;
}

export const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const playNotificationSound = () => {
    // Simple beep using Web Audio API
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
    oscillator.stop(audioCtx.currentTime + 0.5);
  };

  const showBrowserNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo.png' });
    }
  };

  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      } else {
        // Mock data if no backend
        setNotifications([
          { id: '1', type: 'partnership', content: 'طلب شراكة جديد من أحمد علي', read: false, created_at: new Date().toISOString() },
          { id: '2', type: 'system', content: 'مرحباً بك في رواد فيرس!', read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: '3', type: 'smart', content: '💡 نصيحة: أفضل وقت لنشر فكرتك هو يوم الثلاثاء الساعة 10 صباحاً بناءً على نشاط المستثمرين.', read: false, created_at: new Date().toISOString() },
          { id: '4', type: 'smart', content: '🚀 قطاع التقنية المالية يشهد نمواً بنسبة 35% هذا الأسبوع. هل تفكر في تعديل فكرتك لتناسب هذا القطاع؟', read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
        ]);
        setUnreadCount(3);
      }
    };

    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        playNotificationSound();
        showBrowserNotification('إشعار جديد', newNotification.content);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    await supabase.from('notifications').update({ read: true }).eq('user_id', user?.id);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-[#0B0C0E]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-80 bg-[#141517] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#141517]">
              <h3 className="font-bold text-white text-sm">الإشعارات</h3>
              <button onClick={markAllAsRead} className="text-xs text-[#FFD700] hover:underline">تحديد الكل كمقروء</button>
            </div>
            <div className="max-h-80 overflow-y-auto bg-[#141517]">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">لا توجد إشعارات جديدة</div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? 'bg-white/5' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        notification.type === 'partnership' ? 'bg-blue-500/20 text-blue-400' : 
                        notification.type === 'smart' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {notification.type === 'partnership' ? 'شراكة' : 
                         notification.type === 'smart' ? 'تنبيه ذكي' : 'نظام'}
                      </span>
                      <span className="text-[10px] text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{notification.content}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
