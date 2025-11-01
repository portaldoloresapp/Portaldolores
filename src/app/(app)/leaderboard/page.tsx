'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { leaderboard } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Crown, Award, Trophy } from 'lucide-react';
import { useUser } from '@/firebase';

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Trophy className="h-6 w-6 text-slate-400" />;
  if (rank === 3) return <Award className="h-6 w-6 text-amber-700" />;
  return <span className="font-bold text-lg w-6 text-center">{rank}</span>;
};

export default function LeaderboardPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
          Ranking de Celebração
        </h1>
        <p className="text-muted-foreground mt-2">
          Aqui celebramos as boas escolhas. Veja quem está inspirando a turma!
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Destaques da Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Posição</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map(({ rank, student }) => (
                <TableRow
                  key={student.id}
                  className={cn(
                    user && student.id === user.uid && 'bg-primary/10'
                  )}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatarUrl} alt={student.name} />
                        <AvatarFallback>
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {/* Exibe apenas o primeiro nome para privacidade */}
                      <span className="font-medium">{student.name.split(' ')[0]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary text-lg">
                    {student.points.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
