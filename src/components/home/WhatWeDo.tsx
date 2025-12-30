import { SectionHeading } from '@/components/shared/SectionHeading';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';

export function WhatWeDo() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Transform. Innovate. Accelerate."
          subtitle="We partner with organisations to unlock growth, redesign operations, elevate leadership, and build future-ready capabilities."
          dark
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <RevealOnScroll delayMs={0}>
              <div className="space-y-3 group">
                <div className="text-5xl font-serif text-gold group-hover:scale-110 transition-transform duration-300 inline-block">01</div>
                <h3 className="text-xl font-semibold">Transform</h3>
                <p className="text-primary-foreground/70 text-sm">
                  Reimagine your business model and operating approach
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={150}>
              <div className="space-y-3 group">
                <div className="text-5xl font-serif text-gold group-hover:scale-110 transition-transform duration-300 inline-block">02</div>
                <h3 className="text-xl font-semibold">Innovate</h3>
                <p className="text-primary-foreground/70 text-sm">
                  Leverage AI and digital tools for competitive advantage
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={300}>
              <div className="space-y-3 group">
                <div className="text-5xl font-serif text-gold group-hover:scale-110 transition-transform duration-300 inline-block">03</div>
                <h3 className="text-xl font-semibold">Accelerate</h3>
                <p className="text-primary-foreground/70 text-sm">
                  Move faster from strategy to measurable results
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}