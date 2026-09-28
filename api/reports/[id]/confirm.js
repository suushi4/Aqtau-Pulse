export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const accessToken = String(req.headers.authorization || "").replace(
      /^Bearer\s+/i,
      "",
    );

    if (!url || !anonKey || !serviceKey || !accessToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userResponse = await fetch(`${url}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!userResponse.ok) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
    const user = await userResponse.json();
    const reportId = req.query.id;

    const response = await fetch(
      `${url}/rest/v1/report_confirmations?on_conflict=report_id,user_id`,
      {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates,return=representation",
        },
        body: JSON.stringify({
          report_id: reportId,
          user_id: user.id,
        }),
      },
    );
    const data = await response.json().catch(() => []);
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json({ ok: true, confirmation: data[0] || null });
  } catch (error) {
    console.error("confirmation function failed", error);
    return res.status(500).json({ error: "Confirmation failed" });
  }
}