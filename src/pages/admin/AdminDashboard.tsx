import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Users, Calendar, Mail, Clock } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

type DashboardResponse = {
  ok: true;
  stats: {
    caseStudies: number;
    testimonials: number;
    teamMembers: number;
    pendingMeetings: number;
    unreadInquiries: number;
  };
  recentInquiries: any[];
  upcomingMeetings: any[];
};

export default function AdminDashboard() {
  const { session } = useAuth();

  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async (): Promise<DashboardResponse> => {
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load dashboard");
      return json;
    },
    enabled: !!session?.access_token,
  });

  const stats = data?.stats;

  const statCards = [
    { label: "Case Studies", value: stats?.caseStudies ?? 0, icon: FileText, color: "text-blue-500" },
    { label: "Testimonials", value: stats?.testimonials ?? 0, icon: MessageSquare, color: "text-green-500" },
    { label: "Team Members", value: stats?.teamMembers ?? 0, icon: Users, color: "text-purple-500" },
    { label: "Pending Meetings", value: stats?.pendingMeetings ?? 0, icon: Calendar, color: "text-gold" },
    { label: "Unread Inquiries", value: stats?.unreadInquiries ?? 0, icon: Mail, color: "text-red-500" },
  ];

  const recentInquiries = data?.recentInquiries ?? [];
  const upcomingMeetings = data?.upcomingMeetings ?? [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your website content and activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gold" />
                Recent Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentInquiries.length > 0 ? (
                <div className="space-y-4">
                  {recentInquiries.map((inquiry: any) => (
                    <div key={inquiry.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${inquiry.is_read ? "bg-muted-foreground" : "bg-gold"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary truncate">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{inquiry.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {inquiry.created_at ? format(new Date(inquiry.created_at), "MMM d, yyyy h:mm a") : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No inquiries yet</p>
              )}
            </CardContent>
          </Card>

          {/* Pending Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" />
                Pending Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting: any) => (
                    <div key={meeting.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Calendar className="h-5 w-5 text-gold mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary">{meeting.name}</p>
                        <p className="text-sm text-muted-foreground">{meeting.email}</p>
                        {meeting.meeting_slots && (
                          <p className="text-xs text-gold mt-1">
                            {meeting.meeting_slots?.date ? format(new Date(meeting.meeting_slots.date), "MMM d, yyyy") : ""}{" "}
                            {meeting.meeting_slots?.start_time ? `at ${meeting.meeting_slots.start_time.slice(0, 5)}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No pending meetings</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
