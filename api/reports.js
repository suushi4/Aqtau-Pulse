const clean = (value, max) => String(value || "").trim().slice(0, max);

export default async function handler(req, res) {
  try {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const headers = {
      apikey: key || "",
      Authorization: `Bearer ${key || ""}`,
      "Content-Type": "application/json",
    };

    if (req.method === "GET") {
      if (!url || !key) return res.status(200).json([]);
      const response = await fetch(
        `${url}/rest/v1/reports?select=*&order=created_at.desc&limit=100`,
        { headers },
      );
      return res.status(response.status).json(await response.json());
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const accessToken = String(req.headers.authorization || "").replace(
      /^Bearer\s+/i,
      "",
    );
    if (!url || !anonKey || !accessToken) {
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

    const body = req.body || {};
    const report = {
      author_id: user.id,
      title: clean(body.title, 80),
      description: clean(body.description, 1000),
      location: clean(body.location, 160),
      category: clean(body.category || "Другое", 80),
      priority: clean(body.priority || "Обычный", 40),
      type: clean(body.type || "problem", 30),
      status: "new",
      confirmations: 0,
      image_path: body.image_path ? clean(body.image_path, 500) : null,
    };

    if (!report.title || !report.description || !report.location) {
      return res.status(422).json({ error: "Required fields are missing" });
    }

    if (!key) return res.status(500).json({ error: "Server key is missing" });

    const response = await fetch(`${url}/rest/v1/reports`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify(report),
    });
    const data = await response.json();
    return res.status(response.status).json(response.ok ? data[0] : data);
  } catch (error) {
    console.error("reports function failed", error);
    return res.status(500).json({ error: "Reports service failed" });
  }
}