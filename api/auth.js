/**
 * Decap CMS → GitHub OAuth: start authorization.
 * Env: GITHUB_CLIENT_ID
 */
function publicOrigin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  if (!host) return null;
  return `${proto}://${host}`.replace(/\/$/, "");
}

module.exports = function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Missing GITHUB_CLIENT_ID");
    return;
  }

  const origin = publicOrigin(req);
  if (!origin) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Missing host");
    return;
  }

  const redirectUri = `${origin}/api/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo user",
  });

  res.statusCode = 302;
  res.setHeader("Location", `https://github.com/login/oauth/authorize?${params}`);
  res.end();
};
