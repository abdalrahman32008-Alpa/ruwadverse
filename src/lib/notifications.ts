import { supabase } from './supabase';

export type NotificationType = 'interest' | 'message' | 'contract' | 'system';

export async function sendNotification(userId: string, title: string, content: string, type: NotificationType) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        title,
        content,
        type,
        read: false
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}
