import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { PageTransition } from '@/components/shared/PageTransition';
import { OrbitSection } from '@/components/approach/OrbitSection';
import { Sparkles, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApproachPage() {
  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Our Methodology</span>
                </div>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={100}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
                  How We Work
                </h1>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={200}>
                <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                  Organisations change when strategy and execution move together. Our approach ensures both.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Orbit Steps Section */}
        <OrbitSection />

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-secondary via-secondary to-secondary/80 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-4 relative z-10">
            <RevealOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
                  <Rocket className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready to Start?</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Let's transform your business together
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Whether you're facing complex challenges or seeking new opportunities, 
                  our proven methodology delivers results.
                </p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-gold text-primary font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}