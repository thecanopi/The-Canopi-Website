import { useState } from 'react';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { PageTransition } from '@/components/shared/PageTransition';
import { Sparkles, TrendingUp, Megaphone, Brain, Settings, Users, Lightbulb, Rocket, ArrowRight } from 'lucide-react';
import { useFlipSound } from '@/hooks/useFlipSound';

const capabilities = [
  {
    title: 'Corporate and Business Strategy',
    shortTitle: 'Business Strategy',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-700',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    items: [
      'Growth and diversification strategy',
      'Operating model redesign',
      'Market entry and expansion strategy',
      'Enterprise transformation roadmaps',
    ],
  },
  {
    title: 'Branding and Marketing',
    shortTitle: 'Branding',
    icon: Megaphone,
    color: 'from-gold to-amber-600',
    glowColor: 'rgba(212, 175, 55, 0.5)',
    borderColor: 'border-gold',
    textColor: 'text-gold',
    bgColor: 'bg-gold/20',
    items: [
      'Brand architecture and positioning',
      'Brand identity development and refresh',
      'Marketing strategy and planning',
      'Customer segmentation and value proposition',
      'Go-to-market strategy and activation',
      'Marketing performance measurement',
    ],
  },
  {
    title: 'Digital, Data and AI Strategy',
    shortTitle: 'Digital & AI',
    icon: Brain,
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    items: [
      'Digital transformation strategy',
      'AI readiness assessment and roadmap',
      'Business model innovation',
      'Data governance and operating standards',
      'Generative AI use case design',
    ],
  },
  {
    title: 'Operations and Performance',
    shortTitle: 'Operations',
    icon: Settings,
    color: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    items: [
      'Cost transformation',
      'Supply chain optimisation',
      'Lean and agile operations',
      'Process excellence',
    ],
  },
  {
    title: 'Customer and Growth Strategy',
    shortTitle: 'Growth Strategy',
    icon: Users,
    color: 'from-rose-500 to-pink-600',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    items: [
      'Go-to-market design',
      'Pricing optimisation',
      'Brand and experience transformation',
      'Marketing effectiveness',
      'Customer analytics and segmentation',
    ],
  },
  {
    title: 'Leadership and Personal Branding',
    shortTitle: 'Leadership',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    items: [
      'Executive narrative and positioning',
      'Leadership communication strategy',
      'Thought leadership blueprinting',
      'Digital presence management',
      'Reputation and visibility strategy',
    ],
  },
  {
    title: 'Innovation and Venture Advisory',
    shortTitle: 'Innovation',
    icon: Rocket,
    color: 'from-indigo-500 to-violet-600',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    borderColor: 'border-indigo-500',
    textColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20',
    items: [
      'Venture creation and scaling',
      'Corporate venture strategy',
      'Startup partnership ecosystems',
      'Product strategy and experimentation',
    ],
  },
];

interface FlipCardProps {
  capability: typeof capabilities[0];
  index: number;
}

const FlipCard = ({ capability, index }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = capability.icon;
  const { playFlipSound } = useFlipSound();

  const handleFlip = (newState: boolean) => {
    if (newState !== isFlipped) {
      playFlipSound();
      setIsFlipped(newState);
    }
  };

  const handleClick = () => {
    handleFlip(!isFlipped);
  };

  return (
    <div
      className="flip-card-container h-[340px] md:h-[380px] cursor-pointer group"
      style={{ 
        animationDelay: `${index * 100}ms`,
        '--glow-color': capability.glowColor,
      } as React.CSSProperties}
      onMouseEnter={() => handleFlip(true)}
      onMouseLeave={() => handleFlip(false)}
      onClick={handleClick}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Face */}
        <div className={`flip-card-front rounded-3xl bg-gradient-to-br ${capability.color} p-6 flex flex-col items-center justify-center text-white`}>
          {/* Shimmer overlay */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="shimmer-effect" />
          </div>
          
          {/* Animated mesh gradient background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="mesh-gradient" />
            <div className="floating-orb orb-1" />
            <div className="floating-orb orb-2" />
            <div className="floating-orb orb-3" />
          </div>

          {/* Glowing ring effect */}
          <div className="absolute inset-4 rounded-2xl border border-white/20 glow-ring" />

          {/* Icon container with enhanced glow */}
          <div className="relative z-10 mb-6">
            <div className="icon-glow" />
            <div className="icon-ring" />
            <div className="relative w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl icon-container">
              <Icon className="w-12 h-12 text-white drop-shadow-lg icon-pulse" />
            </div>
            {/* Orbiting particles */}
            <div className="orbit-particle particle-1" />
            <div className="orbit-particle particle-2" />
            <div className="orbit-particle particle-3" />
          </div>

          {/* Short Title with glow */}
          <h3 className="relative z-10 text-2xl md:text-3xl font-bold text-center leading-tight px-2 text-shadow-glow">
            {capability.shortTitle}
          </h3>

          {/* Subtle arrow indicator */}
          <div className="absolute bottom-6 flex items-center gap-2 text-white/60 text-sm">
            <span className="text-xs uppercase tracking-widest">Explore</span>
            <ArrowRight className="w-4 h-4 arrow-bounce" />
          </div>

          {/* Corner accents with animation */}
          <div className="corner-accent top-left" />
          <div className="corner-accent top-right" />
          <div className="corner-accent bottom-left" />
          <div className="corner-accent bottom-right" />

          {/* Number badge */}
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold border border-white/30">
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Back Face */}
        <div className={`flip-card-back rounded-3xl bg-card/95 backdrop-blur-xl border-2 ${capability.borderColor} p-6 flex flex-col overflow-hidden`}>
          {/* Animated gradient border effect */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${capability.color} opacity-5`} />
          
          {/* Top accent bar with animation */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${capability.color} animated-gradient`} />
          
          {/* Floating background shapes */}
          <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${capability.bgColor} blur-3xl opacity-50`} />
          <div className={`absolute -bottom-20 -left-20 w-32 h-32 rounded-full ${capability.bgColor} blur-3xl opacity-30`} />
          
          {/* Title with icon */}
          <div className="flex items-center gap-4 mb-5 pt-2 relative z-10">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${capability.color} flex items-center justify-center shadow-lg icon-spin`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg md:text-xl font-bold ${capability.textColor} leading-tight flex-1`}>
              {capability.title}
            </h3>
          </div>

          {/* Items list with staggered animation */}
          <ul className="space-y-3 flex-1 overflow-y-auto relative z-10">
            {capability.items.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="flex items-start gap-3 text-sm text-foreground/80 item-reveal group/item"
                style={{ animationDelay: `${itemIndex * 100}ms` }}
              >
                <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-r ${capability.color} flex-shrink-0 item-dot`} />
                <span className="leading-relaxed group-hover/item:text-foreground transition-colors">{item}</span>
              </li>
            ))}
          </ul>

          {/* Bottom action area */}
          <div className="mt-5 pt-4 border-t border-border/30 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {capability.items.length} Services
              </span>
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${capability.color} text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer flex items-center gap-2`}>
                <span>Discover</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CapabilitiesPage() {
  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 hero-mesh" />
          
          {/* Floating orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold/10 rounded-full blur-3xl animate-pulse-slow" />
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute particle"
                style={{
                  left: `${(i * 4) % 100}%`,
                  top: `${(i * 7) % 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  width: `${4 + (i % 4)}px`,
                  height: `${4 + (i % 4)}px`,
                }}
              />
            ))}
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 grid-pattern opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/20 text-accent mb-8 hover:scale-105 transition-transform border border-accent/30 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 animate-spin-slow" />
                  <span className="text-sm font-medium uppercase tracking-wider">What We Do</span>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delayMs={100}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 hero-title">
                  Our <span className="text-gradient">Capabilities</span>
                </h1>
              </RevealOnScroll>
              <RevealOnScroll delayMs={200}>
                <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  A complete set of services to help organisations transform 
                  and grow with purpose. Tap or hover to explore each capability.
                </p>
              </RevealOnScroll>
            </div>
          </div>

          {/* Bottom wave decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-20 wave-decoration" />
        </section>

        {/* Flip Cards Grid */}
        <section className="py-16 md:py-24 relative overflow-hidden bg-background">
          {/* Background decorations */}
          <div className="absolute top-40 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/3 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {capabilities.map((capability, index) => (
                <FlipCard key={index} capability={capability} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-5" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Ready to <span className="text-gradient">Transform</span> Your Business?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
                Let's discuss how our capabilities can drive your growth and success.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold via-accent to-gold text-primary font-bold rounded-full shadow-2xl hover:shadow-gold/30 hover:scale-105 transition-all duration-300 text-lg cta-button"
              >
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </a>
            </RevealOnScroll>
          </div>
        </section>
      </div>

      {/* Enhanced CSS animations */}
      <style>{`
        .flip-card-container {
          perspective: 1500px;
          animation: cardFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(40px) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .flip-card-front {
          box-shadow: 0 25px 50px -12px var(--glow-color, rgba(0,0,0,0.25));
          transition: box-shadow 0.3s ease;
        }
        
        .flip-card-container:hover .flip-card-front,
        .flip-card-container:active .flip-card-front {
          box-shadow: 0 35px 60px -15px var(--glow-color, rgba(0,0,0,0.4));
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
        }
        
        /* Shimmer effect */
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Mesh gradient */
        .mesh-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 40%);
          animation: meshMove 8s ease-in-out infinite;
        }
        
        @keyframes meshMove {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        /* Floating orbs */
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          filter: blur(20px);
        }
        
        .orb-1 {
          width: 80px;
          height: 80px;
          top: -20px;
          right: -20px;
          animation: orbFloat1 6s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 60px;
          height: 60px;
          bottom: 20px;
          left: 10px;
          animation: orbFloat2 7s ease-in-out infinite;
        }
        
        .orb-3 {
          width: 40px;
          height: 40px;
          top: 40%;
          right: 20%;
          animation: orbFloat3 5s ease-in-out infinite;
        }
        
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
        }
        
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10px, 10px) scale(1.2); }
        }
        
        /* Glow ring */
        .glow-ring {
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        /* Icon effects */
        .icon-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: iconGlow 3s ease-in-out infinite;
        }
        
        @keyframes iconGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        .icon-ring {
          position: absolute;
          inset: -10px;
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          animation: ringExpand 2s ease-out infinite;
        }
        
        @keyframes ringExpand {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .icon-container {
          transition: transform 0.3s ease;
        }
        
        .flip-card-container:hover .icon-container {
          transform: scale(1.1);
        }
        
        .icon-pulse {
          animation: iconPulse 2s ease-in-out infinite;
        }
        
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        /* Orbiting particles */
        .orbit-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.8);
        }
        
        .particle-1 {
          animation: orbit1 4s linear infinite;
        }
        
        .particle-2 {
          animation: orbit2 5s linear infinite;
        }
        
        .particle-3 {
          animation: orbit3 6s linear infinite;
        }
        
        @keyframes orbit1 {
          from { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(55px) rotate(-120deg); }
          to { transform: rotate(480deg) translateX(55px) rotate(-480deg); }
        }
        
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(45px) rotate(-240deg); }
          to { transform: rotate(600deg) translateX(45px) rotate(-600deg); }
        }
        
        /* Text glow */
        .text-shadow-glow {
          text-shadow: 0 0 30px rgba(255,255,255,0.5);
        }
        
        /* Arrow animation */
        .arrow-bounce {
          animation: arrowBounce 1s ease-in-out infinite;
        }
        
        @keyframes arrowBounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        /* Corner accents */
        .corner-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.4);
        }
        
        .corner-accent.top-left {
          top: 12px;
          left: 12px;
          border-right: none;
          border-bottom: none;
          border-top-left-radius: 8px;
          animation: cornerPulse 2s ease-in-out infinite;
        }
        
        .corner-accent.top-right {
          top: 12px;
          right: 12px;
          border-left: none;
          border-bottom: none;
          border-top-right-radius: 8px;
          animation: cornerPulse 2s ease-in-out 0.5s infinite;
        }
        
        .corner-accent.bottom-left {
          bottom: 12px;
          left: 12px;
          border-right: none;
          border-top: none;
          border-bottom-left-radius: 8px;
          animation: cornerPulse 2s ease-in-out 1s infinite;
        }
        
        .corner-accent.bottom-right {
          bottom: 12px;
          right: 12px;
          border-left: none;
          border-top: none;
          border-bottom-right-radius: 8px;
          animation: cornerPulse 2s ease-in-out 1.5s infinite;
        }
        
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        /* Icon spin on back */
        .icon-spin {
          animation: iconSpin 10s linear infinite;
        }
        
        @keyframes iconSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Item reveal animation */
        .item-reveal {
          opacity: 0;
          animation: itemReveal 0.5s ease-out forwards;
        }
        
        @keyframes itemReveal {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .item-dot {
          animation: dotPulse 2s ease-in-out infinite;
        }
        
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        /* Animated gradient */
        .animated-gradient {
          background-size: 200% 100%;
          animation: gradientSlide 3s linear infinite;
        }
        
        @keyframes gradientSlide {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        /* Hero effects */
        .hero-mesh {
          background: 
            radial-gradient(ellipse at 20% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
        }
        
        .particle {
          background: rgba(212, 175, 55, 0.6);
          border-radius: 50%;
          animation: particleFloat 5s ease-in-out infinite;
        }
        
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% {
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-30px) translateX(10px);
            opacity: 0.6;
          }
          75% {
            opacity: 0.4;
          }
        }
        
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .hero-title {
          animation: titleReveal 1s ease-out forwards;
        }
        
        @keyframes titleReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        
        .text-gradient {
          background: linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--accent)) 50%, hsl(var(--gold)) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: textGradient 4s linear infinite;
        }
        
        @keyframes textGradient {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        
        .wave-decoration {
          background: linear-gradient(to top, hsl(var(--background)), transparent);
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 8s ease-in-out 2s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 6s ease-in-out infinite;
        }
        
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .cta-button {
          background-size: 200% 100%;
          animation: ctaGradient 3s ease infinite;
        }
        
        @keyframes ctaGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Touch feedback for mobile */
        @media (hover: none) {
          .flip-card-container:active .flip-card-front {
            transform: scale(0.98);
          }
        }
      `}</style>
    </PageTransition>
  );
}
