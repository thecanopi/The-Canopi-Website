import { Target, Lightbulb, Rocket, Users } from 'lucide-react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';

const values = [
  {
    icon: Target,
    title: 'Strategy you can act on immediately',
  },
  {
    icon: Lightbulb,
    title: 'AI-powered insights for better, faster decisions',
  },
  {
    icon: Rocket,
    title: 'Execution support from start to scale',
  },
  {
    icon: Users,
    title: 'A team that equips your people — not one that replaces them ',
  },
];

export function ValuePropositions() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Built for Leaders Who Want Results, Not Reports"
        />
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <RevealOnScroll key={index} delayMs={index * 100}>
              <div className="value-card group">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-6 w-6 text-gold" />
                </div>
                <p className="font-medium text-primary">{value.title}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}