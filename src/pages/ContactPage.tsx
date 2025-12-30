import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Clock, Mail, Phone, MapPin, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/shared/PageTransition";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

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

  // Fetch available slots
  const { data: availableSlots } = useQuery({
    queryKey: ["available-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meeting_slots")
        .select("*")
        .eq("is_booked", false)
        .gte("date", format(new Date(), "yyyy-MM-dd"))
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Get slots for selected date
  const slotsForSelectedDate = availableSlots?.filter(
    (slot) => slot.date === (selectedDate ? format(selectedDate, "yyyy-MM-dd") : null),
  );

  // Send notification email
  const sendNotificationEmail = async (data: {
    type: "meeting" | "inquiry";
    name: string;
    email: string;
    company?: string;
    topic?: string;
    message?: string;
    role_title?: string;
    meeting_date?: string;
    meeting_time?: string;
  }) => {
    try {
      const { error } = await supabase.functions.invoke("send-notification-email", {
        body: data,
      });
      if (error) {
        console.error("Failed to send notification email:", error);
      } else {
        console.log("Notification email sent successfully");
      }
    } catch (err) {
      console.error("Error sending notification email:", err);
    }
  };

  // Contact form submission
  const contactMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      const { error } = await supabase.from("contact_inquiries").insert([data]);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      sendNotificationEmail({
        type: "inquiry",
        name: data.name,
        email: data.email,
        company: data.company,
        role_title: data.role_title,
        message: data.message,
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

  // Meeting booking
  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSlot) throw new Error("No slot selected");

      const { data, error } = await supabase.rpc("book_meeting_slot", {
        p_slot_id: selectedSlot,
        p_name: meetingForm.name,
        p_email: meetingForm.email,
        p_company: meetingForm.company,
        p_topic: meetingForm.topic,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setBookingSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });

      const slot = availableSlots?.find((s) => s.id === selectedSlot);

      sendNotificationEmail({
        type: "meeting",
        name: meetingForm.name,
        email: meetingForm.email,
        company: meetingForm.company,
        topic: meetingForm.topic,
        meeting_date: slot ? format(new Date(slot.date), "MMMM d, yyyy") : undefined,
        meeting_time: slot ? `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}` : undefined,
      });
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "Please try again or select a different slot.",
        variant: "destructive",
      });
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(contactForm);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !meetingForm.name || !meetingForm.email) {
      toast({
        title: "Missing information",
        description: "Please select a time slot and fill in your details.",
        variant: "destructive",
      });
      return;
    }
    bookingMutation.mutate();
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
              <RevealOnScroll>
                <div className="gold-accent-line mx-auto mb-6" />
              </RevealOnScroll>
              <RevealOnScroll delayMs={100}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">Let's Build What's Next</h1>
              </RevealOnScroll>
              <RevealOnScroll delayMs={200}>
                <p className="text-lg md:text-xl text-primary-foreground/80">
                  Whether you are scaling, transforming, or reimagining your business, our team is ready to help.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <a href="mailto:Anupama.S@thecanopi.ai" className="text-primary hover:text-accent transition-colors">
                  Anupama.S@thecanopi.ai
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <a href="tel:+919515212509" className="text-primary hover:text-accent transition-colors">
                  +91 9515212509
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <span className="text-primary">Hyderabad</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute top-40 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Meeting Scheduler */}
              <RevealOnScroll>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-2">
                    Connect with our founder or team
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Book time with our leadership team to explore how we can partner.
                  </p>

                  {bookingSuccess ? (
                    <div className="premium-card text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-primary mb-2">Meeting Request Received!</h3>
                      <p className="text-muted-foreground mb-4">
                        You will receive the meeting link with details in 30 minutes.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setBookingSuccess(false);
                          setSelectedSlot(null);
                          setSelectedDate(undefined);
                          setMeetingForm({ name: "", email: "", company: "", topic: "" });
                        }}
                      >
                        Book Another Meeting
                      </Button>
                    </div>
                  ) : (
                    <div className="premium-card">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Calendar */}
                        <div>
                          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-gold" />
                            Select a Date
                          </h3>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              setSelectedSlot(null);
                            }}
                            disabled={(date) => {
                              const dateStr = format(date, "yyyy-MM-dd");
                              const hasSlots = availableSlots?.some((slot) => slot.date === dateStr);
                              return !hasSlots || date < new Date();
                            }}
                            className="rounded-md border pointer-events-auto"
                          />
                        </div>

                        {/* Time Slots */}
                        <div>
                          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gold" />
                            Available Times
                          </h3>
                          {selectedDate ? (
                            slotsForSelectedDate && slotsForSelectedDate.length > 0 ? (
                              <div className="space-y-2">
                                {slotsForSelectedDate.map((slot) => (
                                  <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot.id)}
                                    className={cn(
                                      "w-full p-3 rounded-lg border text-left transition-all duration-300",
                                      selectedSlot === slot.id
                                        ? "border-gold bg-gold/10 text-primary"
                                        : "border-border hover:border-gold/50 hover:bg-muted/50",
                                    )}
                                  >
                                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">
                                No slots available for this date. Please choose another date or submit the contact form.
                              </p>
                            )
                          ) : (
                            <p className="text-muted-foreground text-sm">
                              Please select a date to see available times.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Meeting Form */}
                      {selectedSlot && (
                        <form onSubmit={handleBookingSubmit} className="mt-6 pt-6 border-t space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <Input
                              placeholder="Your Name *"
                              value={meetingForm.name}
                              onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })}
                              required
                            />
                            <Input
                              type="email"
                              placeholder="Email *"
                              value={meetingForm.email}
                              onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })}
                              required
                            />
                          </div>
                          <Input
                            placeholder="Company"
                            value={meetingForm.company}
                            onChange={(e) => setMeetingForm({ ...meetingForm, company: e.target.value })}
                          />
                          <Textarea
                            placeholder="What would you like to discuss?"
                            value={meetingForm.topic}
                            onChange={(e) => setMeetingForm({ ...meetingForm, topic: e.target.value })}
                            rows={3}
                          />
                          <Button type="submit" variant="gold" className="w-full" disabled={bookingMutation.isPending}>
                            {bookingMutation.isPending ? "Booking..." : "Book Meeting"}
                          </Button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </RevealOnScroll>

              {/* Contact Form */}
              <RevealOnScroll delayMs={150}>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-2">Send us a message</h2>
                  <p className="text-muted-foreground mb-8">
                    Have a question or want to discuss a project? We'd love to hear from you.
                  </p>

                  <form onSubmit={handleContactSubmit} className="premium-card space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Name *"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email *"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Company"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      />
                      <Input
                        placeholder="Role / Title"
                        value={contactForm.role_title}
                        onChange={(e) => setContactForm({ ...contactForm, role_title: e.target.value })}
                      />
                    </div>
                    <Textarea
                      placeholder="What would you like to discuss? *"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={5}
                      required
                    />
                    <Button type="submit" variant="gold" className="w-full" disabled={contactMutation.isPending}>
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
