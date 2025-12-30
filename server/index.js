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

/**
 * DB-free ping route (kept for quick checks)
 */
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "API working" });
});

// Needed because nginx proxies /api/* to backend root (so /api/ping becomes /ping)
app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "API working" });
});

/**
 * Public: Case Studies
 * NOTE: We export BOTH /api/case-studies and /case-studies
 * because nginx is configured to proxy /api/* -> /* on the backend.
 */
const caseStudiesHandler = async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();

    // Keep it simple to ensure data shows; add filters later once confirmed
    const { data, error } = await supabase.from("case_studies").select("*");

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

app.get("/api/case-studies", caseStudiesHandler);
app.get("/case-studies", caseStudiesHandler);

/**
 * Public: Testimonials
 * Same dual-route approach as case studies.
 */
const testimonialsHandler = async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.from("testimonials").select("*");

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, data: data ?? [] });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

app.get("/api/testimonials", testimonialsHandler);
app.get("/testimonials", testimonialsHandler);

/**
 * Example secure DB route:
 * GET /api/profile-count -> counts rows from a table (change table name)
 */
const profileCountHandler = async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, count: count ?? 0 });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

app.get("/api/profile-count", profileCountHandler);
app.get("/profile-count", profileCountHandler);

const port = Number(process.env.PORT || 5050);
app.listen(port, "127.0.0.1", () =>
  console.log(`API running on http://127.0.0.1:${port}`)
);
