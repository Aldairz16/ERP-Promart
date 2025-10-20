import { notifications as initialNotifications } from '../data/mockData';
import { Notification } from '../types';

class NotificationStore {
  private notifications: Notification[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Load from localStorage if available, otherwise use initial data
    const stored = localStorage.getItem('erp-notifications');
    if (stored) {
      try {
        this.notifications = JSON.parse(stored);
      } catch {
        this.notifications = [...initialNotifications];
      }
    } else {
      this.notifications = [...initialNotifications];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('erp-notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.warn('Failed to save notifications to localStorage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getNotifications(): Notification[] {
    return [...this.notifications].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    let changed = false;
    this.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        changed = true;
      }
    });
    
    if (changed) {
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  clearAll() {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  addNotification(notification: Omit<Notification, 'id'>) {
    const newNotification: Notification = {
      ...notification,
      id: `NOT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notifyListeners();
  }
}

export const notificationStore = new NotificationStore();