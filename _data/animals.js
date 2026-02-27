const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

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

function animalSlug(animal) {
  if (!animal || typeof animal !== "object") return "";
  const species = slugifyCzech(animal.species ?? "");
  const name = slugifyCzech(animal.name ?? animal.id ?? "");
  return name ? `${species}-${name}` : species || animal.id || "detail";
}

const FALLBACK_IMAGE = "images/cat-illustration.svg";

async function enrichAnimalImage(animal) {
  if (!animal || !animal.image) {
    return animal;
  }

  const projectRoot = path.join(__dirname, "..");
  const imagePath = animal.image.replace(/^\//, "");
  const src = path.join(projectRoot, imagePath);

  try {
    const stats = fs.statSync(src);
    if (!stats.isFile()) {
      return {
        ...animal,
        image: FALLBACK_IMAGE,
      };
    }
  } catch {
    // Source image does not exist locally – fall back to a safe placeholder
    return {
      ...animal,
      image: FALLBACK_IMAGE,
    };
  }

  const slug = animal.slug || animalSlug(animal) || animal.id || "detail";

  let metadata;
  try {
    metadata = await Image(src, {
      widths: [400, 800, 1200],
      formats: ["webp"],
      outputDir: "./public/images/animals/",
      urlPath: "/images/animals/",
    });
  } catch {
    // If processing fails, keep the original image (or placeholder) without srcset
    return {
      ...animal,
      image: FALLBACK_IMAGE,
    };
  }

  const webpVariants = metadata.webp || [];
  if (!webpVariants.length) {
    return animal;
  }

  const srcset = webpVariants
    .map((entry) => `${entry.url} ${entry.width}w`)
    .join(", ");

  const largest = webpVariants[webpVariants.length - 1];

  return {
    ...animal,
    slug,
    image: largest.url,
    imageSrcset: srcset,
    imageSizes: animal.imageSizes || "(max-width: 533px) 100vw, 533px",
  };
}

module.exports = async function () {
  const jsonPath = path.join(__dirname, "..", "cms", "animals.json");
  let data = [];
  try {
    const raw = fs.readFileSync(jsonPath, "utf8");
    data = JSON.parse(raw);
  } catch {
    data = [];
  }
  if (!Array.isArray(data)) {
    data = data.animals || [];
  }

  const animalsWithSlug = data.map((a) => ({
    ...a,
    slug: animalSlug(a) || a.id || "detail",
  }));

  const animalsEnriched = await Promise.all(
    animalsWithSlug.map((animal) => enrichAnimalImage(animal)),
  );

  return {
    animals: data,
    animalsEnriched,
  };
};
