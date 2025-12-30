import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type RevealVariant = 'up' | 'left' | 'right' | 'scale';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: RevealVariant;
}

export function RevealOnScroll({
  children,
  className,
  delayMs = 0,
  variant = 'up',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const hiddenClass = useMemo(() => {
    switch (variant) {
      case 'left':
        return 'opacity-0 -translate-x-6';
      case 'right':
        return 'opacity-0 translate-x-6';
      case 'scale':
        return 'opacity-0 scale-[0.98]';
      case 'up':
      default:
        return 'opacity-0 translate-y-6';
    }
  }, [variant]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform',
        isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : hiddenClass,
        className
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
