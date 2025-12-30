import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: process.env.ENV_FILE || ".env" });

const app = express();
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Supabase server client (SERVICE ROLE stays ONLY on VPS env file)
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing SUPABASE_URL");
  if (!serviceRole) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// -------- Auth helpers (Admin-only) --------
function getBearerToken(req) {
  const h = req.headers.authorization || "";
  if (!h.startsWith("Bearer ")) return null;
  return h.slice("Bearer ".length).trim();
}

async function requireAdmin(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: "Missing Authorization Bearer token" });

    const supabase = getSupabaseAdmin();

    // Validate token and get user
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) return res.status(401).json({ error: "Invalid session" });

    const userId = userData.user.id;

    // Check role
    const { data: roleRow, error: roleErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roleErr) return res.status(403).json({ error: "No admin role" });
    if (roleRow?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    // attach user if useful later
    req.user = userData.user;
    next();
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}

// ---- Basic ping ----
app.get("/api/ping", (req, res) => res.json({ ok: true, message: "API working" }));

// =========================
// PUBLIC ROUTES
// =========================

// Case Studies
app.get("/api/case-studies", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("case_studies").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Testimonials
app.get("/api/testimonials", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("testimonials").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Meeting slots (for contact page)
app.get("/api/meeting-slots", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("meeting_slots")
      .select("*")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// =========================
// ADMIN: MEETING SLOTS CRUD
// =========================

// List slots
app.get("/api/admin/meeting-slots", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("meeting_slots")
      .select("*")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Create slot
app.post("/api/admin/meeting-slots", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const payload = req.body || {};

    const { data, error } = await supabase
      .from("meeting_slots")
      .insert([payload])
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Delete slot
app.delete("/api/admin/meeting-slots/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;

    const { error } = await supabase.from("meeting_slots").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});


// =========================
// ADMIN: MEETING REQUESTS
// =========================

app.get("/api/admin/meeting-requests", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("meeting_requests")
      .select("*, meeting_slots(date, start_time, end_time)")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Update status
app.patch("/api/admin/meeting-requests/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;

    const { data, error } = await supabase
      .from("meeting_requests")
      .update(req.body || {})
      .eq("id", id)
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Delete request
app.delete("/api/admin/meeting-requests/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;

    const { error } = await supabase.from("meeting_requests").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});


// Contact form submit
app.post("/api/contact", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const payload = req.body || {};

    const { data, error } = await supabase
      .from("contact_inquiries")
      .insert([payload])
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Meeting request submit (simple insert; you can later add "book slot" logic here)
app.post("/api/meeting-request", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const payload = req.body || {};

    const { data, error } = await supabase
      .from("meeting_requests")
      .insert([payload])
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// =========================
// ADMIN ROUTES (JWT + user_roles)
// =========================


app.get("/api/admin/me", requireAdmin, async (req, res) => {
  res.json({ ok: true, user: req.user });
});



app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();

    const [
      caseStudies,
      testimonials,
      teamMembers,
      pendingMeetings,
      unreadInquiries,
      recentInquiries,
      upcomingMeetings,
    ] = await Promise.all([
      supabase.from("case_studies").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
      supabase.from("team_members").select("*", { count: "exact", head: true }),
      supabase.from("meeting_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("contact_inquiries").select("*", { count: "exact", head: true }).eq("is_read", false),

      supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }).limit(5),
      supabase
        .from("meeting_requests")
        .select("*, meeting_slots(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const anyErr =
      caseStudies.error ||
      testimonials.error ||
      teamMembers.error ||
      pendingMeetings.error ||
      unreadInquiries.error ||
      recentInquiries.error ||
      upcomingMeetings.error;

    if (anyErr) {
      return res.status(500).json({ error: anyErr.message });
    }

    return res.json({
      ok: true,
      stats: {
        caseStudies: caseStudies.count ?? 0,
        testimonials: testimonials.count ?? 0,
        teamMembers: teamMembers.count ?? 0,
        pendingMeetings: pendingMeetings.count ?? 0,
        unreadInquiries: unreadInquiries.count ?? 0,
      },
      recentInquiries: recentInquiries.data ?? [],
      upcomingMeetings: upcomingMeetings.data ?? [],
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
});

// Blog posts CRUD
app.get("/api/admin/blog-posts", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.post("/api/admin/blog-posts", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([req.body])
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.patch("/api/admin/blog-posts/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;

    const { data, error } = await supabase
      .from("blog_posts")
      .update(req.body)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.delete("/api/admin/blog-posts/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Case studies CRUD
app.get("/api/admin/case-studies", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.post("/api/admin/case-studies", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("case_studies")
      .insert([req.body])
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.patch("/api/admin/case-studies/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;

    const { data, error } = await supabase
      .from("case_studies")
      .update(req.body)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.delete("/api/admin/case-studies/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;

    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Testimonials list (add POST/PATCH/DELETE later when you send the admin page)
// Testimonials CRUD (Admin)
app.get("/api/admin/testimonials", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.post("/api/admin/testimonials", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const payload = req.body || {};

    const { data, error } = await supabase
      .from("testimonials")
      .insert([payload])
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.patch("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;
    const payload = req.body || {};

    const { data, error } = await supabase
      .from("testimonials")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});


// Inquiries / Meeting Requests
app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.get("/api/admin/meeting-requests", requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("meeting_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

const port = Number(process.env.PORT || 5050);
app.listen(port, "127.0.0.1", () => console.log(`API running on http://127.0.0.1:${port}`));
