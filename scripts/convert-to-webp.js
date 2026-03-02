#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT_DIR = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT_DIR, "images");
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, "public", "images");

const SOURCE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".JPG",
  ".JPEG",
  ".PNG",
]);

const force = process.argv.includes("--force");

async function collectSourceFiles(dir) {
  const results = [];
  let entries;

  try {
    entries = await fs.promises.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return results;
    }
    throw error;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectSourceFiles(fullPath);
      results.push(...nested);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SOURCE_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

async function needsConversion(sourcePath, targetPath) {
  if (force) return true;

  try {
    const [sourceStat, targetStat] = await Promise.all([
      fs.promises.stat(sourcePath),
      fs.promises.stat(targetPath),
    ]);

    return targetStat.mtimeMs < sourceStat.mtimeMs;
  } catch (error) {
    if (error.code === "ENOENT") {
      return true;
    }
    throw error;
  }
}

async function convertFile(sourcePath) {
  const ext = path.extname(sourcePath);
  const base = sourcePath.slice(0, -ext.length);
  const targetPath = `${base}.webp`;

  if (!(await needsConversion(sourcePath, targetPath))) {
    return { converted: 0, skipped: 1, failed: 0 };
  }

  try {
    await sharp(sourcePath).toFormat("webp").toFile(targetPath);
    return { converted: 1, skipped: 0, failed: 0 };
  } catch (error) {
    console.error(`Failed to convert ${sourcePath} → ${targetPath}:`, error.message);
    return { converted: 0, skipped: 0, failed: 1 };
  }
}

async function main() {
  console.log(`Scanning "${IMAGES_DIR}" and "${PUBLIC_IMAGES_DIR}" for PNG/JPEG images…`);

  const collections = await Promise.all([
    collectSourceFiles(IMAGES_DIR),
    collectSourceFiles(PUBLIC_IMAGES_DIR),
  ]);

  const files = collections.flat();

  if (files.length === 0) {
    console.log("No PNG/JPEG images found under images/ or public/images/. Nothing to do.");
    return;
  }

  console.log(
    `Found ${files.length} source image(s). Starting conversion${force ? " (force mode)" : ""}…`,
  );

  let totals = { converted: 0, skipped: 0, failed: 0 };

  for (const file of files) {
    const result = await convertFile(file);
    totals = {
      converted: totals.converted + result.converted,
      skipped: totals.skipped + result.skipped,
      failed: totals.failed + result.failed,
    };
  }

  console.log(
    `Done. Converted: ${totals.converted}, skipped (up-to-date): ${totals.skipped}, failed: ${totals.failed}.`,
  );

  if (totals.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Unexpected error during WebP conversion:", error);
  process.exitCode = 1;
});

