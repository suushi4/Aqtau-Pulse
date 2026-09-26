export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    mode: process.env.SUPABASE_URL ? "supabase" : "demo",
    runtime: "vercel-function",
    time: new Date().toISOString(),
  });
}