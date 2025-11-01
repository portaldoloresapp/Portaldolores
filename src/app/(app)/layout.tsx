'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import BottomNav from '@/components/layout/bottom-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
        router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || (!user && pathname !== '/login' && pathname !== '/signup')) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // This is a simple role-based routing example.
  // You can expand this to handle more complex scenarios.
  if (user?.profile) {
    const role = user.profile.role;
    if (role === 'teacher' && pathname.startsWith('/student')) {
      // Redirect teacher from student pages
      // router.push('/teacher/dashboard');
    } else if (role === 'student' && !pathname.startsWith('/student')) {
        // Uncomment below to enforce student routing
        // if(pathname !== '/dashboard' && pathname !== '/challenges' && pathname !== '/rewards' && pathname !== '/leaderboard' && pathname !== '/registro' && pathname !== '/perfil') {
        //     router.push('/dashboard');
        // }
    }
  }


  return (
    <div className="bg-muted/30 min-h-screen pb-24">
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      <BottomNav />
    </div>
  );
}
