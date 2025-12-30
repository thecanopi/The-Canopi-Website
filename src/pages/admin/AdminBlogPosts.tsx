import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, BookOpen, FileText, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string | null;
  featured_image_url: string | null;
  is_published: boolean;
  display_order: number;
}

const emptyPost: Omit<BlogPost, 'id'> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'blog',
  author: '',
  featured_image_url: '',
  is_published: false,
  display_order: 0,
};

export default function AdminBlogPosts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>(emptyPost);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<BlogPost, 'id'>) => {
      const { error } = await supabase.from('blog_posts').insert({
        ...data,
        published_at: data.is_published ? new Date().toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Post created successfully' });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating post', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<BlogPost, 'id'> }) => {
      const { error } = await supabase.from('blog_posts').update({
        ...data,
        published_at: data.is_published ? new Date().toISOString() : null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Post updated successfully' });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating post', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Post deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting post', description: error.message, variant: 'destructive' });
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(emptyPost);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: BlogPost) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content,
      category: item.category,
      author: item.author || '',
      featured_image_url: item.featured_image_url || '',
      is_published: item.is_published,
      display_order: item.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData(emptyPost);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-accent" />
              Blog Posts & Articles
            </h1>
            <p className="text-muted-foreground mt-1">Manage your insights content</p>
          </div>
          <Button onClick={handleOpenCreate} className="bg-accent hover:bg-accent/90 text-primary shadow-lg shadow-accent/20">
            <Plus className="h-4 w-4 mr-2" /> Add Post
          </Button>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card 
                key={post.id}
                className={cn(
                  "group transition-all duration-300 overflow-hidden",
                  "hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30",
                  !post.is_published && "opacity-70"
                )}
                onMouseEnter={() => setHoveredId(post.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Category indicator */}
                    <div className={cn(
                      "w-2 shrink-0",
                      post.category === 'blog' ? 'bg-accent' : 'bg-purple-500'
                    )} />
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {post.category === 'blog' ? (
                              <FileText className="h-5 w-5 text-accent" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-purple-500" />
                            )}
                            <h3 className="font-semibold text-primary text-lg group-hover:text-accent transition-colors">
                              {post.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={cn(
                              "px-3 py-1 text-xs rounded-full font-medium",
                              post.category === 'blog' 
                                ? 'bg-accent/10 text-accent' 
                                : 'bg-purple-100 text-purple-700'
                            )}>
                              {post.category === 'blog' ? 'Blog' : 'Article'}
                            </span>
                            {post.is_published ? (
                              <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                <Eye className="h-3 w-3" /> Published
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                <EyeOff className="h-3 w-3" /> Draft
                              </span>
                            )}
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          )}
                        </div>
                        
                        {/* Action buttons - visible on hover */}
                        <div className={cn(
                          "flex gap-2 transition-all duration-300",
                          hoveredId === post.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                        )}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenEdit(post)}
                            className="hover:bg-accent hover:text-primary hover:border-accent"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => deleteMutation.mutate(post.id)}
                            className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No posts yet. Create your first post!</p>
              <Button onClick={handleOpenCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Create Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingItem ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingItem ? 'Edit Post' : 'New Post'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
                  }} 
                  placeholder="Post title" 
                  className="focus-visible:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input 
                  value={formData.slug} 
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                  placeholder="url-slug" 
                  className="focus-visible:ring-accent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input 
                  value={formData.author || ''} 
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
                  placeholder="Author name" 
                  className="focus-visible:ring-accent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea 
                value={formData.excerpt || ''} 
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
                placeholder="Brief summary..." 
                rows={2} 
                className="focus-visible:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea 
                value={formData.content} 
                onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                placeholder="Full content..." 
                rows={8} 
                className="focus-visible:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <Label>Featured Image URL</Label>
              <Input 
                value={formData.featured_image_url || ''} 
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })} 
                placeholder="https://..." 
                className="focus-visible:ring-accent"
              />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
              <Switch 
                checked={formData.is_published} 
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} 
              />
              <Label className="cursor-pointer">
                {formData.is_published ? 'Published' : 'Draft'}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-accent hover:bg-accent/90 text-primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}