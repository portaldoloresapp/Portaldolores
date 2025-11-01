import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Database, BrainCircuit } from 'lucide-react';

const products = [
  {
    icon: <Server className="h-8 w-8 text-primary" />,
    title: 'Compute Engine',
    description: 'High-performance, scalable virtual machines running in Apex Cloud\'s state-of-the-art data centers.',
    price: 'Starting at $25/mo',
  },
  {
    icon: <Database className="h-8 w-8 text-primary" />,
    title: 'Cloud Storage',
    description: 'Secure, durable, and scalable object storage for all your data needs, from archives to active content.',
    price: 'Starting at $0.02/GB',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI Platform',
    description: 'An integrated suite of AI/ML services to build, deploy, and manage machine learning models with ease.',
    price: 'Custom Pricing',
  },
];

export function Products() {
  return (
    <section id="products" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Top Products
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our suite of cloud solutions designed for performance, security, and scalability.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Card key={index} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="flex flex-row items-start gap-4">
                {product.icon}
                <div className="flex-1">
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription className="mt-2">{product.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1"></CardContent>
              <CardFooter className="flex items-center justify-between bg-primary/5 p-6">
                <span className="font-semibold">{product.price}</span>
                <Button variant="outline">Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
