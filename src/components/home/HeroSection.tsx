import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      {/* Deep teal base with rich gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-darker via-primary to-teal-mid" />
      
      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gold accent orb */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        {/* Teal bright orb */}
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-light/15 rounded-full blur-3xl animate-float-delayed" />
        {/* Central subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(234,176,22,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(234,176,22,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 md:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Main Heading */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white leading-tight animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.1s' }}
          >
            Strategy for a New Era.{' '}
            <span className="text-gradient">Precision for Real Impact.</span>
          </h1>
          
          {/* Subheading */}
          <p 
            className="text-lg md:text-xl lg:text-2xl text-white/85 max-w-3xl mx-auto animate-fade-in-up opacity-0 leading-relaxed"
            style={{ animationDelay: '0.2s' }}
          >
            Helping organisations transform faster through the fusion of human insight, 
            analytical rigour, and AI-accelerated execution.
          </p>
          
          {/* Gold accent divider */}
          <div 
            className="flex items-center justify-center gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.25s' }}
          >
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-accent/60" />
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-accent/60" />
          </div>
          
          {/* Taglines */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/75 animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="text-sm md:text-base italic">Where clarity meets action.</span>
            <span className="hidden sm:block text-accent text-lg">•</span>
            <span className="text-sm md:text-base italic">Where strategy becomes momentum.</span>
          </div>
          
          {/* CTA Button */}
          <div
            className="pt-6 animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.4s' }}
          >
            <Button 
              size="lg" 
              asChild 
              className="group bg-accent text-accent-foreground hover:bg-gold-light px-10 py-7 text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/30"
            >
              <Link to="/contact">
                Start Your Transformation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-primary/50 to-transparent" />
      
      {/* Decorative gold corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/10 to-transparent" />
    </section>
  );
}
