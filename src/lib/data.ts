import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  HelpingHandsIcon,
  RespectIcon,
  EmpathyIcon,
  CollaborationIcon,
} from '@/components/icons';
import { Smile, Heart, ThumbsDown, Book, Pencil, Pizza, Users, Music } from 'lucide-react';

export type Student = {
  id: string;
  name: string;
  points: number;
  avatarUrl: string;
};

export type Behavior = {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: 'positive' | 'negative';
};

export type LeaderboardEntry = {
  rank: number;
  student: Student;
};

export const students: Student[] = [
  { id: '1', name: 'Alex Johnson', points: 1000, avatarUrl: 'https://picsum.photos/seed/alex/100/100' },
  { id: '2', name: 'Maria Garcia', points: 1000, avatarUrl: 'https://picsum.photos/seed/maria/100/100' },
  { id: '3', name: 'Sam Chen', points: 1000, avatarUrl: 'https://picsum.photos/seed/sam/100/100' },
  { id: '4', name: 'Emily White', points: 1000, avatarUrl: 'https://picsum.photos/seed/emily/100/100' },
  { id: '5', name: 'James Brown', points: 1000, avatarUrl: 'https://picsum.photos/seed/james/100/100' },
];

export const currentUser: Student = students[3];

export const behaviors: Behavior[] = [
  { id: 'b1', name: 'Gentileza', description: 'Mostrou gentileza excepcional com um colega.', points: 20, icon: Heart, type: 'positive' },
  { id: 'b2', name: 'Ajudar um Colega', description: 'Ajudou um colega ou professor sem ser solicitado.', points: 15, icon: HelpingHandsIcon, type: 'positive' },
  { id: 'b3', name: 'Respeito', description: 'Demonstrou respeito pelas opiniões e propriedades dos outros.', points: 10, icon: RespectIcon, type: 'positive' },
  { id: 'b4', name: 'Colaboração', description: 'Trabalhou de forma eficaz e inclusiva em grupo.', points: 15, icon: CollaborationIcon, type: 'positive' },
  { id: 'b5', name: 'Empatia', description: 'Mostrou compreensão e compaixão pelos sentimentos de alguém.', points: 20, icon: EmpathyIcon, type: 'positive' },
  { id: 'b6', name: 'Atitude Positiva', description: 'Manteve uma atitude positiva e encorajou os outros.', points: 10, icon: Smile, type: 'positive' },
  { id: 'n1', name: 'Infração Leve', description: 'Ex: usar palavrão.', points: -20, icon: ThumbsDown, type: 'negative' },
  { id: 'n2', name: 'Infração Média', description: 'Ex: empurrar um colega.', points: -50, icon: ThumbsDown, type: 'negative' },
  { id: 'n3', name: 'Infração Grave', description: 'Ex: bullying.', points: -100, icon: ThumbsDown, type: 'negative' },
];

export const leaderboard: LeaderboardEntry[] = [...students]
  .sort((a, b) => b.points - a.points)
  .map((student, index) => ({
    rank: index + 1,
    student,
  }));
