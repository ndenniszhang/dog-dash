/**
 * Firebase Cloud Messaging stub.
 * Adds notifications to the in-memory notification store.
 * Replace with: Firebase Admin SDK in a Cloudflare Worker / Next.js API route.
 */

import type { NotificationType } from '@/types';

const log = (method: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[fcm stub] ${method}`, ...args);
  }
};

export interface PushPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}

// In-browser event bus for simulating push delivery within the same session
type PushListener = (payload: PushPayload) => void;
const listeners = new Map<string, PushListener[]>();

/** Register a listener for push notifications (replaces FCM token registration) */
export function onPushReceived(userId: string, cb: PushListener): () => void {
  const existing = listeners.get(userId) ?? [];
  listeners.set(userId, [...existing, cb]);
  return () => {
    const remaining = (listeners.get(userId) ?? []).filter((l) => l !== cb);
    listeners.set(userId, remaining);
  };
}

/** Send a push notification (stub: fires local listener synchronously) */
export async function sendPush(payload: PushPayload): Promise<void> {
  log('sendPush', payload);
  const userListeners = listeners.get(payload.userId) ?? [];
  userListeners.forEach((cb) => cb(payload));
}

/** Subscribe a device token (no-op stub) */
export async function subscribeToken(userId: string, token: string): Promise<void> {
  log('subscribeToken', userId, token.slice(0, 8) + '...');
}

/** Unsubscribe a device token (no-op stub) */
export async function unsubscribeToken(userId: string, token: string): Promise<void> {
  log('unsubscribeToken', userId, token.slice(0, 8) + '...');
}
