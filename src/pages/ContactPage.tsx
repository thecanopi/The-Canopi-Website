import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Clock, Mail, Phone, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/shared/PageTransition";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

interface MeetingSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    role_title: "",
    message: "",
  });

  // Meeting scheduler state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [meetingForm, setMeetingForm] = useState({
    name: "",
    email: "",
    company: "",
    topic: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // ---- Fetch available slots (API) ----
  const { data: availableSlots = [] } = useQuery<MeetingSlot[]>({
    queryKey: ["available-slots"],
    queryFn: async () => {
      const res = await fetch("/api/meeting-slots");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load slots");
      return json.data || [];
    },
  });

  const slotsForSelectedDate = availableSlots.filter(
    (slot) => slot.date === (selectedDate ? format(selectedDate, "yyyy-MM-dd") : null)
  );

  // ---- Contact form submit (API) ----
  const contactMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to send message");
      return json;
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setContactForm({ name: "", email: "", company: "", role_title: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // ---- Meeting booking (API) ----
  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSlot) throw new Error("No slot selected");

      const res = await fetch("/api/meeting-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: selectedSlot,
          ...meetingForm,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Booking failed");
      return json;
    },
    onSuccess: () => {
      setBookingSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate();
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate();
  };

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Contact Info */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4 flex justify-center gap-10">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gold" />
              <a href="mailto:Anupama.S@thecanopi.ai">Anupama.S@thecanopi.ai</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gold" />
              <a href="tel:+919515212509">+91 9515212509</a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gold" />
              <span>Hyderabad</span>
            </div>
          </div>
        </section>

        {/* Main */}
        <section className="py-20">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 max-w-6xl">

            {/* Meeting Scheduler */}
            <div>
              {bookingSuccess ? (
                <div className="text-center">
                  <Check className="mx-auto h-12 w-12 text-green-600" />
                  <h3 className="text-xl font-bold mt-4">Meeting booked!</h3>
                </div>
              ) : (
                <>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                      setSelectedDate(d);
                      setSelectedSlot(null);
                    }}
                  />

                  {slotsForSelectedDate.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={cn(
                        "block w-full mt-2 p-2 border rounded",
                        selectedSlot === slot.id && "border-gold bg-gold/10"
                      )}
                    >
                      {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                    </button>
                  ))}

                  {selectedSlot && (
                    <form onSubmit={handleBookingSubmit} className="mt-4 space-y-3">
                      <Input placeholder="Name" onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })} />
                      <Input placeholder="Email" onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })} />
                      <Button type="submit">Book Meeting</Button>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <Input placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
              <Input placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
              <Textarea placeholder="Message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
              <Button type="submit">Send Message</Button>
            </form>

          </div>
        </section>
      </div>
    </PageTransition>
  );
}
