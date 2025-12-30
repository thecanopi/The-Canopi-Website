import { SectionHeading } from '@/components/shared/SectionHeading';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { TrendingDown, Users, TrendingUp, Database } from 'lucide-react';

const wins = [
  {
    icon: TrendingDown,
    stat: 18,
    suffix: '%',
    description: 'Reduced operating costs for a regional health system in 9 months',
  },
  {
    icon: Users,
    stat: 250,
    suffix: 'k',
    description: 'Users reached in the first year following a digital care platform launch',
  },
  {
    icon: TrendingUp,
    stat: 34,
    suffix: '%',
    description: 'Revenue boost from revitalised go-to-market strategy',
  },
  {
    icon: Database,
    stat: 100,
    suffix: '%',
    prefix: '',
    description: 'Enterprise-wide AI adoption enabled through a data governance model',
  },
];

export function ClientWins() {
  return (
    <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Featured Client Wins"
          subtitle="Real results from real partnerships"
        />
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wins.map((win, index) => (
            <RevealOnScroll key={index} delayMs={index * 100}>
              <div className="stat-card group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <win.icon className="h-6 w-6 text-gold" />
                </div>
                <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                  <AnimatedCounter 
                    end={win.stat} 
                    suffix={win.suffix} 
                    prefix={win.prefix}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {win.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}