#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "cms", "animals.json");
const DEST_DIR = path.join(ROOT, "cms", "animals");

function slugifyCzech(str) {
  if (str == null || typeof str !== "string") return "";
  const map = {
    á: "a", č: "c", ď: "d", é: "e", ě: "e", í: "i", ň: "n", ó: "o",
    ř: "r", š: "s", ť: "t", ú: "u", ů: "u", ý: "y", ž: "z",
    Á: "a", Č: "c", Ď: "d", É: "e", Ě: "e", Í: "i", Ň: "n", Ó: "o",
    Ř: "r", Š: "s", Ť: "t", Ú: "u", Ů: "u", Ý: "y", Ž: "z",
  };
  let s = str.trim().toLowerCase();
  s = s.replace(/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g, (c) => map[c] ?? c);
  s = s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return s;
}

function fileSlug(animal) {
  const id = String(animal.id ?? "").trim();
  const name = slugifyCzech(animal.name || id || "zvire");
  if (id && name) return `${id}-${name}`;
  return id || name || "zvire";
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Missing ${SOURCE}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const animals = Array.isArray(raw) ? raw : raw.animals || [];
  if (!animals.length) {
    console.error("No animals found in cms/animals.json");
    process.exit(1);
  }

  fs.mkdirSync(DEST_DIR, { recursive: true });

  const used = new Set();
  for (const animal of animals) {
    let slug = fileSlug(animal);
    if (used.has(slug)) {
      slug = `${slug}-${used.size}`;
    }
    used.add(slug);
    const dest = path.join(DEST_DIR, `${slug}.json`);
    fs.writeFileSync(dest, `${JSON.stringify(animal, null, 2)}\n`);
  }

  console.log(`Wrote ${animals.length} files to ${DEST_DIR}`);
}

main();
