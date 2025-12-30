import { RevealOnScroll } from '@/components/shared/RevealOnScroll';

export function SubHeroSection() {
  return (
    <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <RevealOnScroll>
            <p className="text-xl md:text-2xl lg:text-3xl text-primary font-serif leading-relaxed">
              You don't need more slides. You need partners who solve problems with you — 
              and move just as fast as your business demands.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delayMs={150}>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We bring structured thinking, digital fluency, and execution agility to help 
              leaders solve their toughest challenges and seize their biggest opportunities.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}