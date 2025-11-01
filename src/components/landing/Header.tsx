import { ApexLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  onConsultationClick: () => void;
};

export function Header({ onConsultationClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2">
          <ApexLogo className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">Apex Cloud</span>
        </a>
        <Button onClick={onConsultationClick}>
          Request a Consultation
        </Button>
      </div>
    </header>
  );
}
