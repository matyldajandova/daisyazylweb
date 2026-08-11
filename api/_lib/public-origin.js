/**
 * Resolve the public site origin for OAuth redirect_uri construction.
 * Prefers Vercel forwarded headers; defaults to http on localhost.
 */
function publicOrigin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (!host) return null;

  const hostname = String(host).split(":")[0];
  const isLocal =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";

  const forwarded = req.headers["x-forwarded-proto"];
  const proto = forwarded || (isLocal ? "http" : "https");

  return `${proto}://${host}`.replace(/\/$/, "");
}

module.exports = { publicOrigin };
