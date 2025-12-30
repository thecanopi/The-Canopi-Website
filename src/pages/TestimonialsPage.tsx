import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { Quote } from 'lucide-react';

export default function TestimonialsPage() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="gold-accent-line mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              What Our Clients Say
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80">
              Trusted by leaders across industries
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="premium-card space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : testimonials && testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <Quote className="h-10 w-10 text-gold/30 mb-4" />
                  <blockquote className="text-lg text-primary font-serif italic mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <p className="text-sm text-muted-foreground font-medium">
                    — {testimonial.author_role}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-2">
                No testimonials available.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
