import React, { useState, useEffect } from 'react';
import { Bell, Check, MessageSquare, Heart, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Notification } from '../types/social';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useLanguage } from '../contexts/LanguageContext';

export const NotificationCenter = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*, actor:profiles(full_name, avatar_url)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
  };

  return (
    <div className="w-80 bg-[#141517] border border-white/10 rounded-2xl shadow-2xl p-4">
      <h3 className="text-sm font-bold text-white mb-4">الإشعارات</h3>
      <div className="space-y-4">
        {notifications.map((n) => (
          <div key={n.id} className="flex gap-3 text-xs">
            <img src={n.actor?.avatar_url || ''} className="w-8 h-8 rounded-lg" alt="" />
            <div>
              <p className="text-white">
                <span className="font-bold">{n.actor?.full_name}</span> 
                {n.type === 'reaction' ? ' تفاعل مع منشورك' : ' علق على منشورك'}
              </p>
              <p className="text-gray-500">{formatDistanceToNow(new Date(n.created_at), { locale: language === 'ar' ? ar : undefined })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
