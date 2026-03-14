'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationStore } from '@/lib/store';
import { notificationService } from '@/services/notification.service';
import type { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const TYPE_ICONS: Record<string, string> = {
  walk_request: '📋',
  walk_confirmed: '✓',
  walk_started: '🐾',
  walk_completed: '✅',
  walk_cancelled: '✕',
  payment: '💳',
  review: '⭐',
  system: '🔔',
};

function NotifRow({ notif, onMarkRead }: { notif: Notification; onMarkRead: (id: string) => void }) {
  return (
    <div
      className={`flex gap-4 p-4 rounded-xl border transition-colors cursor-pointer hover:bg-gray-50 ${
        notif.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
      }`}
      onClick={() => { if (!notif.read) onMarkRead(notif.id); }}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
        notif.read ? 'bg-gray-100' : 'bg-blue-100'
      }`}>
        {TYPE_ICONS[notif.type] ?? '🔔'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className={`font-medium text-sm ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
            {notif.title}
          </div>
          {!notif.read && (
            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{notif.body}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const { setUnreadCount, clearUnread } = useNotificationStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifs = async () => {
    if (!user) return;
    const notifs = await notificationService.getByUserId(user.id);
    setNotifications(notifs);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifs();
    // Subscribe to new notifications
    if (!user) return;
    const unsub = notificationService.subscribe(user.id, () => loadNotifs());
    return unsub;
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkRead = async (id: string) => {
    await notificationService.markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    const count = notifications.filter((n) => !n.read && n.id !== id).length;
    setUnreadCount(count);
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await notificationService.markAllRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    clearUnread();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔔</div>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotifRow key={n.id} notif={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
}
