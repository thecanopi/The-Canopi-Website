import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface CaseStudy {
  id: string;
  title: string;
  challenge: string;
  solution: string;
  outcome: string;
  industry: string | null;
  tags: string[] | null;
  is_published: boolean | null;
  display_order: number | null;
}

const emptyCaseStudy = {
  title: "",
  challenge: "",
  solution: "",
  outcome: "",
  industry: "",
  tags: [] as string[],
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

export default function AdminCaseStudies() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.access_token || "";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CaseStudy | null>(null);
  const [formData, setFormData] = useState(emptyCaseStudy);
  const [tagsInput, setTagsInput] = useState("");

  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ["admin-case-studies"],
    queryFn: async () => {
      const json = await apiFetch<{ ok: true; data: CaseStudy[] }>("/api/admin/case-studies", token);
      return json.data;
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        tags: data.tags.length > 0 ? data.tags : null,
        industry: data.industry || null,
      };

      await apiFetch<{ ok: true; data: any }>("/api/admin/case-studies", token, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      toast({ title: "Case study created successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-case-studies"] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error creating case study", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const payload = {
        ...data,
        tags: data.tags.length > 0 ? data.tags : null,
        industry: data.industry || null,
      };

      await apiFetch<{ ok: true; data: any }>(`/api/admin/case-studies/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      toast({ title: "Case study updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-case-studies"] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error updating case study", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiFetch<{ ok: true }>(`/api/admin/case-studies/${id}`, token, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({ title: "Case study deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-case-studies"] });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting case study", description: error.message, variant: "destructive" });
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(emptyCaseStudy);
    setTagsInput("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: CaseStudy) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      challenge: item.challenge,
      solution: item.solution,
      outcome: item.outcome,
      industry: item.industry || "",
      tags: item.tags || [],
      is_published: item.is_published ?? true,
    });
    setTagsInput(item.tags?.join(", ") || "");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData(emptyCaseStudy);
    setTagsInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const data = { ...formData, tags };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Case Studies</h1>
            <p className="text-muted-foreground">Manage your case studies and client success stories</p>
          </div>
          <Button variant="gold" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Case Study
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        ) : caseStudies && caseStudies.length > 0 ? (
          <div className="space-y-4">
            {caseStudies.map((item) => (
              <Card key={item.id} className={!item.is_published ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-primary">{item.title}</h3>
                          {item.industry && (
                            <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded mt-1 inline-block">
                              {item.industry}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!item.is_published && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Draft</span>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.challenge}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No case studies yet. Click "Add Case Study" to create one.</p>
            </CardContent>
          </Card>
        )}

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Case Study" : "Add Case Study"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div>
                <label className="text-sm font-medium">Industry</label>
                <Input
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Healthcare, Technology, Finance"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Challenge *</label>
                <Textarea
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Solution *</label>
                <Textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Outcome *</label>
                <Textarea
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g., AI, Digital Transformation, Strategy"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                <label className="text-sm font-medium">Published</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="gold" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
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
