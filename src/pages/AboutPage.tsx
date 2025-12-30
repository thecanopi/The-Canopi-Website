import { SectionHeading } from '@/components/shared/SectionHeading';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { PageTransition } from '@/components/shared/PageTransition';
import { Eye, Zap, Users, Handshake, Lightbulb, ArrowRight, Sparkles, Target, Rocket } from 'lucide-react';
import { useState } from 'react';

const values = [
  { icon: Eye, title: 'Clarity over complexity', description: 'We cut through noise to deliver actionable insights' },
  { icon: Zap, title: 'Speed with substance', description: 'Fast execution without compromising quality' },
  { icon: Users, title: 'People over PowerPoints', description: 'Real partnerships, not just presentations' },
  { icon: Handshake, title: 'Trust-led partnerships', description: 'Building lasting relationships through integrity' },
  { icon: Lightbulb, title: 'Innovation with accountability', description: 'Bold ideas backed by measurable results' },
];

const timeline = [
  { year: 'The Beginning', title: 'Founded by Visionaries', description: 'Canopi began as a small advisory practice founded by strategists who had spent their careers inside large consulting firms and fast-growing startups.' },
  { year: 'The Gap', title: 'Identifying the Need', description: 'We saw a gap: leaders needed top-tier strategic clarity, but also hands-on partners who could help bring ideas to life — not just leave behind decks.' },
  { year: 'Growth', title: 'Expanding Our Reach', description: 'What started as a two-person advisory is now a multi-disciplinary firm working with clients across healthcare, technology, consumer services, and mission-driven sectors.' },
  { year: 'Today', title: 'Our Foundation', description: 'We remain grounded in our founding belief: great consulting is not just about expertise — it is about empathy, precision, and partnership.' },
];

export default function AboutPage() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [activeTimeline, setActiveTimeline] = useState(0);

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-emerald-deep" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_var(--tw-gradient-stops))] from-teal-mid/20 via-transparent to-transparent" />
          
          {/* Animated mesh grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              animation: 'meshMove 20s linear infinite'
            }} />
          </div>
          
          {/* Floating orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gold/15 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-mid/20 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-deep/20 rounded-full blur-3xl animate-pulse" />
          </div>
          
          {/* Sparkle particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Sparkles 
                key={i}
                className="absolute text-gold/40 animate-pulse"
                style={{
                  top: `${15 + i * 15}%`,
                  left: `${10 + i * 15}%`,
                  animationDelay: `${i * 0.5}s`,
                  width: '20px',
                  height: '20px'
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-white/80 text-sm font-medium">About Canopi Strategy Partners</span>
                </div>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={100}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight">
                  Who We <span className="text-gold">Are</span>
                </h1>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={200}>
                <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                  A modern consulting firm that helps organisations navigate 
                  complexity, accelerate growth, and transform with confidence.
                </p>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={300}>
                <div className="flex items-center justify-center gap-8 mt-12">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gold">10+</div>
                    <div className="text-white/60 text-sm">Years of Experience</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gold">50+</div>
                    <div className="text-white/60 text-sm">Clients Served</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gold">4</div>
                    <div className="text-white/60 text-sm">Industries</div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
          
          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Introduction Section */}
        <section className="py-20 md:py-28 relative overflow-hidden bg-background">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <RevealOnScroll>
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                      <Target className="w-4 h-4 text-gold" />
                      <span className="text-gold text-sm font-medium">Our Focus</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                      At the Intersection of <span className="text-gold">Strategy & Execution</span>
                    </h2>
                    <p className="text-lg text-foreground/70 leading-relaxed">
                      We sit at the intersection of strategy, operations, technology, and leadership — bringing 
                      a balanced blend of creativity, analytical discipline, and execution strength.
                    </p>
                    <p className="text-lg text-foreground/70 leading-relaxed">
                      We believe the consulting firms of the future won’t just deliver recommendations — they will build capabilities, embed intelligence, and move at the speed of change.
                    </p>
                  </div>
                </RevealOnScroll>
                
                <RevealOnScroll delayMs={200}>
                  <div className="relative">
                    {/* Decorative card stack */}
                    <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl bg-gold/10 transform rotate-3" />
                    <div className="absolute -top-2 -right-2 w-full h-full rounded-2xl bg-gold/5 transform rotate-1" />
                    <div className="relative bg-gradient-to-br from-primary to-emerald-deep rounded-2xl p-8 shadow-2xl">
                      <Rocket className="w-12 h-12 text-gold mb-6" />
                      <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
                      <p className="text-white/90 leading-relaxed">
                        To empower leaders and organisations to make smarter decisions, move faster, and unlock 
                        lasting impact through the synergy of human expertise and intelligent technology.
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-secondary to-secondary/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-medium">Our Philosophy</span>
                </div>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={100}>
                <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary leading-tight mb-8">
                  "AI won't replace leaders — but leaders who harness AI will <span className="text-gold">outperform</span>."
                </blockquote>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={200}>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We embed modern tools, data, and insights into every engagement, helping clients 
                  transform how they think, operate, and grow.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-6">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-medium">What Drives Us</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                  Our Core <span className="text-gold">Values</span>
                </h2>
              </div>
            </RevealOnScroll>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <RevealOnScroll key={index} delayMs={index * 100}>
                    <div 
                      className="group relative p-6 rounded-2xl bg-card border border-border/50 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-2 hover:border-gold/30 overflow-hidden"
                      onMouseEnter={() => setHoveredValue(index)}
                      onMouseLeave={() => setHoveredValue(null)}
                    >
                      {/* Hover background effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-gold/5 to-primary/5 transition-opacity duration-500 ${hoveredValue === index ? 'opacity-100' : 'opacity-0'}`} />
                      
                      {/* Shimmer effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${hoveredValue === index ? 'animate-shimmer' : ''}`} />
                      
                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-5 transition-all duration-500 ${hoveredValue === index ? 'scale-110 rotate-6' : ''}`}>
                          <value.icon className={`h-7 w-7 text-gold transition-all duration-300 ${hoveredValue === index ? 'scale-110' : ''}`} />
                        </div>
                        
                        <h3 className="font-bold text-lg text-primary mb-2 group-hover:text-gold transition-colors duration-300">
                          {value.title}
                        </h3>
                        
                        <p className={`text-muted-foreground text-sm leading-relaxed transition-all duration-300 ${hoveredValue === index ? 'opacity-100' : 'opacity-70'}`}>
                          {value.description}
                        </p>
                        
                        <div className={`flex items-center gap-2 mt-4 text-gold text-sm font-medium transition-all duration-300 ${hoveredValue === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                          <span>Learn more</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Story Timeline Section */}
        <section className="py-20 md:py-28 bg-background relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-delayed" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-foreground/80 text-sm font-medium">Our Journey</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  The Canopi <span className="text-gold">Story</span>
                </h2>
              </div>
            </RevealOnScroll>
            
            <div className="max-w-4xl mx-auto">
              {/* Timeline navigation */}
              <RevealOnScroll delayMs={100}>
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                  {timeline.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTimeline(index)}
                      className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                        activeTimeline === index 
                          ? 'bg-gold text-primary shadow-lg shadow-gold/30' 
                          : 'bg-primary/10 text-foreground/70 hover:bg-primary/20 hover:text-foreground'
                      }`}
                    >
                      {item.year}
                    </button>
                  ))}
                </div>
              </RevealOnScroll>
              
              {/* Active timeline content */}
              <RevealOnScroll delayMs={200}>
                <div className="relative">
                  <div className="bg-card backdrop-blur-md rounded-2xl p-8 md:p-12 border border-border shadow-2xl">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-gold font-bold text-xl">{activeTimeline + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                          {timeline[activeTimeline].title}
                        </h3>
                        <p className="text-lg text-foreground/70 leading-relaxed">
                          {timeline[activeTimeline].description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="flex gap-2 mt-8">
                      {timeline.map((_, index) => (
                        <div 
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            index === activeTimeline ? 'bg-gold' : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <RevealOnScroll>
              <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-secondary to-card rounded-3xl p-12 border border-border/50 shadow-xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Ready to Transform Your <span className="text-gold">Business</span>?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let's discuss how Canopi Strategy Partners can help you navigate complexity and unlock growth.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-primary font-bold rounded-full shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
