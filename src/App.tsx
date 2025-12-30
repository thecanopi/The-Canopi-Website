import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ApproachPage from "@/pages/ApproachPage";
import CapabilitiesPage from "@/pages/CapabilitiesPage";
import HealthcarePage from "@/pages/HealthcarePage";
import CaseStudiesPage from "@/pages/CaseStudiesPage";
import InsightsPage from "@/pages/InsightsPage";
import FAQsPage from "@/pages/FAQsPage";
import ContactPage from "@/pages/ContactPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCaseStudies from "@/pages/admin/AdminCaseStudies";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminMeetingSlots from "@/pages/admin/AdminMeetingSlots";
import AdminInquiries from "@/pages/admin/AdminInquiries";
import AdminContent from "@/pages/admin/AdminContent";
import AdminBlogPosts from "@/pages/admin/AdminBlogPosts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/approach" element={<ApproachPage />} />
              <Route path="/capabilities" element={<CapabilitiesPage />} />
              <Route path="/industries/healthcare" element={<HealthcarePage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/faqs" element={<FAQsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/case-studies" element={<AdminCaseStudies />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/meeting-slots" element={<AdminMeetingSlots />} />
            <Route path="/admin/inquiries" element={<AdminInquiries />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/blog-posts" element={<AdminBlogPosts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;