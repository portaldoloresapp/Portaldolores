import type { SVGProps } from 'react';
import { ThumbsDown } from 'lucide-react';

export function PortalDoloresLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.28 15.28l-3.29-3.29c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.58 2.58 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.29 6.29c-.39.39-1.03.39-1.42 0z"/>
    </svg>
  );
}

export function HelpingHandsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 12h2a2 2 0 1 0-4 0V8"/>
      <path d="M12 7V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v0"/>
      <path d="M14 10.5V8a2 2 0 0 0-2-2h-1"/>
      <path d="M10 12.5V8a2 2 0 0 0-2-2h-1"/>
      <path d="M4 15.5A1.5 1.5 0 0 1 5.5 14h1a1.5 1.5 0 0 1 1.5 1.5v1.5A1.5 1.5 0 0 1 6.5 19h-1A1.5 1.5 0 0 1 4 17.5Z"/>
      <path d="M16 15.5A1.5 1.5 0 0 1 17.5 14h1a1.5 1.5 0 0 1 1.5 1.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5Z"/>
    </svg>
  );
}

export function EmpathyIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01" />
            <path d="M15 9h.01" />
            <path d="M12 6c-2.4 0-4.6.9-6.2 2.4.5-1.9 2-3.4 3.9-4.2" />
            <path d="M14.3 4.2C16 5 17.5 6.5 18 8.4 16.6 7 14.4 6 12 6" />
        </svg>
    );
}

export function RespectIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 10a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
      <path d="M12 10h8" />
      <path d="M12 14a8 8 0 0 1-8 8" />
      <path d="M12 14a8 8 0 0 0 8 8" />
    </svg>
  );
}

export function CollaborationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a2 2 0 0 1 2 2v2h-4V4a2 2 0 0 1 2-2z" />
      <path d="M12 22a2 2 0 0 0-2-2v-2h4v2a2 2 0 0 0-2 2z" />
      <path d="M22 12a2 2 0 0 0-2-2h-2v4h2a2 2 0 0 0 2-2z" />
      <path d="M2 12a2 2 0 0 1 2-2h2v4H4a2 2 0 0 1-2-2z" />
      <path d="M12 6v12" />
      <path d="M6 12h12" />
    </svg>
  );
}
