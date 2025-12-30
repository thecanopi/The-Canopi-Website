import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition } from '@/components/shared/PageTransition';
import { Calendar, User, ArrowRight, ChevronDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  category: string;
  tags: string[] | null;
}

function BlogCard({ post, isExpanded, onToggle }: { post: BlogPost; isExpanded: boolean; onToggle: () => void }) {
  return (
    <article 
      className={cn(
        "premium-card group cursor-pointer transition-all duration-300",
        isExpanded && "ring-2 ring-accent"
      )}
      onClick={onToggle}
    >
      {post.featured_image_url && (
        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        {post.published_at && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(post.published_at), 'MMM d, yyyy')}
          </span>
        )}
        {post.author && (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.author}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-serif font-bold text-primary mb-2 group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        <button className={cn(
          "p-1.5 rounded-full transition-all duration-300 flex-shrink-0",
          "bg-secondary hover:bg-accent hover:text-primary-foreground",
          isExpanded && "bg-accent text-primary-foreground rotate-180"
        )}>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      {!isExpanded && post.excerpt && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
      )}
      {!isExpanded && (
        <span className="inline-flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
          Read more <ArrowRight className="h-4 w-4 ml-1" />
        </span>
      )}
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-3">{paragraph}</p>
            ))}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {post.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <button 
            onClick={onToggle}
            className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            <X className="h-4 w-4" /> Close
          </button>
        </div>
      )}
    </article>
  );
}

function ArticleCard({ post, isExpanded, onToggle }: { post: BlogPost; isExpanded: boolean; onToggle: () => void }) {
  return (
    <article 
      className={cn(
        "premium-card flex flex-col md:flex-row gap-6 group cursor-pointer transition-all duration-300",
        isExpanded && "ring-2 ring-accent flex-col"
      )}
      onClick={onToggle}
    >
      {post.featured_image_url && (
        <div className={cn(
          "md:w-48 aspect-video md:aspect-square rounded-lg overflow-hidden bg-muted flex-shrink-0",
          isExpanded && "md:w-full md:aspect-video"
        )}>
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.published_at), 'MMM d, yyyy')}
            </span>
          )}
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-serif font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <button className={cn(
            "p-1.5 rounded-full transition-all duration-300 flex-shrink-0",
            "bg-secondary hover:bg-accent hover:text-primary-foreground",
            isExpanded && "bg-accent text-primary-foreground rotate-180"
          )}>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        {!isExpanded && post.excerpt && (
          <p className="text-muted-foreground text-sm mb-4">
            {post.excerpt}
          </p>
        )}
        {!isExpanded && (
          <span className="inline-flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
            Read article <ArrowRight className="h-4 w-4 ml-1" />
          </span>
        )}
        
        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-3">{paragraph}</p>
              ))}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <button 
              onClick={onToggle}
              className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <X className="h-4 w-4" /> Close
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function InsightsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const blogs = posts?.filter(p => p.category === 'blog') || [];
  const articles = posts?.filter(p => p.category === 'article') || [];

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Animated backgrounds */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="gold-accent-line mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
                Insights
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80">
                Perspectives and strategic insights from our team
              </p>
            </div>
          </div>
        </section>

        {/* Blogs Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
                Blog Posts
              </h2>
              
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="premium-card space-y-4">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : blogs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((post) => (
                    <BlogCard 
                      key={post.id} 
                      post={post} 
                      isExpanded={expandedId === post.id}
                      onToggle={() => handleToggle(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary/50 rounded-xl">
                  <p className="text-muted-foreground">No blog posts published yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back soon for insights from our team.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
                Articles & White Papers
              </h2>
              
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="premium-card flex gap-6">
                      <Skeleton className="h-32 w-48 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : articles.length > 0 ? (
                <div className="space-y-6">
                  {articles.map((post) => (
                    <ArticleCard 
                      key={post.id} 
                      post={post}
                      isExpanded={expandedId === post.id}
                      onToggle={() => handleToggle(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl">
                  <p className="text-muted-foreground">No articles published yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back soon for in-depth articles and white papers.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}