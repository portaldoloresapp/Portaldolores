'use client';
import { leaderboard, behaviors, students } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal, Star, BarChart, Users, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function DashboardPage() {
  const { user } = useUser();
  
  const currentUserPoints = user?.profile?.points ?? 0;
  const userRank =
    leaderboard.find((entry) => entry.student.id === user?.uid)?.rank || 0;

  const recentActivities = [
    { behavior: behaviors[0], date: '2 dias atrás' },
    { behavior: behaviors[3], date: '3 dias atrás' },
    { behavior: behaviors[1], date: '5 dias atrás' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
          Bem-vindo(a) de volta, {user?.displayName?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Cada boa escolha é um passo em sua jornada. Celebre seu progresso!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Pontos</CardTitle>
            <Star className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {currentUserPoints}
            </div>
            <p className="text-xs text-muted-foreground">Pontos totais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Posição no Ranking
            </CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">#{userRank}</div>
            <p className="text-xs text-muted-foreground">
              De {leaderboard.length} alunos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight mb-4">
            Atividade Recente
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center p-4">
                    <div className="p-3 rounded-full bg-primary/10 mr-4">
                      <activity.behavior.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">
                        +{activity.behavior.points} pontos por{' '}
                        {activity.behavior.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.behavior.description}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
