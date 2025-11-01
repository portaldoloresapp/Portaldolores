'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { navItems } from '@/lib/nav-items';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { ModeToggle } from '../mode-toggle';
import { HeartHandshake } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth);
    router.push('/login');
  };

  const userInitials = user?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-20">
      <div className="bg-background border rounded-full p-2 shadow-lg">
        <TooltipProvider delayDuration={0}>
            <div className="flex justify-around items-center">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                    <Link href={item.href}>
                        <div
                        className={cn(
                            'flex flex-col items-center justify-center h-12 w-12 rounded-full transition-colors duration-200',
                            isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                        >
                        <item.icon className="h-6 w-6" />
                        <span className="sr-only">{item.label}</span>
                        </div>
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="mb-2">
                        <p>{item.label}</p>
                    </TooltipContent>
                </Tooltip>
                );
            })}
             {user?.profile?.role === 'teacher' && (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Link href="/registro">
                        <div
                        className={cn(
                            'flex flex-col items-center justify-center h-12 w-12 rounded-full transition-colors duration-200',
                            pathname === '/registro' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                        >
                        <HeartHandshake className="h-6 w-6" />
                        <span className="sr-only">Registrar</span>
                        </div>
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="mb-2">
                        <p>Registrar</p>
                    </TooltipContent>
                </Tooltip>
             )}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Link href="/perfil">
                        <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                            <Avatar className="h-10 w-10 border-2 border-primary/50">
                            <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? ''} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </Link>
                </DropdownMenuTrigger>
            </DropdownMenu>
            </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
