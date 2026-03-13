import { useEffect, useState } from 'react';
import { getToken, onMessage, getMessaging, Messaging } from 'firebase/messaging';
import { app } from '../lib/firebase';

export const useFCM = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [messaging, setMessaging] = useState<Messaging | null>(null);

  useEffect(() => {
    try {
      const msg = getMessaging(app);
      setMessaging(msg);
    } catch (error) {
      console.warn('Firebase Messaging could not be initialized:', error);
    }
  }, []);

  useEffect(() => {
    if (!messaging) return;

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: 'BM_MtDJbLnNLo_zmgoIlGfPgxrOJFPZHFHIbhUblju8dqO8OsdWkz4LDhbz-P2aH6dY8yJ3D9NRA_ta6RdILYd8'
          });
          if (currentToken) {
            setToken(currentToken);
            console.log('FCM Token:', currentToken);
          }
        }
      } catch (error) {
        console.error('Error requesting permission or getting token:', error);
      }
    };

    requestPermission();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      // Handle foreground message (e.g., show a toast)
    });

    return () => {
      unsubscribe();
    };
  }, [messaging]);

  return { token, permission };
};
