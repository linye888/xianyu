const IP_SALT = "xianyu-analytics-v1";
const SESSION_SALT = "xianyu-session";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

const COUNTRY_NAMES = {
  MX: "墨西哥",
  US: "美国",
  BR: "巴西",
  IN: "印度",
  CO: "哥伦比亚",
  AR: "阿根廷",
  CL: "智利",
  PE: "秘鲁",
  ES: "西班牙",
  CA: "加拿大",
  GB: "英国",
  DE: "德国",
  FR: "法国",
  UNKNOWN: "未知",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/track" && request.method === "POST") {
      return handleTrack(request, env);
    }

    if (url.pathname === "/api/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    if (url.pathname === "/api/stats" && request.method === "GET") {
      return handleStats(request, env, url);
    }

    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      return serveAdmin(request, env);
    }

    if (
      url.pathname === "/worker.js" ||
      url.pathname === "/schema.sql" ||
      url.pathname === "/admin.html" ||
      url.pathname === "/wrangler.jsonc"
    ) {
      return new Response("Not Found", { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};

async function ensureSchema(env) {
  await env.DB.prepare(
  `CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    country TEXT,
    button_position TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`
  ).run();

  await env.DB.prepare(
    "CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type)"
  ).run();
  await env.DB.prepare(
    "CREATE INDEX IF NOT EXISTS idx_events_country ON events(country)"
  ).run();
  await env.DB.prepare(
    "CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at)"
  ).run();
  await env.DB.prepare(
    "CREATE INDEX IF NOT EXISTS idx_events_ip_hash ON events(ip_hash)"
  ).run();
}

async function hashValue(value, salt) {
  const data = new TextEncoder().encode(`${value}:${salt}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function getAuthToken(env) {
  if (!env.ADMIN_PASSWORD) {
    return null;
  }
  return hashValue(env.ADMIN_PASSWORD, SESSION_SALT);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function getClientIp(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "0.0.0.0"
  );
}

function getDateFilter(period) {
  if (period === "today") {
    return "AND date(created_at) = date('now')";
  }
  if (period === "7d") {
    return "AND created_at >= datetime('now', '-7 days')";
  }
  return "";
}

async function isRateLimited(env, ipHash) {
  const recent = await env.DB.prepare(
    `SELECT COUNT(*) AS count
     FROM events
     WHERE ip_hash = ? AND created_at >= datetime('now', '-1 minute')`
  )
    .bind(ipHash)
    .first();

  return (recent?.count ?? 0) >= RATE_LIMIT_MAX;
}

async function handleTrack(request, env) {
  try {
    await ensureSchema(env);

    const body = await request.json();
    const eventType = body?.type;
    const buttonPosition = body?.position ?? null;

    if (eventType !== "pageview" && eventType !== "download") {
      return json({ error: "Invalid event type" }, 400);
    }

    const ip = getClientIp(request);
    const ipHash = await hashValue(ip, IP_SALT);

    if (await isRateLimited(env, ipHash)) {
      return json({ ok: true, throttled: true });
    }

    const country = request.cf?.country ?? "UNKNOWN";
    const userAgent = request.headers.get("User-Agent")?.slice(0, 512) ?? null;

    await env.DB.prepare(
      `INSERT INTO events (event_type, ip_hash, country, button_position, user_agent)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(eventType, ipHash, country, buttonPosition, userAgent)
      .run();

    return json({ ok: true });
  } catch (error) {
    return json({ error: "Track failed" }, 500);
  }
}

async function handleLogin(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return json({ error: "Admin password not configured" }, 503);
  }

  try {
    const body = await request.json();
    const password = body?.password ?? "";

    if (password !== env.ADMIN_PASSWORD) {
      return json({ error: "Invalid password" }, 401);
    }

    const token = await getAuthToken(env);
    return json({ token });
  } catch (error) {
    return json({ error: "Login failed" }, 500);
  }
}

async function isAuthorized(request, env) {
  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  const expected = await getAuthToken(env);
  return Boolean(expected && token && token === expected);
}

async function handleStats(request, env, url) {
  if (!(await isAuthorized(request, env))) {
    return json({ error: "Unauthorized" }, 401);
  }

  try {
    await ensureSchema(env);

    const period = url.searchParams.get("period") ?? "all";
    const dateFilter = getDateFilter(period);

    const totals = await env.DB.prepare(
      `SELECT
        SUM(CASE WHEN event_type = 'pageview' THEN 1 ELSE 0 END) AS pageviews,
        SUM(CASE WHEN event_type = 'download' THEN 1 ELSE 0 END) AS downloads
       FROM events
       WHERE 1 = 1 ${dateFilter}`
    ).first();

    const uniqueVisitors = await env.DB.prepare(
      `SELECT COUNT(DISTINCT ip_hash) AS count
       FROM events
       WHERE event_type = 'pageview' ${dateFilter}`
    ).first();

    const uniqueDownloadIps = await env.DB.prepare(
      `SELECT COUNT(DISTINCT ip_hash) AS count
       FROM events
       WHERE event_type = 'download' ${dateFilter}`
    ).first();

    const countries = await env.DB.prepare(
      `SELECT country, COUNT(*) AS count
       FROM events
       WHERE 1 = 1 ${dateFilter}
       GROUP BY country
       ORDER BY count DESC
       LIMIT 50`
    ).all();

    const countryVisitors = await env.DB.prepare(
      `SELECT country, COUNT(DISTINCT ip_hash) AS count
       FROM events
       WHERE event_type = 'pageview' ${dateFilter}
       GROUP BY country
       ORDER BY count DESC
       LIMIT 50`
    ).all();

    const buttonStats = await env.DB.prepare(
      `SELECT button_position, COUNT(*) AS count
       FROM events
       WHERE event_type = 'download' ${dateFilter}
       GROUP BY button_position
       ORDER BY count DESC`
    ).all();

    const recentEvents = await env.DB.prepare(
      `SELECT event_type, country, button_position, created_at
       FROM events
       WHERE 1 = 1 ${dateFilter}
       ORDER BY id DESC
       LIMIT 20`
    ).all();

    const formatCountry = (rows) =>
      (rows?.results ?? []).map((row) => ({
        country: row.country ?? "UNKNOWN",
        countryName: COUNTRY_NAMES[row.country] ?? row.country ?? "未知",
        count: row.count,
      }));

    return json({
      period,
      pageviews: totals?.pageviews ?? 0,
      downloads: totals?.downloads ?? 0,
      uniqueVisitors: uniqueVisitors?.count ?? 0,
      uniqueDownloadIps: uniqueDownloadIps?.count ?? 0,
      countries: formatCountry(countries),
      countryVisitors: formatCountry(countryVisitors),
      buttonStats: (buttonStats?.results ?? []).map((row) => ({
        position: row.button_position ?? "unknown",
        count: row.count,
      })),
      recentEvents: recentEvents?.results ?? [],
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return json({ error: "Stats failed" }, 500);
  }
}

async function serveAdmin(request, env) {
  const assetUrl = new URL("/admin.html", request.url);
  const asset = await env.ASSETS.fetch(new Request(assetUrl.toString(), request));
  const headers = new Headers(asset.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(asset.body, {
    status: asset.status,
    headers,
  });
}
