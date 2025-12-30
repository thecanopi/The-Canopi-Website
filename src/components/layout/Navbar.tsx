import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo-canopi.png';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Approach', href: '/approach' },
  { name: 'Capabilities', href: '/capabilities' },
  { name: 'Healthcare', href: '/industries/healthcare' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Insights', href: '/insights' },
  { name: 'FAQs', href: '/faqs' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'backdrop-blur-lg border-b',
        'bg-primary border-accent/20 shadow-lg shadow-primary/20'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-18 md:h-22">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Canopi Strategy Partners" 
              className="h-12 md:h-16 lg:h-18 w-auto transition-all duration-300 group-hover:scale-105 brightness-0 invert drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                  'hover:bg-primary-foreground/10',
                  isActive(link.href)
                    ? 'text-accent'
                    : 'text-primary-foreground/90 hover:text-primary-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop with gold glow */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              size="sm" 
              asChild 
              className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold px-6 shadow-md hover:shadow-glow-gold transition-all duration-300 hover:scale-105"
            >
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -mr-2 text-primary-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-primary/98 border-t border-accent/20 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'block px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive(link.href)
                    ? 'bg-accent/20 text-accent'
                    : 'text-primary-foreground/80 hover:bg-primary-foreground/10'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-accent/20 space-y-2">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-gold-light font-semibold" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
