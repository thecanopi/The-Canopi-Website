import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, isPast, parseISO } from "date-fns";
import { Plus, Trash2, Clock, CalendarIcon, CalendarClock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type MeetingSlot = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked?: boolean | null;
};

interface MeetingRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  topic: string | null;
  status: string | null;
  created_at: string;
  slot_id: string | null;
  meeting_slots?: {
    date: string;
    start_time: string;
    end_time: string;
  } | null;
}

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated. Please sign in again.");
  return token;
}

async function apiAdmin<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Request failed");
  return json as T;
}

export default function AdminMeetingSlots() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "09:30",
  });

  // Fetch all slots (ADMIN)
  const { data: slotsResp, isLoading } = useQuery({
    queryKey: ["admin-meeting-slots"],
    queryFn: () => apiAdmin<{ ok: boolean; data: MeetingSlot[] }>("/api/admin/meeting-slots"),
  });

  const slots = slotsResp?.data ?? [];

  // Fetch meeting requests (ADMIN)
  const { data: requestsResp } = useQuery({
    queryKey: ["admin-meeting-requests"],
    queryFn: () => apiAdmin<{ ok: boolean; data: MeetingRequest[] }>("/api/admin/meeting-requests"),
  });

  const meetingRequests = requestsResp?.data ?? [];

  const slotsForDate = useMemo(() => {
    const d = format(selectedDate, "yyyy-MM-dd");
    return slots.filter((s) => s.date === d);
  }, [slots, selectedDate]);

  // Create slot
  const createMutation = useMutation({
    mutationFn: (slotData: typeof newSlot) =>
      apiAdmin<{ ok: boolean; data: MeetingSlot }>("/api/admin/meeting-slots", {
        method: "POST",
        body: JSON.stringify(slotData),
      }),
    onSuccess: () => {
      toast({ title: "Slot created successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-meeting-slots"] });
      setIsDialogOpen(false);
      setNewSlot({
        date: format(selectedDate, "yyyy-MM-dd"),
        start_time: "09:00",
        end_time: "09:30",
      });
    },
    onError: (error: any) => {
      toast({ title: "Error creating slot", description: error?.message, variant: "destructive" });
    },
  });

  // Delete slot
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiAdmin<{ ok: boolean }>(`/api/admin/meeting-slots/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Slot deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-meeting-slots"] });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting slot", description: error?.message, variant: "destructive" });
    },
  });

  // Update meeting request status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiAdmin<{ ok: boolean; data: MeetingRequest }>(`/api/admin/meeting-requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast({ title: "Status updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-meeting-requests"] });
    },
    onError: (error: any) => {
      toast({ title: "Error updating status", description: error?.message, variant: "destructive" });
    },
  });

  // Delete meeting request
  const deleteRequestMutation = useMutation({
    mutationFn: (id: string) =>
      apiAdmin<{ ok: boolean }>(`/api/admin/meeting-requests/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Meeting request deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-meeting-requests"] });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting request", description: error?.message, variant: "destructive" });
    },
  });

  // Quick add slots for a week (ADMIN)
  const addWeekSlots = async () => {
    const times = [
      { start: "09:00", end: "09:30" },
      { start: "10:00", end: "10:30" },
      { start: "11:00", end: "11:30" },
      { start: "14:00", end: "14:30" },
      { start: "15:00", end: "15:30" },
      { start: "16:00", end: "16:30" },
    ];

    try {
      for (let i = 0; i < 7; i++) {
        const date = format(addDays(new Date(), i), "yyyy-MM-dd");
        for (const t of times) {
          await apiAdmin("/api/admin/meeting-slots", {
            method: "POST",
            body: JSON.stringify({ date, start_time: t.start, end_time: t.end }),
          });
        }
      }
      toast({ title: "Week of slots added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["admin-meeting-slots"] });
    } catch (e: any) {
      toast({ title: "Error adding slots", description: e?.message, variant: "destructive" });
    }
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newSlot);
  };

  const datesWithSlots = [...new Set(slots.map((s) => s.date))];

  const isMeetingPast = (request: MeetingRequest) => {
    if (!request.meeting_slots) return false;
    const meetingDateTime = parseISO(`${request.meeting_slots.date}T${request.meeting_slots.end_time}`);
    return isPast(meetingDateTime);
  };

  const getStatusBadge = (status: string | null, isPastMeeting: boolean) => {
    if (isPastMeeting && status === "pending") {
      return <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Expired</span>;
    }
    switch (status) {
      case "done":
        return <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Done</span>;
      case "postponed":
        return <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">Postponed</span>;
      case "cancelled":
        return <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Cancelled</span>;
      default:
        return <span className="text-xs px-2 py-0.5 rounded bg-gold/20 text-gold">Pending</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Meeting Slots</h1>
            <p className="text-muted-foreground">Manage available meeting times for clients</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={addWeekSlots}>
              <Plus className="h-4 w-4 mr-2" />
              Add Week of Slots
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Meeting Slot</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSlot} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Time</label>
                      <Input
                        type="time"
                        value={newSlot.start_time}
                        onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Time</label>
                      <Input
                        type="time"
                        value={newSlot.end_time}
                        onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="gold" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Slot"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gold" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                modifiers={{
                  hasSlots: datesWithSlots.map((d) => new Date(d + "T00:00:00")),
                }}
                modifiersStyles={{
                  hasSlots: { backgroundColor: "hsl(43 89% 55% / 0.2)", fontWeight: "bold" },
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Slots for selected date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" />
                Slots for {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
                </div>
              ) : slotsForDate.length > 0 ? (
                <div className="space-y-2">
                  {slotsForDate.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        slot.is_booked ? "bg-muted border-muted" : "bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={slot.is_booked ? "line-through text-muted-foreground" : ""}>
                          {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                        </span>
                        {slot.is_booked && (
                          <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">Booked</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(slot.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No slots for this date. Click "Add Slot" to create one.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Meeting Requests Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-gold" />
              Meeting Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {meetingRequests.length > 0 ? (
              <div className="space-y-4">
                {meetingRequests.map((request) => {
                  const isPastMeeting = isMeetingPast(request);
                  return (
                    <div
                      key={request.id}
                      className={cn(
                        "p-4 rounded-lg border",
                        isPastMeeting && request.status === "pending" && "opacity-60 bg-muted"
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{request.name}</span>
                            {getStatusBadge(request.status, isPastMeeting)}
                          </div>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          {request.company && <p className="text-sm text-muted-foreground">Company: {request.company}</p>}
                          {request.topic && <p className="text-sm text-muted-foreground">Topic: {request.topic}</p>}
                          {request.meeting_slots && (
                            <p className="text-sm font-medium text-accent">
                              {format(parseISO(request.meeting_slots.date), "MMM d, yyyy")} at{" "}
                              {request.meeting_slots.start_time.slice(0, 5)} - {request.meeting_slots.end_time.slice(0, 5)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Select
                            value={request.status || "pending"}
                            onValueChange={(value) => updateStatusMutation.mutate({ id: request.id, status: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="done">Done</SelectItem>
                              <SelectItem value="postponed">Postponed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRequestMutation.mutate(request.id)}
                            disabled={deleteRequestMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No meeting requests yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
