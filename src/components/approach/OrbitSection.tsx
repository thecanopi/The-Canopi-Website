import { useState, useEffect, useRef } from 'react';
import { Target, Brain, Sparkles, Rocket, GraduationCap, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    id: 'diagnose',
    number: '01',
    shortTitle: 'Diagnose',
    title: 'Diagnose with depth.',
    description: 'We begin by understanding your business from every angle — people, processes, data, and the market — to uncover the core problems and root opportunities.',
    icon: Target,
    color: 'from-purple-500 to-purple-400',
    glowColor: 'purple',
    strokeColor: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  {
    id: 'cocreate',
    number: '02',
    shortTitle: 'Co-create',
    title: 'Co-create solutions with you.',
    description: 'We build strategies with teams, not for them. This accelerates buy-in and reduces time to implementation.',
    icon: Brain,
    color: 'from-cyan-500 to-cyan-400',
    glowColor: 'cyan',
    strokeColor: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.5)',
  },
  {
    id: 'ai',
    number: '03',
    shortTitle: 'AI & Analytics',
    title: 'Use AI and analytics as force multipliers.',
    description: 'From forecasting and modelling to automation and workflow intelligence — we integrate advanced tools where they create the highest lift.',
    icon: Sparkles,
    color: 'from-amber-500 to-yellow-400',
    glowColor: 'amber',
    strokeColor: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  {
    id: 'execute',
    number: '04',
    shortTitle: 'Execute',
    title: 'Execute with precision.',
    description: 'Our teams embed alongside your teams to translate plans into actions, KPIs, and measurable outcomes.',
    icon: Rocket,
    color: 'from-emerald-500 to-emerald-400',
    glowColor: 'emerald',
    strokeColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  {
    id: 'transfer',
    number: '05',
    shortTitle: 'Transfer',
    title: 'Transfer capability.',
    description: 'We aim to leave you smarter, faster, and more independent than when we arrived.',
    icon: GraduationCap,
    color: 'from-pink-500 to-pink-400',
    glowColor: 'pink',
    strokeColor: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.5)',
  },
];

export function OrbitSection() {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [visibleNodes, setVisibleNodes] = useState<string[]>([]);
  const [centerVisible, setCenterVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbitRadius = 180;

  // Staggered load animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setCenterVisible(true), 100);
            steps.forEach((step, index) => {
              setTimeout(() => {
                setVisibleNodes((prev) => [...prev, step.id]);
              }, 400 + index * 150);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Click outside to close tooltip on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.orbit-node') && !target.closest('.orbit-tooltip')) {
        setActiveNodeId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleNodeInteraction = (stepId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if ('ontouchstart' in window) {
      setActiveNodeId(activeNodeId === stepId ? null : stepId);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden min-h-[700px] lg:min-h-[800px]"
    >
      {/* Dark futuristic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/80 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_var(--tw-gradient-stops))] from-purple-900/30 via-purple-950/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      
      {/* Subtle particle/glow effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Desktop Orbit View */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-[500px] h-[500px]">
            {/* Orbit rings */}
            <div 
              className="absolute inset-0 rounded-full border border-purple-500/20"
              style={{
                opacity: centerVisible ? 1 : 0,
                transform: centerVisible ? 'scale(1)' : 'scale(0.8)',
                transition: 'opacity 600ms ease-out, transform 600ms ease-out',
              }}
            />
            <div 
              className="absolute inset-8 rounded-full border border-purple-500/10"
              style={{
                opacity: centerVisible ? 1 : 0,
                transform: centerVisible ? 'scale(1)' : 'scale(0.85)',
                transition: 'opacity 700ms ease-out 100ms, transform 700ms ease-out 100ms',
              }}
            />

            {/* SVG for connector lines and signal animations */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
              <defs>
                {/* Gradient definitions for each line */}
                {steps.map((step) => (
                  <linearGradient 
                    key={`gradient-${step.id}`} 
                    id={`lineGradient-${step.id}`} 
                    x1="0%" 
                    y1="0%" 
                    x2="100%" 
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={step.strokeColor} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={step.strokeColor} stopOpacity="0.4" />
                  </linearGradient>
                ))}
                
                {/* Glow filter for active lines */}
                <filter id="lineGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Signal dot glow */}
                <filter id="signalGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Bigger bubble glow for hover */}
                <filter id="bubbleGlow" x="-300%" y="-300%" width="700%" height="700%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {steps.map((step, index) => {
                const angleRad = ((index * 72) - 90) * (Math.PI / 180);
                const x = 250 + orbitRadius * Math.cos(angleRad);
                const y = 250 + orbitRadius * Math.sin(angleRad);
                const isActive = activeNodeId === step.id;
                const isVisible = visibleNodes.includes(step.id);
                
                const pathId = `path-${step.id}`;
                
                return (
                  <g key={step.id}>
                    {/* Path definition for animateMotion */}
                    <path
                      id={pathId}
                      d={`M 250 250 L ${x} ${y}`}
                      fill="none"
                      stroke="none"
                    />
                    
                    {/* Background connector line */}
                    <line
                      x1="250"
                      y1="250"
                      x2={x}
                      y2={y}
                      stroke={step.strokeColor}
                      strokeWidth="1"
                      style={{
                        opacity: isVisible ? 0.25 : 0,
                        transition: 'opacity 400ms ease-out',
                      }}
                    />
                    
                    {/* Active/hover connector line with glow */}
                    <line
                      x1="250"
                      y1="250"
                      x2={x}
                      y2={y}
                      stroke={`url(#lineGradient-${step.id})`}
                      strokeWidth={isActive ? 4 : 1}
                      filter={isActive ? 'url(#lineGlow)' : 'none'}
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 300ms ease-in-out, stroke-width 300ms ease-in-out',
                      }}
                    />

                    {/* Multiple always-on signal pulses - traveling dots (faster, more quantity) */}
                    {isVisible && (
                      <>
                        {/* First bubble */}
                        <circle r="3" fill={step.strokeColor} filter="url(#signalGlow)" opacity="0.8">
                          <animateMotion dur={`${1.2 + index * 0.1}s`} repeatCount="indefinite" begin={`${index * 0.15}s`}>
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;0.9;0.9;0" dur={`${1.2 + index * 0.1}s`} repeatCount="indefinite" begin={`${index * 0.15}s`} />
                          <animate attributeName="r" values="2;4;4;2" dur={`${1.2 + index * 0.1}s`} repeatCount="indefinite" begin={`${index * 0.15}s`} />
                        </circle>
                        {/* Second bubble */}
                        <circle r="2.5" fill={step.strokeColor} filter="url(#signalGlow)" opacity="0.7">
                          <animateMotion dur={`${1.4 + index * 0.12}s`} repeatCount="indefinite" begin={`${0.5 + index * 0.2}s`}>
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${1.4 + index * 0.12}s`} repeatCount="indefinite" begin={`${0.5 + index * 0.2}s`} />
                          <animate attributeName="r" values="2;3;3;2" dur={`${1.4 + index * 0.12}s`} repeatCount="indefinite" begin={`${0.5 + index * 0.2}s`} />
                        </circle>
                        {/* Third bubble */}
                        <circle r="2" fill={step.strokeColor} filter="url(#signalGlow)" opacity="0.6">
                          <animateMotion dur={`${1.0 + index * 0.08}s`} repeatCount="indefinite" begin={`${1.0 + index * 0.25}s`}>
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${1.0 + index * 0.08}s`} repeatCount="indefinite" begin={`${1.0 + index * 0.25}s`} />
                          <animate attributeName="r" values="1.5;2.5;2.5;1.5" dur={`${1.0 + index * 0.08}s`} repeatCount="indefinite" begin={`${1.0 + index * 0.25}s`} />
                        </circle>
                      </>
                    )}

                    {/* Multiple bigger bubble packets on hover */}
                    {isActive && (
                      <>
                        <circle r="10" fill={step.strokeColor} filter="url(#bubbleGlow)">
                          <animateMotion dur="0.6s" repeatCount="indefinite">
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;1;1;0" dur="0.6s" repeatCount="indefinite" />
                        </circle>
                        <circle r="7" fill={step.strokeColor} filter="url(#bubbleGlow)">
                          <animateMotion dur="0.6s" repeatCount="indefinite" begin="0.2s">
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="0.6s" repeatCount="indefinite" begin="0.2s" />
                        </circle>
                        <circle r="5" fill={step.strokeColor} filter="url(#bubbleGlow)">
                          <animateMotion dur="0.6s" repeatCount="indefinite" begin="0.4s">
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;0.8;0.8;0" dur="0.6s" repeatCount="indefinite" begin="0.4s" />
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Center node */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                opacity: centerVisible ? 1 : 0,
                transform: centerVisible 
                  ? 'translate(-50%, -50%) scale(1)' 
                  : 'translate(-50%, -50%) scale(0.9)',
                transition: 'opacity 500ms ease-out, transform 500ms ease-out',
              }}
            >
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 flex items-center justify-center shadow-2xl shadow-purple-500/40">
                <div className="absolute inset-0 rounded-full border-2 border-purple-300/40" />
                <div className="absolute inset-2 rounded-full border border-purple-400/20" />
                <div className="absolute -inset-2 rounded-full bg-purple-500/20 blur-xl -z-10" />
                <span className="text-white font-serif font-bold text-center text-lg px-4 leading-tight">
                  How We<br />Work
                </span>
              </div>
            </div>

            {/* Orbit nodes */}
            {steps.map((step, index) => {
              const Icon = step.icon;
              const angleRad = ((index * 72) - 90) * (Math.PI / 180);
              const x = orbitRadius * Math.cos(angleRad);
              const y = orbitRadius * Math.sin(angleRad);
              const isActive = activeNodeId === step.id;
              const isVisible = visibleNodes.includes(step.id);

              // Calculate tooltip position based on node position - avoid overlapping other nodes
              const tooltipPosition = () => {
                // Top node - show below
                if (index === 0) return 'top-full mt-4 left-1/2 -translate-x-1/2';
                // Right side nodes - show to the right
                if (index === 1) return 'left-full ml-4 top-0';
                if (index === 2) return 'left-full ml-4 bottom-0';
                // Left side nodes - show to the left
                if (index === 3) return 'right-full mr-4 bottom-0';
                return 'right-full mr-4 top-0';
              };

              return (
                <div
                  key={step.id}
                  className="orbit-node absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 400ms ease-out',
                    zIndex: isActive ? 100 : 30,
                  }}
                  onMouseEnter={() => setActiveNodeId(step.id)}
                  onMouseLeave={() => setActiveNodeId(null)}
                  onClick={(e) => handleNodeInteraction(step.id, e)}
                >
                  {/* Node circle with wave rings on hover */}
                  <div className="relative">
                    {/* Wave rings that expand on hover */}
                    {isActive && (
                      <>
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            backgroundColor: step.strokeColor,
                            opacity: 0.2,
                            animationDuration: '1s',
                          }}
                        />
                        <div 
                          className="absolute -inset-2 rounded-full animate-ping"
                          style={{
                            backgroundColor: step.strokeColor,
                            opacity: 0.15,
                            animationDuration: '1.3s',
                            animationDelay: '0.2s',
                          }}
                        />
                        <div 
                          className="absolute -inset-4 rounded-full animate-ping"
                          style={{
                            backgroundColor: step.strokeColor,
                            opacity: 0.1,
                            animationDuration: '1.6s',
                            animationDelay: '0.4s',
                          }}
                        />
                      </>
                    )}
                    
                    <div
                      className={cn(
                        "relative w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center cursor-pointer",
                        step.color
                      )}
                      style={{
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isActive 
                          ? `0 0 50px ${step.strokeColor}70, 0 0 100px ${step.strokeColor}40` 
                          : `0 8px 24px rgba(0,0,0,0.3)`,
                        transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out',
                      }}
                    >
                      {/* Border that glows on hover */}
                      <div 
                        className="absolute inset-0 rounded-full border-2"
                        style={{
                          borderColor: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                          transition: 'border-color 300ms ease-in-out',
                        }}
                      />
                      {/* Icon with rotation on hover */}
                      <Icon 
                        className="h-7 w-7 text-white relative z-10"
                        style={{
                          animation: isActive ? 'spin 2s linear infinite' : 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Short label below node */}
                  <div 
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: 'opacity 400ms ease-out 200ms',
                    }}
                  >
                    <span className="text-white/90 text-sm font-medium">
                      {step.shortTitle}
                    </span>
                  </div>

                  {/* Glassmorphism Tooltip with node color theme */}
                  <div
                    className={cn(
                      "orbit-tooltip absolute w-80 p-5 rounded-2xl",
                      tooltipPosition()
                    )}
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1)' : 'scale(0.95)',
                      pointerEvents: isActive ? 'auto' : 'none',
                      transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
                      background: step.bgColor,
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: `2px solid ${step.borderColor}`,
                      boxShadow: `0 0 40px ${step.strokeColor}30, 0 25px 50px -12px rgba(0,0,0,0.5)`,
                      zIndex: 200,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Neon border glow */}
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 30px ${step.strokeColor}15`,
                      }}
                    />
                    
                    {/* Close button */}
                    <button
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: `${step.strokeColor}30`,
                        color: step.strokeColor,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveNodeId(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    
                    {/* Top accent line */}
                    <div 
                      className={cn(
                        "absolute top-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r",
                        step.color
                      )}
                    />
                    
                    {/* Step number */}
                    <div 
                      className="text-xs font-bold mb-2"
                      style={{ color: step.strokeColor }}
                    >
                      Step {step.number}
                    </div>
                    
                    {/* Full headline in node color */}
                    <h4 
                      className="font-serif font-bold text-lg mb-3 pr-6"
                      style={{ color: step.strokeColor }}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Orbit View - Same as desktop but with tap */}
        <div className="lg:hidden flex items-center justify-center py-8">
          <div className="relative w-[340px] h-[340px]">
            {/* Orbit rings */}
            <div 
              className="absolute inset-0 rounded-full border border-purple-500/20"
              style={{
                opacity: centerVisible ? 1 : 0,
                transform: centerVisible ? 'scale(1)' : 'scale(0.8)',
                transition: 'opacity 600ms ease-out, transform 600ms ease-out',
              }}
            />

            {/* SVG for connector lines and signal animations */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 340">
              <defs>
                {steps.map((step) => (
                  <linearGradient 
                    key={`mobile-gradient-${step.id}`} 
                    id={`mobileLineGradient-${step.id}`} 
                    x1="0%" 
                    y1="0%" 
                    x2="100%" 
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={step.strokeColor} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={step.strokeColor} stopOpacity="0.4" />
                  </linearGradient>
                ))}
                <filter id="mobileLineGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="mobileSignalGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="mobileBubbleGlow" x="-300%" y="-300%" width="700%" height="700%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {steps.map((step, index) => {
                const mobileRadius = 120;
                const angleRad = ((index * 72) - 90) * (Math.PI / 180);
                const x = 170 + mobileRadius * Math.cos(angleRad);
                const y = 170 + mobileRadius * Math.sin(angleRad);
                const isActive = activeNodeId === step.id;
                const isVisible = visibleNodes.includes(step.id);
                const pathId = `mobile-path-${step.id}`;
                
                return (
                  <g key={step.id}>
                    <path id={pathId} d={`M 170 170 L ${x} ${y}`} fill="none" stroke="none" />
                    <line x1="170" y1="170" x2={x} y2={y} stroke={step.strokeColor} strokeWidth="1"
                      style={{ opacity: isVisible ? 0.25 : 0, transition: 'opacity 400ms ease-out' }}
                    />
                    <line x1="170" y1="170" x2={x} y2={y} stroke={`url(#mobileLineGradient-${step.id})`}
                      strokeWidth={isActive ? 3 : 1} filter={isActive ? 'url(#mobileLineGlow)' : 'none'}
                      style={{ opacity: isActive ? 1 : 0, transition: 'opacity 300ms ease-in-out' }}
                    />
                    {isVisible && (
                      <>
                        <circle r="2" fill={step.strokeColor} filter="url(#mobileSignalGlow)" opacity="0.8">
                          <animateMotion dur={`${1.2 + index * 0.1}s`} repeatCount="indefinite" begin={`${index * 0.15}s`}>
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;0.9;0.9;0" dur={`${1.2 + index * 0.1}s`} repeatCount="indefinite" begin={`${index * 0.15}s`} />
                        </circle>
                        <circle r="1.5" fill={step.strokeColor} filter="url(#mobileSignalGlow)" opacity="0.6">
                          <animateMotion dur={`${1.0 + index * 0.08}s`} repeatCount="indefinite" begin={`${0.5 + index * 0.2}s`}>
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${1.0 + index * 0.08}s`} repeatCount="indefinite" begin={`${0.5 + index * 0.2}s`} />
                        </circle>
                      </>
                    )}
                    {isActive && (
                      <>
                        <circle r="6" fill={step.strokeColor} filter="url(#mobileBubbleGlow)">
                          <animateMotion dur="0.6s" repeatCount="indefinite">
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;1;1;0" dur="0.6s" repeatCount="indefinite" />
                        </circle>
                        <circle r="4" fill={step.strokeColor} filter="url(#mobileBubbleGlow)">
                          <animateMotion dur="0.6s" repeatCount="indefinite" begin="0.2s">
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="0.6s" repeatCount="indefinite" begin="0.2s" />
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Center node */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                opacity: centerVisible ? 1 : 0,
                transform: centerVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.9)',
                transition: 'opacity 500ms ease-out, transform 500ms ease-out',
              }}
            >
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 flex items-center justify-center shadow-xl shadow-purple-500/30">
                <div className="absolute inset-0 rounded-full border-2 border-purple-300/40" />
                <div className="absolute -inset-1 rounded-full bg-purple-500/20 blur-lg -z-10" />
                <span className="text-white font-serif font-bold text-center text-sm px-2 leading-tight">
                  How We<br />Work
                </span>
              </div>
            </div>

            {/* Mobile Orbit nodes */}
            {steps.map((step, index) => {
              const Icon = step.icon;
              const mobileRadius = 120;
              const angleRad = ((index * 72) - 90) * (Math.PI / 180);
              const x = mobileRadius * Math.cos(angleRad);
              const y = mobileRadius * Math.sin(angleRad);
              const isActive = activeNodeId === step.id;
              const isVisible = visibleNodes.includes(step.id);

              return (
                <div
                  key={step.id}
                  className="orbit-node absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 400ms ease-out',
                    zIndex: isActive ? 100 : 30,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveNodeId(activeNodeId === step.id ? null : step.id);
                  }}
                >
                  <div className="relative">
                    {isActive && (
                      <>
                        <div className="absolute inset-0 rounded-full animate-ping"
                          style={{ backgroundColor: step.strokeColor, opacity: 0.2, animationDuration: '1s' }}
                        />
                        <div className="absolute -inset-2 rounded-full animate-ping"
                          style={{ backgroundColor: step.strokeColor, opacity: 0.15, animationDuration: '1.3s', animationDelay: '0.2s' }}
                        />
                      </>
                    )}
                    
                    <div
                      className={cn("relative w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center cursor-pointer", step.color)}
                      style={{
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isActive ? `0 0 40px ${step.strokeColor}70` : '0 6px 20px rgba(0,0,0,0.3)',
                        transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out',
                      }}
                    >
                      <div className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', transition: 'border-color 300ms ease-in-out' }}
                      />
                      <Icon className="h-5 w-5 text-white relative z-10" style={{ animation: isActive ? 'spin 2s linear infinite' : 'none' }} />
                    </div>
                  </div>

                  {/* Short label - only visible when not active */}
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                    style={{ opacity: isVisible && !isActive ? 1 : 0, transition: 'opacity 300ms ease-out' }}
                  >
                    <span className="text-white/80 text-xs font-medium">{step.shortTitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Tooltip - Positioned within section, above footer */}
        {activeNodeId && (
          <div className="lg:hidden mt-8 px-4 pb-4">
            {steps.filter(s => s.id === activeNodeId).map((step) => (
              <div
                key={step.id}
                className="orbit-tooltip relative p-5 rounded-2xl mx-auto max-w-md animate-scale-in"
                style={{
                  background: `linear-gradient(135deg, ${step.bgColor}, rgba(15, 10, 30, 0.95))`,
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: `2px solid ${step.borderColor}`,
                  boxShadow: `0 0 60px ${step.strokeColor}40, 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative glow */}
                <div className="absolute -inset-1 rounded-2xl opacity-50 -z-10" style={{ background: `radial-gradient(ellipse at center, ${step.strokeColor}20, transparent 70%)` }} />
                
                {/* Top accent line */}
                <div className={cn("absolute top-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r", step.color)} />
                
                {/* Close button */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: `${step.strokeColor}25`, 
                    color: step.strokeColor,
                    border: `1px solid ${step.strokeColor}40`
                  }}
                  onClick={(e) => { e.stopPropagation(); setActiveNodeId(null); }}
                >
                  <X className="h-4 w-4" />
                </button>
                
                {/* Step badge */}
                <div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{ 
                    backgroundColor: `${step.strokeColor}20`,
                    color: step.strokeColor,
                    border: `1px solid ${step.strokeColor}30`
                  }}
                >
                  Step {step.number}
                </div>
                
                {/* Title with icon */}
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${step.strokeColor}30, ${step.strokeColor}10)`,
                      border: `1px solid ${step.strokeColor}40`
                    }}
                  >
                    <step.icon className="h-5 w-5" style={{ color: step.strokeColor }} />
                  </div>
                  <h4 className="font-serif font-bold text-lg leading-tight pr-6" style={{ color: step.strokeColor }}>
                    {step.title}
                  </h4>
                </div>
                
                {/* Description */}
                <p className="text-sm text-white/85 leading-relaxed pl-13">{step.description}</p>
                
                {/* Bottom decorative element */}
                <div 
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full opacity-30"
                  style={{ backgroundColor: step.strokeColor }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add spin animation keyframe */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
