import { useState } from 'react';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { SectionHeading } from '@/components/shared/SectionHeading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MessageCircleQuestion, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: "What services does Canopi Strategy Partners offer?",
    answer: `Canopi Strategy Partners is a boutique consulting firm focused on strategy, transformation, and execution, primarily within the healthcare ecosystem and adjacent sectors.

Our services include corporate and business strategy, operating model redesign, digital, data and AI strategy, branding and marketing, go-to-market and growth strategy, performance improvement, and healthcare innovation and venture advisory.`,
    category: "Services"
  },
  {
    question: "How does Canopi approach consulting engagements?",
    answer: `Our approach is structured, pragmatic, and outcome-oriented. We work closely with client leadership and teams to ensure alignment with business objectives and execution realities.

A typical engagement includes:
• Understanding the context and priorities through targeted discussions and data review
• Conducting focused diagnostics on the most critical issues
• Designing clear, actionable strategies tailored to the organization
• Enabling execution through roadmaps, governance, and metrics
• Reviewing progress and refining direction as needed`,
    category: "Process"
  },
  {
    question: "What if we already understand our problems and Canopi arrives at similar conclusions?",
    answer: `We recognize that many clients have a strong understanding of their challenges. In such situations, our role is to validate assumptions, bring external perspective, identify blind spots, structure trade-offs, and help translate understanding into decisive action.

Our value lies in sharpening thinking, accelerating decision-making, and supporting execution — not repeating known insights.`,
    category: "Process"
  },
  {
    question: "Does Canopi provide only strategy, or also execution support?",
    answer: "Canopi supports both strategy development and execution. While some engagements focus on strategy, many extend into implementation support, program management, and execution enablement based on client needs.",
    category: "Services"
  },
  {
    question: "Are Canopi's solutions standardized or customized?",
    answer: "All solutions are customized. While we draw on proven frameworks and best practices, each engagement is tailored to the client's context, objectives, and constraints.",
    category: "Process"
  },
  {
    question: "What is the typical duration of a consulting project?",
    answer: `Project duration depends on scope and geography:
• Typical projects: 4–6 weeks
• Domestic expansion initiatives: Approximately 3 months
• International expansion or multi-country programs: Longer-term engagements beyond 3 months

Timelines are defined upfront and agreed with the client.`,
    category: "Engagement"
  },
  {
    question: "How does Canopi price its services?",
    answer: `Canopi follows a project-based pricing approach. Pricing depends on factors such as the type of engagement, scope, duration, expertise required, and custom client requirements.

Each engagement is scoped individually, and pricing is discussed transparently before work begins.`,
    category: "Pricing"
  },
  {
    question: "Is the proposal or initial discussion a paid service?",
    answer: "Initial conversations to understand your context and objectives are typically offered at no cost. In cases where a detailed diagnostic or in-depth assessment is required to develop a proposal, this may be chargeable and will be discussed in advance.",
    category: "Pricing"
  },
  {
    question: "Does Canopi provide PMO or program management support?",
    answer: "Yes. Canopi provides program and initiative-level support for complex transformations, expansion programs, and multi-workstream initiatives. This includes planning, tracking, coordination, and governance support.",
    category: "Services"
  },
  {
    question: "How does Canopi measure the success of its engagements?",
    answer: "Success is defined collaboratively at the start of each engagement. Measurement typically includes achievement of agreed objectives, improvement in performance indicators, execution progress, stakeholder alignment, and sustainability of outcomes.",
    category: "Process"
  },
  {
    question: "What are the typical quick wins and long-term impacts of Canopi's work?",
    answer: `Our engagements are designed to deliver both near-term and long-term value.

Quick wins often include clearer priorities, faster decisions, and early operational improvements. Long-term impact includes stronger operating models, improved execution capability, and sustained performance improvement.`,
    category: "Results"
  },
  {
    question: "How does Canopi ensure data security and confidentiality?",
    answer: "Client confidentiality is fundamental to our work. We use appropriate confidentiality agreements, controlled data access, and secure information handling practices to protect sensitive information.",
    category: "Security"
  },
  {
    question: "What is the size and expertise of the Canopi team?",
    answer: "Canopi operates with a lean, senior-led team. Our consultants bring experience from leading consulting firms, healthcare organizations, and growth-stage ventures, enabling us to combine strategic rigor with practical execution insight.",
    category: "Team"
  },
  {
    question: "How involved are client teams during an engagement?",
    answer: "Client involvement is critical to success. We work closely with leadership and core teams throughout the engagement to ensure alignment, knowledge transfer, and practical adoption of recommendations.",
    category: "Process"
  },
  {
    question: "Does Canopi work with international clients or cross-border projects?",
    answer: "Yes. Canopi supports both domestic and international engagements. For cross-border work, we adapt our approach to local market dynamics, regulatory environments, and cultural considerations.",
    category: "Engagement"
  },
  {
    question: "How does Canopi use AI in its work?",
    answer: "We use modern analytical and digital tools to strengthen analysis, accelerate execution, and improve decision quality. Our use of AI supports human judgment rather than replacing it, and is applied selectively where it adds value.",
    category: "Technology"
  },
  {
    question: "What happens after a project concludes?",
    answer: "Many clients continue working with Canopi beyond the initial engagement for follow-on support, phased implementation, or advisory guidance. Post-engagement support is defined based on client needs.",
    category: "Engagement"
  },
  {
    question: "How does Canopi manage conflicts of interest?",
    answer: "We are selective in the work we take on and avoid engagements that present conflicts of interest. Transparency and trust are central to how we operate.",
    category: "Ethics"
  }
];

const categoryColors: Record<string, string> = {
  Services: 'from-purple-500 to-purple-400',
  Process: 'from-cyan-500 to-cyan-400',
  Pricing: 'from-amber-500 to-yellow-400',
  Engagement: 'from-emerald-500 to-emerald-400',
  Results: 'from-pink-500 to-pink-400',
  Security: 'from-blue-500 to-blue-400',
  Team: 'from-indigo-500 to-indigo-400',
  Technology: 'from-orange-500 to-orange-400',
  Ethics: 'from-rose-500 to-rose-400',
};

export default function FAQsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-emerald-deep" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_var(--tw-gradient-stops))] from-teal-mid/15 via-transparent to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-teal-mid/15 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative z-10 container mx-auto px-4">
          <RevealOnScroll>
            <div className="flex flex-col items-center text-center">
              {/* Icon badge */}
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 shadow-lg shadow-gold/10">
                <MessageCircleQuestion className="w-8 h-8 text-gold" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                Find answers to common questions about working with Canopi Strategy Partners
              </p>
              
              {/* Stats bar */}
              <div className="flex items-center gap-6 mt-8 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>{faqs.length} Questions</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <span>{Object.keys(categoryColors).length} Categories</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 md:py-24 relative bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <RevealOnScroll key={index} delayMs={index * 50}>
                  <AccordionItem
                    value={`item-${index}`}
                    className={cn(
                      "group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-500",
                      "hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10",
                      hoveredIndex === index && "border-gold/60 shadow-2xl shadow-gold/15"
                    )}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Animated gradient border on hover */}
                    <div className={cn(
                      "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none",
                      "bg-gradient-to-r from-gold/20 via-purple-bright/20 to-gold/20",
                      hoveredIndex === index && "opacity-100"
                    )} style={{ padding: '1px' }}>
                      <div className="absolute inset-[1px] rounded-2xl bg-card" />
                    </div>
                    
                    {/* Shimmer effect */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none",
                      hoveredIndex === index && "opacity-100"
                    )}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative px-6 py-1">
                      <AccordionTrigger className="text-left py-5 hover:no-underline group/trigger">
                        <div className="flex items-start gap-4 w-full pr-4">
                          {/* Question number */}
                          <div className={cn(
                            "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300",
                            "bg-gradient-to-br",
                            categoryColors[faq.category] || 'from-gray-500 to-gray-400',
                            "text-white shadow-lg",
                            hoveredIndex === index && "scale-110"
                          )}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Category badge */}
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 transition-all duration-300",
                              "bg-muted text-muted-foreground",
                              hoveredIndex === index && "bg-gold/10 text-gold"
                            )}>
                              {faq.category}
                            </span>
                            
                            {/* Question */}
                            <h3 className={cn(
                              "text-lg font-semibold text-slate-900 transition-colors duration-300",
                              "group-hover/trigger:text-primary"
                            )}>
                              {faq.question}
                            </h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="pb-6">
                        <div className="pl-14">
                          <div className="relative">
                            {/* Decorative line */}
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent rounded-full" />
                            
                            <div className="pl-5 text-slate-700 whitespace-pre-line leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                </RevealOnScroll>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-deep to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <RevealOnScroll>
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-white/70 text-lg mb-8">
                If you have additional questions or would like to explore a potential engagement, our team is ready to help.
              </p>
              <a
                href="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-primary font-semibold rounded-xl hover:bg-gold-light transition-all duration-300 shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 hover:-translate-y-0.5"
              >
                Contact Our Team
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>
      
      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </main>
  );
}
