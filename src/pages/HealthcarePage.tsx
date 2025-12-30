import { useState } from 'react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { PageTransition } from '@/components/shared/PageTransition';
import { Sparkles, Building2, Shield, Lightbulb, FlaskConical, Network, Heart, ChevronRight, ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const sectors = [
  {
    id: 'providers',
    title: 'Providers',
    icon: Building2,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    items: [
      'Hospitals and Health Systems',
      'Primary Care and Ambulatory Services',
      'Specialty Care Networks',
      'Home Health and Remote Monitoring',
      'Rehabilitation and Long-Term Care',
      'Diagnostics and Imaging Centres',
    ],
  },
  {
    id: 'payers',
    title: 'Payers',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    items: [
      'Health Insurance and Managed Care Organisations',
      'Digital Payer Platforms',
      'Employer Health and Benefits Programmes',
    ],
  },
  {
    id: 'innovators',
    title: 'Innovators',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    items: [
      'Digital Health Platforms',
      'Healthcare AI Ventures',
      'Virtual Care and Telemedicine Solutions',
      'HealthTech Startups and Consumer Health Apps',
      'Remote Patient Monitoring and Connected Care Models',
    ],
  },
  {
    id: 'medtech',
    title: 'MedTech & Life Sciences',
    icon: FlaskConical,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    items: [
      'Medical Devices and MedTech Companies',
      'Pharmaceutical Services and Commercial Support',
      'Lab Services and Diagnostic Technology Providers',
    ],
  },
  {
    id: 'enablers',
    title: 'Enablers & Ecosystem Partners',
    icon: Network,
    color: 'from-teal-500 to-emerald-500',
    bgColor: 'bg-teal-500/10',
    items: [
      'Revenue Cycle and Financial Services Providers',
      'Supply Chain, Procurement, and Logistics Partners',
      'Workforce and Staffing Solutions',
      'Data, Analytics, and Health Information Systems',
      'Patient Experience and Engagement Platforms',
    ],
  },
  {
    id: 'mission',
    title: 'Mission-Driven & Public Health',
    icon: Heart,
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-rose-500/10',
    items: [
      'Public Health Organisations',
      'Community Health Centres',
      'Non-Profit Hospitals',
      'NGOs and Foundations Focused on Health Equity',
      'Population Health and Community Care Programmes',
    ],
  },
];

const howWeHelp = [
  { title: 'Operational redesign and care pathway optimisation', icon: '🔄' },
  { title: 'Workforce strategy and productivity improvement', icon: '👥' },
  { title: 'Patient experience transformation', icon: '💫' },
  { title: 'Digital adoption and AI-enabled care', icon: '🤖' },
  { title: 'Revenue cycle and cost management', icon: '💰' },
  { title: 'Clinical and non-clinical performance improvement', icon: '📈' },
];

const impactStories = [
  {
    title: 'A 650-bed health system',
    description: 'We led a performance improvement programme that reduced operating costs by 18%, redesigned patient access workflows, and improved emergency department throughput.',
    stat: '18%',
    statLabel: 'Cost Reduction',
  },
  {
    title: 'Multi-specialty physician network',
    description: 'We developed a digital transformation roadmap that doubled telehealth adoption and improved patient satisfaction.',
    stat: '2x',
    statLabel: 'Telehealth Adoption',
  },
  {
    title: 'HealthTech startup',
    description: 'We built a pricing and commercialisation strategy for a remote monitoring solution that supported a successful funding raise.',
    stat: '$10M+',
    statLabel: 'Funding Raised',
  },
];

function SectorCard({ sector, index, isActive, onHover }: { 
  sector: typeof sectors[0]; 
  index: number; 
  isActive: boolean;
  onHover: () => void;
}) {
  const Icon = sector.icon;
  
  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-500",
        "rounded-2xl border-2 overflow-hidden",
        isActive 
          ? "border-accent shadow-xl scale-[1.02]" 
          : "border-border/50 hover:border-accent/50 hover:shadow-lg"
      )}
      onMouseEnter={onHover}
    >
      {/* Background gradient on hover/active */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-500",
        isActive && "opacity-100",
        `bg-gradient-to-br ${sector.color}`
      )} style={{ opacity: isActive ? 0.05 : 0 }} />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute top-0 -left-full w-full h-full transition-all duration-1000",
          "bg-gradient-to-r from-transparent via-white/5 to-transparent",
          isActive && "left-full"
        )} />
      </div>
      
      <div className="relative p-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Icon with gradient background */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-br shadow-lg",
            sector.color,
            isActive && "scale-110"
          )}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          {/* Number badge */}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">Sector {String(index + 1).padStart(2, '0')}</span>
            <h3 className={cn(
              "text-lg font-serif font-bold transition-colors duration-300",
              isActive ? "text-accent" : "text-primary"
            )}>
              {sector.title}
            </h3>
          </div>
          
          {/* Arrow indicator */}
          <ChevronRight className={cn(
            "ml-auto w-5 h-5 transition-all duration-300",
            isActive ? "text-accent translate-x-1" : "text-muted-foreground"
          )} />
        </div>
        
        {/* Items list - expanded on active */}
        <div className={cn(
          "grid transition-all duration-500 overflow-hidden",
          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="min-h-0">
            <ul className="space-y-2 pt-4 border-t border-border/50">
              {sector.items.map((item, i) => (
                <li 
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r",
                    sector.color
                  )} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HealthcarePage() {
  const [activeSector, setActiveSector] = useState<string>('providers');

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Animated backgrounds */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-light/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(234,176,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,176,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6 border border-accent/30">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Industry Focus</span>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delayMs={100}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
                  Healthcare
                </h1>
              </RevealOnScroll>
              <RevealOnScroll delayMs={200}>
                <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                  We help healthcare organisations transform how they operate, deliver 
                  care, and create value for patients, clinicians, and communities.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Where We Work - Modern Interactive Section */}
        <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-background to-secondary/50">
          <div className="absolute top-40 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-48 h-48 bg-teal-light/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Where We Work" 
              subtitle="Tap on any sector to explore the organizations we partner with"
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {sectors.map((sector, index) => (
                <RevealOnScroll key={sector.id} delayMs={index * 80}>
                  <SectorCard 
                    sector={sector} 
                    index={index}
                    isActive={activeSector === sector.id}
                    onHover={() => setActiveSector(sector.id)}
                  />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* How We Help - Modern Grid */}
        <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-teal-light/10 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-4">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <div className="gold-accent-line mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How We Help</h2>
                <p className="text-primary-foreground/70 max-w-xl mx-auto">
                  Our comprehensive approach addresses the full spectrum of healthcare challenges
                </p>
              </div>
            </RevealOnScroll>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {howWeHelp.map((item, index) => (
                <RevealOnScroll key={index} delayMs={index * 75}>
                  <div className="group relative p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:border-accent/50 hover:bg-primary-foreground/10 transition-all duration-300 cursor-default">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300" />
                    
                    <div className="relative flex items-start gap-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      <div>
                        <span className="text-xs text-accent font-medium">0{index + 1}</span>
                        <p className="text-sm font-medium text-primary-foreground/90 group-hover:text-primary-foreground transition-colors">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stories - Modern Cards */}
        <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background">
          <div className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Impact Stories" 
              subtitle="Real transformations delivering measurable results"
            />
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {impactStories.map((story, index) => (
                <RevealOnScroll key={index} delayMs={index * 100}>
                  <div className="group relative h-full">
                    {/* Card */}
                    <div className="relative h-full rounded-2xl border-2 border-border/50 bg-card overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:-translate-y-2">
                      {/* Top accent gradient */}
                      <div className="h-2 bg-gradient-to-r from-accent via-gold-light to-accent" />
                      
                      {/* Stat badge */}
                      <div className="absolute top-6 right-6">
                        <div className="text-center p-3 rounded-xl bg-accent/10 border border-accent/20">
                          <div className="text-2xl font-bold text-accent">{story.stat}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{story.statLabel}</div>
                        </div>
                      </div>
                      
                      <div className="p-6 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="text-xs font-medium text-muted-foreground">Case Study 0{index + 1}</span>
                        </div>
                        
                        <h3 className="text-lg font-serif font-bold text-primary mb-3 pr-24 group-hover:text-accent transition-colors">
                          {story.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {story.description}
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <button className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-gold-light transition-colors group/btn">
                            Learn more 
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-teal-darker" />
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
          
          <div className="container mx-auto px-4 relative z-10">
            <RevealOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                  Ready to Transform Your Healthcare Organization?
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8">
                  Let's discuss how we can help you achieve operational excellence and better patient outcomes.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-105"
                >
                  Get Started
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
