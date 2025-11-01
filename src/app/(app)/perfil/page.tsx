'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, LogOut, Palette, School, Star, Trophy, Pencil } from 'lucide-react';
import { leaderboard } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const profileSchema = z.object({
  displayName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  photoURL: z.string().url('Por favor, insira uma URL válida.').or(z.literal('')),
  classId: z.string().min(1, 'Por favor, selecione uma turma.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const classes = [
    { id: '6A', name: 'Turma 6A' },
    { id: '6B', name: 'Turma 6B' },
    { id: '7A', name: 'Turma 7A' },
    { id: '7B', name: 'Turma 7B' },
    { id: '8A', name: 'Turma 8A' },
];

const avatars = [
  'https://picsum.photos/seed/avatar1/200',
  'https://picsum.photos/seed/avatar2/200',
  'https://picsum.photos/seed/avatar3/200',
  'https://picsum.photos/seed/avatar4/200',
  'https://picsum.photos/seed/avatar5/200',
  'https://picsum.photos/seed/avatar6/200',
];


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      photoURL: '',
      classId: '',
    },
  });

  useEffect(() => {
    if (user?.profile) {
      form.reset({
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
        classId: user.profile.classId ?? '',
      });
    }
  }, [user, form]);
  
  const watchedPhotoURL = form.watch('photoURL');

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !auth.currentUser) return;
    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });

      const userDocRef = doc(firestore, 'users', user.uid);
      const updatedProfile = {
        ...user.profile,
        displayName: data.displayName,
        photoURL: data.photoURL,
        classId: data.classId,
      };
      
      setDoc(userDocRef, updatedProfile, { merge: true }).catch(error => {
        if (error.code === 'permission-denied') {
          const contextualError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: updatedProfile,
          });
          errorEmitter.emit('permission-error', contextualError);
        }
      });
      
      toast({
        title: 'Perfil Atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      });
      setIsDialogOpen(false); // Close dialog on success
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Salvar',
        description: 'Não foi possível atualizar seu perfil. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const userInitials = user?.displayName?.split(' ').map((n) => n[0]).join('') ?? '';
  const userRank = leaderboard.find((entry) => entry.student.id === user?.uid)?.rank || 'N/A';
  const currentClassName = classes.find(c => c.id === user?.profile?.classId)?.name || 'Não definida';


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <DialogTrigger asChild>
                <div className="relative group cursor-pointer mx-auto sm:mx-0">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                        <AvatarImage src={watchedPhotoURL || user?.photoURL || ''} alt={user?.displayName ?? 'Avatar'} />
                        <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="h-8 w-8 text-white" />
                    </div>
                </div>
            </DialogTrigger>
            <div className="flex-1 text-center sm:text-left">
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    {user?.displayName}
                </h1>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
            </div>
            {!isMobile && (
                <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
            )}
        </div>
        
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogDescription>Mantenha suas informações atualizadas. Clique em salvar quando terminar.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome de Exibição</FormLabel>
                            <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="photoURL"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            <FormControl>
                                <div className="grid grid-cols-4 gap-4 justify-items-center pt-2">
                                {avatars.map((avatarUrl) => (
                                    <button
                                    key={avatarUrl}
                                    type="button"
                                    onClick={() => field.onChange(avatarUrl)}
                                    className={cn(
                                        'rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                        field.value === avatarUrl && 'ring-2 ring-primary ring-offset-2'
                                    )}
                                    >
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={avatarUrl} />
                                        <AvatarFallback>{field.value.slice(-2)}</AvatarFallback>
                                    </Avatar>
                                    </button>
                                ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="classId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Turma</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Selecione sua turma..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {classes.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Meus Pontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{user?.profile?.points ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">#{userRank}</div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <School className="h-4 w-4 text-primary" />
                    Minha Turma
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{currentClassName}</div>
                 <p className="text-xs text-muted-foreground">Prof.ª Ana Silva</p>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Configurações</CardTitle>
            <CardDescription>Personalize sua experiência no portal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-muted-foreground"/>
                    <Label htmlFor="theme-switch" className="font-medium">
                        Tema Escuro
                    </Label>
                </div>
                <Switch
                    id="theme-switch"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
            </div>
        </CardContent>
      </Card>
        {isMobile && (
             <Button variant="outline" onClick={handleSignOut} className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
            </Button>
        )}
    </div>
  );
}
