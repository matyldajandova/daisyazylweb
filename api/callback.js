/**
 * Decap CMS → GitHub OAuth: exchange code and hand token to the Decap popup.
 * Env: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 */
function publicOrigin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  if (!host) return null;
  return `${proto}://${host}`.replace(/\/$/, "");
}

function htmlPage(bodyScript) {
  return `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Logging in…</title></head>
  <body>
    <p>Logging you in to the CMS…</p>
    <script>${bodyScript}</script>
  </body>
</html>`;
}

function successScript(token) {
  const payload = JSON.stringify({ token, provider: "github" });
  return `
(function () {
  function receiveMessage(e) {
    window.opener.postMessage("authorization:github:success:" + ${JSON.stringify(payload)}, e.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();`;
}

function errorScript(message) {
  const safe = JSON.stringify(String(message || "OAuth failed"));
  return `
(function () {
  function receiveMessage(e) {
    window.opener.postMessage("authorization:github:error:" + ${safe}, e.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
  document.body.textContent = "Login failed: " + ${safe};
})();`;
}

module.exports = async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.end(htmlPage(errorScript("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET")));
    return;
  }

  const origin = publicOrigin(req);
  if (!origin) {
    res.statusCode = 400;
    res.end(htmlPage(errorScript("Missing host")));
    return;
  }

  const url = new URL(req.url, origin);
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error_description") || url.searchParams.get("error");

  if (oauthError) {
    res.statusCode = 400;
    res.end(htmlPage(errorScript(oauthError)));
    return;
  }

  if (!code) {
    res.statusCode = 400;
    res.end(htmlPage(errorScript("Missing OAuth code")));
    return;
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    });

    const data = await tokenRes.json();
    if (!tokenRes.ok || !data.access_token) {
      const msg = data.error_description || data.error || "Token exchange failed";
      res.statusCode = 400;
      res.end(htmlPage(errorScript(msg)));
      return;
    }

    res.statusCode = 200;
    res.end(htmlPage(successScript(data.access_token)));
  } catch (err) {
    res.statusCode = 500;
    res.end(htmlPage(errorScript(err.message || "Token exchange error")));
  }
};
