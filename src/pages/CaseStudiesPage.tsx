import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Quote, Sparkles, Target, TrendingUp, Building2, Zap, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/shared/PageTransition';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';

interface CaseStudy {
  id: string;
  title: string;
  industry: string | null;
  challenge: string;
  solution: string;
  outcome: string;
  tags: string[] | null;
  display_order: number | null;
}

const industryIcons: Record<string, React.ReactNode> = {
  'Healthcare': <Building2 className="h-5 w-5" />,
  'AI Innovation': <Sparkles className="h-5 w-5" />,
  'Life Sciences': <Target className="h-5 w-5" />,
  'HealthTech': <TrendingUp className="h-5 w-5" />,
  'Market Research': <TrendingUp className="h-5 w-5" />,
  'Education': <Building2 className="h-5 w-5" />,
};

const industryColors: Record<string, { gradient: string; bg: string; glow: string }> = {
  'Healthcare': { gradient: 'from-purple-600 to-purple-400', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/20' },
  'AI Innovation': { gradient: 'from-gold to-amber-500', bg: 'bg-gold/10', glow: 'shadow-gold/20' },
  'Life Sciences': { gradient: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
  'HealthTech': { gradient: 'from-blue-600 to-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20' },
  'Market Research': { gradient: 'from-orange-600 to-orange-400', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20' },
  'Education': { gradient: 'from-pink-600 to-pink-400', bg: 'bg-pink-500/10', glow: 'shadow-pink-500/20' },
};

function CaseStudyCard({ 
  study, 
  index, 
  isExpanded, 
  onToggle 
}: { 
  study: CaseStudy; 
  index: number; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const colors = study.industry ? industryColors[study.industry] || { gradient: 'from-primary to-primary/70', bg: 'bg-primary/10', glow: 'shadow-primary/20' } : { gradient: 'from-primary to-primary/70', bg: 'bg-primary/10', glow: 'shadow-primary/20' };
  const isEven = index % 2 === 0;

  return (
    <RevealOnScroll delayMs={index * 80}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer",
          "border-2 border-border/30",
          isEven ? "bg-card" : "bg-secondary/50",
          "hover:border-accent/50",
          isExpanded ? "shadow-2xl" : "hover:shadow-xl",
          colors.glow,
          isExpanded && "ring-2 ring-accent/30"
        )}
        onClick={onToggle}
      >
        {/* Animated gradient border on hover */}
        <div className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          "bg-gradient-to-r p-[2px]",
          colors.gradient
        )}>
          <div className={cn("absolute inset-[2px] rounded-[22px]", isEven ? "bg-card" : "bg-secondary/80")} />
        </div>
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="shimmer-case-study" />
        </div>

        {/* Floating background accent */}
        <div className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700",
          colors.bg
        )} />
        <div className={cn(
          "absolute -bottom-20 -left-20 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700",
          colors.bg
        )} />

        <div className="relative p-6 md:p-8 lg:p-10">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Case Study Number Badge */}
              <div className={cn(
                "flex items-center justify-center w-14 h-14 rounded-2xl font-serif font-bold text-xl text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300",
                "bg-gradient-to-br",
                colors.gradient
              )}>
                {String(index + 1).padStart(2, '0')}
              </div>
              
              {/* Industry Badge */}
              {study.industry && (
                <span className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                  "bg-gradient-to-r text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300",
                  colors.gradient
                )}>
                  {industryIcons[study.industry]}
                  {study.industry}
                </span>
              )}
            </div>

            {/* Expand Button with animation */}
            <button className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500",
              "bg-secondary hover:bg-accent hover:text-primary-foreground",
              "group-hover:shadow-lg",
              isExpanded && "bg-accent text-primary-foreground rotate-180 shadow-lg shadow-accent/30"
            )}>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Title with animated underline */}
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-primary group-hover:text-accent transition-colors duration-300 relative inline-block">
              Case Study {index + 1}: {study.title}
              <span className={cn(
                "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r transition-all duration-500",
                colors.gradient,
                isExpanded ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </h3>
          </div>

          {/* Tags with stagger animation */}
          {study.tags && study.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {study.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 text-xs font-medium rounded-full bg-muted/80 text-muted-foreground border border-border/50 transform group-hover:scale-105 transition-transform duration-300"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Challenge Preview with icon */}
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1",
              colors.bg
            )}>
              <Target className={cn("h-4 w-4", isEven ? "text-primary" : "text-accent")} />
            </div>
            <p className={cn(
              "text-muted-foreground leading-relaxed transition-all duration-300",
              isExpanded ? "" : "line-clamp-2"
            )}>
              <span className="font-semibold text-primary">Challenge: </span>
              {study.challenge}
            </p>
          </div>

          {/* Expanded Content with smooth animation */}
          <div className={cn(
            "grid transition-all duration-500 ease-out overflow-hidden",
            isExpanded ? "grid-rows-[1fr] opacity-100 mt-8" : "grid-rows-[0fr] opacity-0 mt-0"
          )}>
            <div className="min-h-0">
              <div className="pt-8 border-t border-border/50">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Solution */}
                  <div className={cn(
                    "relative p-6 rounded-2xl border border-border/30 transition-all duration-300 hover:shadow-lg",
                    colors.bg
                  )}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white",
                        "bg-gradient-to-br",
                        colors.gradient
                      )}>
                        <Zap className="h-5 w-5" />
                      </div>
                      <h4 className="text-lg font-bold text-primary">Solution</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {study.solution}
                    </p>
                  </div>

                  {/* Outcome */}
                  <div className="relative p-6 rounded-2xl border border-border/30 bg-green-500/5 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-lg text-white">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <h4 className="text-lg font-bold text-primary">Outcome</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {study.outcome}
                    </p>
                  </div>
                </div>

                {/* Read more CTA */}
                <div className="mt-6 flex justify-end">
                  <button className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                    "bg-gradient-to-r",
                    colors.gradient
                  )}>
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left",
          "bg-gradient-to-r",
          colors.gradient
        )} />
      </div>
    </RevealOnScroll>
  );
}

export default function CaseStudiesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
  const res = await fetch("/api/case-studies");
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Failed to load case studies");
  return (json.data || []) as CaseStudy[];
},

  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
  const res = await fetch("/api/testimonials");
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Failed to load testimonials");
  return json.data || [];
},

  });

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          {/* Animated orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/20 text-accent mb-8 border border-accent/30 backdrop-blur-sm hover:scale-105 transition-transform">
                  <Sparkles className="h-4 w-4 animate-spin-slow" />
                  <span className="text-sm font-medium uppercase tracking-wider">Our Work</span>
                </div>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={100}>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-primary-foreground mb-6">
                  Case <span className="text-gradient">Studies</span>
                </h1>
              </RevealOnScroll>
              
              <RevealOnScroll delayMs={200}>
                <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
                  Real transformations. Measurable results. Lasting partnerships across Healthcare, AI, Life Sciences, and beyond.
                </p>
              </RevealOnScroll>

              {/* Stats with animation */}
              <RevealOnScroll delayMs={300}>
                <div className="grid grid-cols-3 gap-8 mt-12 max-w-xl mx-auto">
                  {[
                    { value: '12+', label: 'Case Studies' },
                    { value: '6', label: 'Industries' },
                    { value: '40%+', label: 'Avg. Improvement' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center group cursor-default">
                      <div className="text-3xl md:text-4xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                      <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Case Studies Section */}
        <section className="py-20 md:py-28 bg-background relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-40 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <RevealOnScroll>
              <div className="max-w-4xl mx-auto mb-12 text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
                  Explore Our <span className="text-gradient">Success Stories</span>
                </h2>
                <p className="text-muted-foreground">
                  Click on any case study to expand and see the full details
                </p>
              </div>
            </RevealOnScroll>

            {isLoading ? (
              <div className="max-w-5xl mx-auto space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-3xl" />
                ))}
              </div>
            ) : caseStudies && caseStudies.length > 0 ? (
              <div className="max-w-5xl mx-auto space-y-8">
                {caseStudies.map((study, index) => (
                  <CaseStudyCard 
                    key={study.id} 
                    study={study} 
                    index={index} 
                    isExpanded={expandedId === study.id}
                    onToggle={() => handleToggle(study.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No case studies available yet.
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-secondary via-secondary to-secondary/80 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <RevealOnScroll>
              <div className="max-w-4xl mx-auto mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6 border border-accent/20">
                  <Quote className="h-4 w-4" />
                  <span className="text-sm font-medium">Testimonials</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                  What Our <span className="text-gradient">Clients Say</span>
                </h2>
                <p className="text-muted-foreground">
                  Trusted by leaders across industries
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonialsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))
              ) : testimonials && testimonials.length > 0 ? (
                testimonials.map((testimonial, index) => (
                  <RevealOnScroll key={testimonial.id} delayMs={index * 100}>
                    <div className="group relative p-8 rounded-3xl bg-card border-2 border-border/30 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 overflow-hidden">
                      {/* Decorative gradient */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <Quote className="h-10 w-10 text-accent/30 mb-4 group-hover:text-accent/60 group-hover:scale-110 transition-all duration-300" />
                      <blockquote className="text-lg text-primary font-serif italic mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <p className="text-sm text-muted-foreground font-medium">
                        — {testimonial.author_role}
                      </p>

                      {/* Bottom accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-accent to-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </RevealOnScroll>
                ))
              ) : (
                <p className="text-center text-muted-foreground col-span-2">
                  No testimonials available yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Custom animations */}
      <style>{`
        .shimmer-case-study {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          transition: left 0.5s ease;
        }
        
        .group:hover .shimmer-case-study {
          left: 100%;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }

        .text-gradient {
          background: linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--accent)) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </PageTransition>
  );
}
