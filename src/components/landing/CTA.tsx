import { Button } from '@/components/ui/button';

type CTAProps = {
  onConsultationClick: () => void;
};

export function CTA({ onConsultationClick }: CTAProps) {
  return (
    <section id="cta" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to Elevate Your Infrastructure?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Discover how Apex Cloud can drive innovation and growth for your enterprise.
          Our experts are ready to help you build the perfect solution.
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={onConsultationClick} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Request a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
