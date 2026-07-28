/**
 * Build Decap config with the correct public site URL for GitHub OAuth.
 * Writes to .cms-config/config.yml (passthrough → /config.yml and /admin/config.yml).
 */
const fs = require("fs");
const path = require("path");

function resolveSiteUrl() {
  const raw =
    process.env.CMS_BASE_URL ||
    process.env.URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:8080";
  return String(raw).replace(/\/$/, "");
}

const siteUrl = resolveSiteUrl();
const srcPath = path.join(__dirname, "..", "admin", "config.yml");
const outDir = path.join(__dirname, "..", ".cms-config");
const outPath = path.join(outDir, "config.yml");

let yml = fs.readFileSync(srcPath, "utf8");
if (!/^  base_url:/m.test(yml)) {
  throw new Error("admin/config.yml is missing backend.base_url");
}
yml = yml.replace(/^  base_url:\s*.+$/m, `  base_url: ${siteUrl}`);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, yml);
console.log(`[prepare-cms-config] base_url → ${siteUrl}`);
