import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Settings } from 'lucide-react';

export default function AdminContent() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Site Content</h1>
          <p className="text-muted-foreground">Manage static page content and settings</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                Page Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content management for static pages will be available in a future update.
                Currently, page content is managed through the codebase.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gold" />
                Site Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Site-wide settings like contact information, social links, and branding
                will be configurable in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
