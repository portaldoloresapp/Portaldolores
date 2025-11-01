'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { ModeToggle } from "@/components/mode-toggle";
import { Loader2 } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/dashboard');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || user) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-0">
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <h1 className="font-headline text-xl font-bold">Portal Dolores</h1>
            </div>
            <div className="absolute top-8 right-8">
                <ModeToggle />
            </div>
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
