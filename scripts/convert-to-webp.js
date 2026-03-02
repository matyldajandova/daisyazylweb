/* Convert bitmap images (PNG/JPEG) in the project to WebP.
 * - Scans the `public` and `images` directories recursively.
 * - For every `.png`, `.jpg`, or `.jpeg` file, creates a `.webp` sibling
 *   next to it if it does not already exist.
 *
 * This is intended to be run via `npm run images:webp`.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOTS = [
  path.join(__dirname, "..", "public"),
  path.join(__dirname, "..", "images"),
];

const BITMAP_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and build output
      if (entry.name === "node_modules" || entry.name === "_site") continue;
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (BITMAP_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

async function convertFile(src) {
  const ext = path.extname(src);
  const base = src.slice(0, -ext.length);
  const dest = `${base}.webp`;

  if (fs.existsSync(dest)) {
    return;
  }

  await sharp(src)
    .toFormat("webp", { quality: 80 })
    .toFile(dest);
}

async function main() {
  const allFiles = [];

  for (const root of ROOTS) {
    if (!fs.existsSync(root)) continue;
    const stats = fs.statSync(root);
    if (!stats.isDirectory()) continue;

    // eslint-disable-next-line no-console
    console.log(`Scanning ${root} for bitmap images...`);
    const files = await walk(root);
    allFiles.push(...files);
  }

  if (!allFiles.length) {
    // eslint-disable-next-line no-console
    console.log("No bitmap images found.");
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`Found ${allFiles.length} bitmap files. Converting to WebP...`);

  for (const file of allFiles) {
    // eslint-disable-next-line no-console
    console.log(`Converting ${file}`);
    try {
      await convertFile(file);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to convert ${file}:`, err.message);
    }
  }

  // eslint-disable-next-line no-console
  console.log("Conversion to WebP finished.");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

