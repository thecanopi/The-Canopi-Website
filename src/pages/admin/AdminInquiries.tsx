import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Mail, Calendar, Check, Trash2, Eye, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role_title: string | null;
  message: string;
  is_read: boolean | null;
  created_at: string;
}

interface MeetingRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  topic: string | null;
  status: string | null;
  created_at: string;
  meeting_slots: {
    date: string;
    start_time: string;
    end_time: string;
  } | null;
}

export default function AdminInquiries() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Fetch contact inquiries
  const { data: inquiries, isLoading: loadingInquiries } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactInquiry[];
    },
  });

  // Fetch meeting requests
  const { data: meetings, isLoading: loadingMeetings } = useQuery({
    queryKey: ['admin-meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_requests')
        .select('*, meeting_slots(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as MeetingRequest[];
    },
  });

  // Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
    },
  });

  // Delete inquiry mutation
  const deleteInquiryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Inquiry deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
    },
  });

  // Update meeting status mutation
  const updateMeetingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('meeting_requests')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Meeting status updated' });
      queryClient.invalidateQueries({ queryKey: ['admin-meetings'] });
    },
  });

  const handleViewInquiry = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.is_read) {
      markReadMutation.mutate(inquiry.id);
    }
  };

  const unreadCount = inquiries?.filter((i) => !i.is_read).length ?? 0;
  const pendingMeetings = meetings?.filter((m) => m.status === 'pending').length ?? 0;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Inquiries & Meetings</h1>
          <p className="text-muted-foreground">Manage contact form submissions and meeting requests</p>
        </div>

        <Tabs defaultValue="inquiries">
          <TabsList>
            <TabsTrigger value="inquiries" className="gap-2">
              <Mail className="h-4 w-4" />
              Contact Inquiries
              {unreadCount > 0 && (
                <span className="bg-gold text-primary text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="meetings" className="gap-2">
              <Calendar className="h-4 w-4" />
              Meeting Requests
              {pendingMeetings > 0 && (
                <span className="bg-gold text-primary text-xs px-2 py-0.5 rounded-full">
                  {pendingMeetings}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Contact Inquiries Tab */}
          <TabsContent value="inquiries" className="mt-6">
            {loadingInquiries ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
              </div>
            ) : inquiries && inquiries.length > 0 ? (
              <div className="space-y-3">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id} className={inquiry.is_read ? 'bg-muted/30' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          inquiry.is_read ? 'bg-muted-foreground' : 'bg-gold'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-primary">{inquiry.name}</p>
                              <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                              {inquiry.company && (
                                <p className="text-sm text-gold">{inquiry.company} {inquiry.role_title && `• ${inquiry.role_title}`}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                              </span>
                              <Button variant="ghost" size="sm" onClick={() => handleViewInquiry(inquiry)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteInquiryMutation.mutate(inquiry.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-foreground mt-2 line-clamp-2">{inquiry.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No inquiries yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Meeting Requests Tab */}
          <TabsContent value="meetings" className="mt-6">
            {loadingMeetings ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
              </div>
            ) : meetings && meetings.length > 0 ? (
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <Card key={meeting.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          meeting.status === 'confirmed' ? 'bg-green-100' :
                          meeting.status === 'cancelled' ? 'bg-red-100' : 'bg-gold/20'
                        }`}>
                          {meeting.status === 'confirmed' ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : meeting.status === 'cancelled' ? (
                            <Trash2 className="h-5 w-5 text-red-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gold" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-primary">{meeting.name}</p>
                              <p className="text-sm text-muted-foreground">{meeting.email}</p>
                              {meeting.company && (
                                <p className="text-sm text-gold">{meeting.company}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              {meeting.meeting_slots && (
                                <span className="text-sm font-medium text-primary">
                                  {format(new Date(meeting.meeting_slots.date), 'MMM d, yyyy')} at{' '}
                                  {meeting.meeting_slots.start_time?.slice(0, 5)}
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded capitalize ${
                                meeting.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                meeting.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gold/20 text-gold'
                              }`}>
                                {meeting.status}
                              </span>
                            </div>
                          </div>
                          {meeting.topic && (
                            <p className="text-sm text-foreground mt-2">{meeting.topic}</p>
                          )}
                          {meeting.status === 'pending' && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="gold"
                                onClick={() => updateMeetingStatus.mutate({ id: meeting.id, status: 'confirmed' })}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateMeetingStatus.mutate({ id: meeting.id, status: 'cancelled' })}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No meeting requests yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* View Inquiry Dialog */}
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Inquiry</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">From</label>
                  <p className="text-primary font-medium">{selectedInquiry.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedInquiry.email}</p>
                </div>
                {selectedInquiry.company && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="text-primary">
                      {selectedInquiry.company}
                      {selectedInquiry.role_title && ` • ${selectedInquiry.role_title}`}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <p className="text-foreground whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Received</label>
                  <p className="text-sm">
                    {format(new Date(selectedInquiry.created_at), 'MMMM d, yyyy at h:mm a')}
                  </p>
                </div>
                <Button
                  variant="gold"
                  className="w-full"
                  onClick={() => window.location.href = `mailto:${selectedInquiry.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
