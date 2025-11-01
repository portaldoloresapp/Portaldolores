'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { students, behaviors, type Behavior, type Student } from '@/lib/data';
import { PlusCircle, MinusCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function TrackBehaviorPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedBehaviorId, setSelectedBehaviorId] = useState<string | null>(null);
  const [justification, setJustification] = useState('');
  const [justificationError, setJustificationError] = useState<string | null>(null);
  const { toast } = useToast();

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const selectedBehavior = behaviors.find(b => b.id === selectedBehaviorId);
  
  const validateJustification = () => {
    if (justification.trim().length < 10) {
      setJustificationError('A justificativa deve ter pelo menos 10 caracteres.');
      return false;
    }
    setJustificationError(null);
    return true;
  };
  
  const handleConfirmClick = () => {
    if (!selectedStudent || !selectedBehaviorId) {
      toast({
        title: 'Seleção Incompleta',
        description: 'Por favor, selecione um aluno e uma ação.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateJustification()) {
      return;
    }
    
    let pointChange = selectedBehavior!.points;
    const studentCurrentPoints = selectedStudent.points;

    // Prevenção de saldo negativo
    if (selectedBehavior!.type === 'negative' && (studentCurrentPoints + pointChange < 0)) {
        pointChange = -studentCurrentPoints; // Zera o saldo
        toast({
            title: 'Aviso: Saldo Mínimo Atingido',
            description: `${selectedStudent.name} não pode ter pontos negativos. Apenas ${Math.abs(pointChange)} pontos foram subtraídos para zerar o saldo.`,
            variant: 'default',
            duration: 6000,
        });
    }

    const action = pointChange > 0 ? 'adicionados' : 'subtraídos';
    
    // Sucesso
    toast({
      title: 'Registro Celebrado! ✨',
      description: `${Math.abs(pointChange)} pontos foram ${action} para ${selectedStudent.name} por ${selectedBehavior!.name}.`,
    });
    
    // Resetar estado
    setSelectedBehaviorId(null);
    setJustification('');
  };
  
  const positiveBehaviors = behaviors.filter(b => b.type === 'positive');
  const negativeBehaviors = behaviors.filter(b => b.type === 'negative');
  
  const showConfirmation = selectedBehavior && selectedBehavior.type === 'negative' && selectedBehavior.points <= -100;
  
  const isSubmitEnabled = !!(selectedStudentId && selectedBehaviorId && justification.trim().length >= 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
          Celebrar uma Ação
        </h1>
        <p className="text-muted-foreground mt-2">
          Aqui, cada escolha boa merece ser celebrada. Registre e inspire!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Passo 1: Escolha um Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedStudentId}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Selecione um aluno..." />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} - {student.points} pontos
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedStudentId && (
        <Card>
          <CardHeader>
            <CardTitle>Passo 2: Escolha a Ação</CardTitle>
            <CardDescription>Clique em um cartão para selecionar a ação a ser registrada.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="positive" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="positive">Ação Positiva (+)</TabsTrigger>
                <TabsTrigger value="negative">Ponto de Atenção (-)</TabsTrigger>
              </TabsList>
              <TabsContent value="positive" className="mt-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positiveBehaviors.map((behavior) => (
                    <BehaviorCard 
                      key={behavior.id} 
                      behavior={behavior} 
                      selectedBehaviorId={selectedBehaviorId} 
                      onSelect={setSelectedBehaviorId}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="negative" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {negativeBehaviors.map((behavior) => (
                    <BehaviorCard 
                      key={behavior.id} 
                      behavior={behavior} 
                      selectedBehaviorId={selectedBehaviorId} 
                      onSelect={setSelectedBehaviorId}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {selectedStudentId && selectedBehaviorId && (
        <Card>
          <CardHeader>
            <CardTitle>Passo 3: Justificativa</CardTitle>
            <CardDescription>Descreva brevemente o que aconteceu (mínimo 10 caracteres). Isto é importante!</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="justification">Justificativa</Label>
                <Textarea 
                  id="justification"
                  placeholder="Ex: Ajudou um colega que estava com dificuldade na lição."
                  value={justification}
                  onChange={(e) => {
                    setJustification(e.target.value);
                    if (e.target.value.trim().length >= 10) {
                      setJustificationError(null);
                    }
                  }}
                  onBlur={validateJustification}
                  className={cn(justificationError && 'border-destructive')}
                />
                {justificationError && <p className="text-sm text-destructive">{justificationError}</p>}
              </div>
          </CardContent>
        </Card>
      )}
      
      {selectedStudentId && selectedBehaviorId && (
        <div className="flex justify-end mt-6">
          {showConfirmation ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button size="lg" variant="destructive" disabled={!isSubmitEnabled}>
                  <MinusCircle className="mr-2 h-5 w-5" />
                  Confirmar Registro Grave
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-destructive h-6 w-6"/>
                        Confirmar Registro de Infração Grave?
                    </div>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação subtrairá **{Math.abs(selectedBehavior!.points)} pontos** de **{selectedStudent?.name}**.
                    Esta ação é séria e deve ser usada com critério. Você confirma este registro?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmClick} className={buttonVariants({ variant: "destructive" })}>
                    Sim, confirmar registro
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button size="lg" onClick={handleConfirmClick} disabled={!isSubmitEnabled}>
              {selectedBehavior?.type === 'positive' ? (
                <PlusCircle className="mr-2 h-5 w-5" />
              ) : (
                <MinusCircle className="mr-2 h-5 w-5" />
              )}
              Confirmar Registro
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function BehaviorCard({ behavior, selectedBehaviorId, onSelect }: { behavior: Behavior, selectedBehaviorId: string | null, onSelect: (id: string) => void }) {
  const isNegative = behavior.type === 'negative';
  const pointColor = isNegative ? 'text-destructive' : 'text-green-500';
  const ringColor = isNegative ? 'ring-destructive' : 'ring-primary';

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:-translate-y-px',
        selectedBehaviorId === behavior.id && `ring-2 ${ringColor}`
      )}
      onClick={() => onSelect(behavior.id)}
    >
      <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
        <div className={cn('p-3 rounded-lg', isNegative ? 'bg-destructive/10' : 'bg-primary/10')}>
          <behavior.icon className={cn('h-6 w-6', isNegative ? 'text-destructive' : 'text-primary')} />
        </div>
        <div>
          <CardTitle className="text-base">{behavior.name}</CardTitle>
          <p className={cn('text-sm font-bold', pointColor)}>
            {behavior.points > 0 ? '+' : ''}{behavior.points} Pontos
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{behavior.description}</p>
      </CardContent>
    </Card>
  )
}
