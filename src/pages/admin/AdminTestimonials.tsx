import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Quote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface Testimonial {
  id: string;
  quote: string;
  author_role: string;
  is_published: boolean | null;
  display_order: number | null;
}

const emptyTestimonial = {
  quote: "",
  author_role: "",
  is_published: true,
};

async function apiFetch<T>(url: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  const json = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(json?.error || "Request failed");
  return json as T;
}

export default function AdminTestimonials() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token || "";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState(emptyTestimonial);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const json = await apiFetch<{ ok: true; data: Testimonial[] }>("/api/admin/testimonials", token);
      return json.data;
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiFetch<{ ok: true; data: any }>("/api/admin/testimonials", token, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Testimonial created successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error creating testimonial", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      await apiFetch<{ ok: true; data: any }>(`/api/admin/testimonials/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Testimonial updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error updating testimonial", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiFetch<{ ok: true }>(`/api/admin/testimonials/${id}`, token, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({ title: "Testimonial deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting testimonial", description: error.message, variant: "destructive" });
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(emptyTestimonial);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      quote: item.quote,
      author_role: item.author_role,
      is_published: item.is_published ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData(emptyTestimonial);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Testimonials</h1>
            <p className="text-muted-foreground">Manage client testimonials and quotes</p>
          </div>
          <Button variant="gold" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {testimonials.map((item) => (
              <Card key={item.id} className={!item.is_published ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Quote className="h-8 w-8 text-gold/30 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-foreground italic line-clamp-4">{item.quote}</p>
                      <p className="text-sm text-gold mt-3 font-medium">{item.author_role}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                    {!item.is_published && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded mr-auto">
                        Draft
                      </span>
                    )}

                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No testimonials yet. Click "Add Testimonial" to create one.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Quote *</label>
                <Textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  rows={4}
                  placeholder="Enter the testimonial quote..."
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Author & Role *</label>
                <Input
                  value={formData.author_role}
                  onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                  placeholder="e.g., CEO, Healthcare Technology Company"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <label className="text-sm font-medium">Published</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  className="flex-1"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
