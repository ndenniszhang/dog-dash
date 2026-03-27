/**
 * Zustand client-side stores.
 * Feature hooks are the ONLY consumers — never import directly in components.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserRole, WalkerWithUser, Walk } from '@/types';

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  setUser: (user: User | null) => void;
  setLoaded: (loaded: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoaded: false,
  setUser: (user) => set({ user }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  reset: () => set({ user: null, isLoaded: false }),
}));

// ─── Onboarding Store ─────────────────────────────────────────────────────────

interface OwnerOnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notificationPrefs: {
    walkRequests: boolean;
    walkUpdates: boolean;
    payments: boolean;
    marketing: boolean;
  };
  paymentMethodId?: string;
  paymentLast4?: string;
}

interface WalkerOnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  serviceRadius: number;
  backgroundCheckSubmitted: boolean;
  pricing: Record<string, number>;
  availability: Record<string, boolean>;
  payoutAccountId?: string;
  trainingAcknowledged: boolean;
}

interface OnboardingState {
  role: UserRole | null;
  ownerData: Partial<OwnerOnboardingData>;
  walkerData: Partial<WalkerOnboardingData>;
  setRole: (role: UserRole) => void;
  patchOwner: (data: Partial<OwnerOnboardingData>) => void;
  patchWalker: (data: Partial<WalkerOnboardingData>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      role: null,
      ownerData: {},
      walkerData: {},
      setRole: (role) => set({ role }),
      patchOwner: (data) =>
        set((s) => ({ ownerData: { ...s.ownerData, ...data } })),
      patchWalker: (data) =>
        set((s) => ({ walkerData: { ...s.walkerData, ...data } })),
      reset: () => set({ role: null, ownerData: {}, walkerData: {} }),
    }),
    {
      name: 'dog-dash-onboarding',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

// ─── Booking Store ────────────────────────────────────────────────────────────

interface BookingState {
  selectedWalker: WalkerWithUser | null;
  activeWalk: Walk | null;
  setSelectedWalker: (walker: WalkerWithUser | null) => void;
  setActiveWalk: (walk: Walk | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedWalker: null,
  activeWalk: null,
  setSelectedWalker: (selectedWalker) => set({ selectedWalker }),
  setActiveWalk: (activeWalk) => set({ activeWalk }),
}));

// ─── Notification Store ───────────────────────────────────────────────────────

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  clearUnread: () => set({ unreadCount: 0 }),
}));
