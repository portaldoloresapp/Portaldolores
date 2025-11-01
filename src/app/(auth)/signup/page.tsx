'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const TEACHER_ACTIVATION_CODE = 'dolores@222';

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(['student', 'teacher'], {
    required_error: 'Você precisa selecionar um tipo de conta.',
  }),
  activationCode: z.string().optional(),
}).refine((data) => {
  if (data.role === 'teacher' && !data.activationCode) {
    return false;
  }
  return true;
}, {
  message: 'Código de ativação é obrigatório para professores.',
  path: ['activationCode'],
}).refine((data) => {
    if (data.role === 'teacher' && data.activationCode !== TEACHER_ACTIVATION_CODE) {
      return false;
    }
    return true;
}, {
    message: 'Código de ativação inválido.',
    path: ['activationCode'],
});

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'student',
      activationCode: '',
    },
  });

  const selectedRole = form.watch('role');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: values.name,
      });

      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: values.name,
        role: values.role,
        points: 1000, // All users start with 1000 points
      };

      const userDocRef = doc(firestore, 'users', user.uid);
      
      // Use setDoc with a .catch block for permission errors
      setDoc(userDocRef, userProfile).catch(error => {
        if (error.code === 'permission-denied') {
          const contextualError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userProfile,
          });
          errorEmitter.emit('permission-error', contextualError);
        }
      });

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você será redirecionado em breve.',
      });
      // Redirect will happen via the layout component
    } catch (error: any) {
      let description = 'Ocorreu um erro inesperado. Por favor, tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
          description = 'Este e-mail já está em uso. Tente fazer login ou use outro e-mail.';
      } else if (error.code === 'auth/weak-password') {
          description = 'A senha é muito fraca. Tente uma senha mais forte.';
      }
      toast({
        title: 'Erro ao criar conta',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Crie sua Conta</CardTitle>
        <CardDescription>Insira seus dados para começar a jornada do respeito.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Eu sou...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="student" />
                            </FormControl>
                            <FormLabel className="font-normal">Aluno</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="teacher" />
                            </FormControl>
                            <FormLabel className="font-normal">Professor / Gestor</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Mínimo de 6 caracteres" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {selectedRole === 'teacher' && (
                   <FormField
                    control={form.control}
                    name="activationCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código de Ativação</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Insira o código de ativação" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Conta
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Faça login
                    </Link>
                </p>
            </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
