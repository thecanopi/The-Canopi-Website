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
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

/**
 * Example API route:
 * GET /api/ping -> returns a DB-free response
 */
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "API working" });
});

app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "API working" });
});

/**
 * Example secure DB route:
 * GET /api/profile-count -> counts rows from a table (change table name)
 * IMPORTANT: This is only an example. We'll customize routes to your real app next.
 */
app.get("/api/profile-count", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from("profiles")     // <-- change if your table is different
      .select("*", { count: "exact", head: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, count: count ?? 0 });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
});

const port = Number(process.env.PORT || 5050);
app.listen(port, "127.0.0.1", () => console.log(`API running on http://127.0.0.1:${port}`));
