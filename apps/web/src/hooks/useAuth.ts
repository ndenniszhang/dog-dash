'use client';

/**
 * useAuth — authentication state and actions.
 * Only hook that touches Clerk SDK. Components never import Clerk directly.
 */

import { useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useAuthStore } from '@/lib/store';
import { userService } from '@/services/user.service';
import type { UserRole } from '@/types';

export function useAuth() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();
  const { user, isLoaded, setUser, setLoaded } = useAuthStore();

  // Sync Clerk user → our DB user on load
  useEffect(() => {
    if (!clerkLoaded) return;
    setLoaded(false);

    if (!clerkUser) {
      setUser(null);
      setLoaded(true);
      return;
    }

    userService
      .upsert({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
        firstName: clerkUser.firstName ?? '',
        lastName: clerkUser.lastName ?? '',
        imageUrl: clerkUser.imageUrl,
      })
      .then((dbUser) => {
        setUser(dbUser);
        setLoaded(true);
      });
  }, [clerkLoaded, clerkUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const setRole = async (role: UserRole) => {
    if (!clerkUser) return;
    const updated = await userService.setRole(clerkUser.id, role);
    if (updated) setUser(updated);
  };

  const completeOnboarding = async () => {
    if (!clerkUser) return;
    const updated = await userService.completeOnboarding(clerkUser.id);
    if (updated) setUser(updated);
  };

  const handleSignOut = async () => {
    await signOut();
    useAuthStore.getState().reset();
  };

  return {
    /** Hydrated DB user (null if not signed in) */
    user,
    /** True once Clerk + DB sync completes */
    isLoaded,
    isSignedIn: !!clerkUser,
    role: user?.role ?? null,
    onboardingComplete: user?.onboardingComplete ?? false,
    setRole,
    completeOnboarding,
    signOut: handleSignOut,
  };
}
