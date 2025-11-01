import { Button } from '@/components/ui/button';

type HeroProps = {
  onConsultationClick: () => void;
};

export function Hero({ onConsultationClick }: HeroProps) {
  return (
    <section className="relative border-b">
       <div className="absolute inset-0 bg-primary/5"></div>
       <div className="container relative mx-auto px-4 py-20 text-center sm:py-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The Enterprise Cloud Platform You Can Trust
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            Scalable, Secure, and Reliable Solutions. Power your business with Apex Cloud and unlock unparalleled performance and innovation.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={onConsultationClick} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Request a Consultation
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#products">Explore Products &rarr;</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
