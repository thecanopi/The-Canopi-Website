import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Calendar,
  Mail,
  LogOut,
  Settings,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo-canopi.png';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: FileText, label: 'Case Studies', href: '/admin/case-studies' },
  { icon: BookOpen, label: 'Blog Posts', href: '/admin/blog-posts' },
  { icon: MessageSquare, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: Calendar, label: 'Meeting Slots', href: '/admin/meeting-slots' },
  { icon: Mail, label: 'Inquiries', href: '/admin/inquiries' },
  { icon: Settings, label: 'Site Content', href: '/admin/content' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-purple-50/30 to-gold/5">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="p-6 border-b border-primary-foreground/10">
          <Link to="/" className="block group">
            <img 
              src={logo} 
              alt="Canopi Strategy Partners" 
              className="h-12 mb-1 brightness-0 invert transition-all duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" 
            />
            <p className="text-sm text-primary-foreground/70">Admin Portal</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-accent text-primary shadow-lg shadow-accent/30' 
                    : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-primary-foreground/10">
          <div className="text-sm text-primary-foreground/70 mb-3 truncate px-2">
            {user.email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}