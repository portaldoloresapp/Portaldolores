import { ApexLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
          <div className="flex items-center gap-2">
            <ApexLogo className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Apex Cloud</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Apex Cloud. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Twitter">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
