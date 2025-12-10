import { useEffect, useState } from 'react';
import { notificationStore } from '../stores/notificationStore';
import { Notification } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial load
    setNotifications(notificationStore.getNotifications());
    setUnreadCount(notificationStore.getUnreadCount());

    // Subscribe to changes
    const unsubscribe = notificationStore.subscribe(() => {
      setNotifications(notificationStore.getNotifications());
      setUnreadCount(notificationStore.getUnreadCount());
    });

    return unsubscribe;
  }, []);

  const markAsRead = (notificationId: string) => {
    notificationStore.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notificationStore.markAllAsRead();
  };

  const clearAll = () => {
    notificationStore.clearAll();
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};