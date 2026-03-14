/**
 * Notification service.
 * In-memory stub. Replace internals with Supabase calls + FCM for push delivery.
 */

import type { Notification, NotificationType } from '@/types';
import { sendPush } from '@/lib/fcm.stub';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedNotifications: Notification[] = [
  {
    id: 'notif_001',
    userId: 'user_owner_alice',
    type: 'walk_confirmed',
    title: 'Walk Confirmed!',
    body: 'Bob Martinez confirmed your walk for tomorrow at 9:00 AM.',
    data: { walkId: 'walk_003' },
    read: false,
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    id: 'notif_002',
    userId: 'user_owner_alice',
    type: 'payment',
    title: 'Payment Processed',
    body: 'Your payment of $45.00 for Buddy\'s walk was successful.',
    data: { walkId: 'walk_001' },
    read: false,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: 'notif_003',
    userId: 'user_owner_alice',
    type: 'walk_completed',
    title: 'Walk Complete',
    body: 'Luna\'s 30-minute walk with Sara Chen is done. Leave a review!',
    data: { walkId: 'walk_002' },
    read: true,
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
  },
  {
    id: 'notif_004',
    userId: 'user_walker_bob',
    type: 'walk_request',
    title: 'New Walk Request',
    body: 'Alice Johnson wants to book a 60-minute walk for Luna.',
    data: { walkId: 'walk_003' },
    read: false,
    createdAt: new Date(Date.now() - 3_700_000).toISOString(),
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const store = new Map<string, Notification>(
  seedNotifications.map((n) => [n.id, n]),
);

// Listeners for real-time notification delivery
type NotifListener = (n: Notification) => void;
const listeners = new Map<string, NotifListener[]>();

function now() { return new Date().toISOString(); }
function newId() { return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

// ─── Service ──────────────────────────────────────────────────────────────────

export const notificationService = {
  async getByUserId(userId: string): Promise<Notification[]> {
    return Array.from(store.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getUnreadCount(userId: string): Promise<number> {
    let count = 0;
    for (const n of store.values()) {
      if (n.userId === userId && !n.read) count++;
    }
    return count;
  },

  async markRead(id: string): Promise<void> {
    const n = store.get(id);
    if (n) store.set(id, { ...n, read: true });
  },

  async markAllRead(userId: string): Promise<void> {
    for (const [id, n] of store.entries()) {
      if (n.userId === userId && !n.read) {
        store.set(id, { ...n, read: true });
      }
    }
  },

  async add(data: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<Notification> {
    const notif: Notification = {
      id: newId(),
      userId: data.userId,
      type: data.type,
      title: data.title,
      body: data.body,
      data: data.data ?? {},
      read: false,
      createdAt: now(),
    };
    store.set(notif.id, notif);

    // Fire in-app listener
    (listeners.get(data.userId) ?? []).forEach((cb) => cb(notif));

    // Also fire stub FCM push
    await sendPush({ userId: data.userId, type: data.type, title: data.title, body: data.body, data: data.data });

    return notif;
  },

  /** Subscribe to real-time notifications for a user */
  subscribe(userId: string, cb: NotifListener): () => void {
    const existing = listeners.get(userId) ?? [];
    listeners.set(userId, [...existing, cb]);
    return () => {
      const remaining = (listeners.get(userId) ?? []).filter((l) => l !== cb);
      listeners.set(userId, remaining);
    };
  },
};
