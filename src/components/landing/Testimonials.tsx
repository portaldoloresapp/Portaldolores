import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    quote: "Apex Cloud revolutionized our infrastructure. Their platform is incredibly reliable and their support team is second to none. We've seen a 40% increase in performance since migrating.",
    author: 'Jane Doe',
    title: 'CTO, Innovate Inc.',
    avatar: 'JD',
    logoId: 'logo-innovate',
  },
  {
    quote: "The scalability of Apex Cloud's services is unmatched. We were able to handle a 10x traffic spike during our product launch without a single issue. A true game-changer for our business.",
    author: 'Mark Johnson',
    title: 'Head of Engineering, QuantumLeap',
    avatar: 'MJ',
    logoId: 'logo-quantumleap',
  },
  {
    quote: "As a data-driven company, security is our top priority. Apex Cloud's robust security features and compliance certifications give us the peace of mind we need to focus on innovation.",
    author: 'Emily Chen',
    title: 'CEO, Stellar Solutions',
    avatar: 'EC',
    logoId: 'logo-stellar',
  },
];

export function Testimonials() {
  const getLogo = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <section id="testimonials" className="bg-primary/5 py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Leading Enterprises
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our customers have to say about their experience with Apex Cloud.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const logo = getLogo(testimonial.logoId);
            return (
              <Card key={index} className="flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardContent className="flex-1 p-6">
                  <p className="text-muted-foreground">"{testimonial.quote}"</p>
                </CardContent>
                <CardHeader className="flex flex-row items-center justify-between border-t p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                  {logo && (
                    <Image
                      src={logo.imageUrl}
                      alt={logo.description}
                      data-ai-hint={logo.imageHint}
                      width={100}
                      height={30}
                      className="object-contain"
                    />
                  )}
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
