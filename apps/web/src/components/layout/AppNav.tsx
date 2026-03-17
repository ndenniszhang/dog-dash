'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationStore } from '@/lib/store';
import { useEffect } from 'react';
import { notificationService } from '@/services/notification.service';

export function AppNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, onboardingComplete, isSignedIn, isLoaded } = useAuth();
  const { unreadCount, setUnreadCount } = useNotificationStore();

  // Redirect to home if signed out and not on root
  useEffect(() => {
    if (isLoaded && !isSignedIn && pathname !== '/') {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  // Load unread count
  useEffect(() => {
    if (!user) return;
    notificationService.getUnreadCount(user.id).then(setUnreadCount);
    const unsub = notificationService.subscribe(user.id, () => {
      notificationService.getUnreadCount(user.id).then(setUnreadCount);
    });
    return unsub;
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = (href: string) =>
    pathname === href ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900';

  const showNav = onboardingComplete && role;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
          🐾 Dog Dash
        </Link>

        {/* Navigation links */}
        <SignedIn>
          {showNav && (
            <nav className="flex items-center gap-6 text-sm">
              {role === 'owner' && (
                <>
                  <Link href="/dashboard/owner" className={isActive('/dashboard/owner')}>
                    Find Walkers
                  </Link>
                  <Link href="/bookings" className={isActive('/bookings')}>
                    My Bookings
                  </Link>
                </>
              )}
              {role === 'walker' && (
                <>
                  <Link href="/dashboard/walker" className={isActive('/dashboard/walker')}>
                    Dashboard
                  </Link>
                  <Link href="/bookings" className={isActive('/bookings')}>
                    My Walks
                  </Link>
                </>
              )}
              <Link href="/notifications" className={`relative ${isActive('/notifications')}`}>
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </nav>
          )}
        </SignedIn>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
