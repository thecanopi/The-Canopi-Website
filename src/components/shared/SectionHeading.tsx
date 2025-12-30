import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  dark?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'space-y-4 mb-12 md:mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      <div
        className={cn(
          'gold-accent-line',
          align === 'center' && 'mx-auto'
        )}
      />
      <h2
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl font-serif font-bold',
          dark ? 'text-primary-foreground' : 'text-primary'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-lg md:text-xl max-w-3xl',
            align === 'center' && 'mx-auto',
            dark ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
