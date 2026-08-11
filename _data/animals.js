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

const SPECIES = [
  {
    key: "kočka",
    slug: "kocky",
    label: "Kočky",
    singular: "kočka",
  },
  {
    key: "pes",
    slug: "psi",
    label: "Psi",
    singular: "pes",
  },
];

const CATEGORIES = [
  {
    slug: "nove-prijati",
    label: "Nově přijatí",
    labelBySpecies: { kočka: "Nově přijaté", pes: "Nově přijatí" },
  },
  {
    slug: "hledaji-domov",
    label: "Hledají domov",
    labelBySpecies: { kočka: "Hledají domov", pes: "Hledají domov" },
  },
  {
    slug: "trvali-obyvatele",
    label: "Trvalí obyvatelé azylu (možnost virtuální adopce)",
    labelBySpecies: {
      kočka: "Trvalí obyvatelé azylu (možnost virtuální adopce)",
      pes: "Trvalí obyvatelé azylu (možnost virtuální adopce)",
    },
  },
  {
    slug: "felv",
    label: "FeLV+",
    labelBySpecies: { kočka: "FeLV+", pes: "FeLV+" },
    catsOnly: true,
  },
  {
    slug: "nasli-domov",
    label: "Našli domov",
    labelBySpecies: { kočka: "Našli domov", pes: "Našli domov" },
  },
  {
    slug: "v-nasich-srdcich",
    label: "V našich srdcích",
    labelBySpecies: { kočka: "V našich srdcích", pes: "V našich srdcích" },
  },
];

const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
const SPECIES_BY_KEY = Object.fromEntries(SPECIES.map((s) => [s.key, s]));
const SPECIES_BY_SLUG = Object.fromEntries(SPECIES.map((s) => [s.slug, s]));

/** Legacy Decap field → new category slug. */
const ADOPTION_STATUS_TO_CATEGORY = {
  permanent: "trvali-obyvatele",
  available: "hledaji-domov",
  reserved: "hledaji-domov",
  adopted: "nasli-domov",
};

const OUT_OF_SHELTER = new Set(["nasli-domov", "v-nasich-srdcich"]);

function normalizeGallery(gallery) {
  if (!Array.isArray(gallery)) return [];
  return gallery.map((item) => {
    if (typeof item === "string") {
      return { image: item };
    }
    if (item && typeof item === "object" && item.image) {
      return item;
    }
    return item;
  });
}

function resolveCategory(animal) {
  if (animal.category && CATEGORY_BY_SLUG[animal.category]) {
    return animal.category;
  }
  if (animal.adoptionStatus && ADOPTION_STATUS_TO_CATEGORY[animal.adoptionStatus]) {
    return ADOPTION_STATUS_TO_CATEGORY[animal.adoptionStatus];
  }
  return "nove-prijati";
}

function categoryLabel(categorySlug, speciesKey) {
  const cat = CATEGORY_BY_SLUG[categorySlug];
  if (!cat) return categorySlug;
  return cat.labelBySpecies[speciesKey] || cat.label;
}

function categoriesForSpecies(speciesKey) {
  return CATEGORIES.filter((c) => !(c.catsOnly && speciesKey !== "kočka"));
}

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
    // Write directly into the Eleventy output folder. Writing into public/ races
    // with Eleventy 3's parallel passthrough copy and can leave 404s in deploys.
    metadata = await Image(src, {
      widths: [400, 800, 1200],
      formats: ["webp"],
      outputDir: "./_site/images/animals/",
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

function buildListingPages(animalsEnriched) {
  const pages = [];

  for (const species of SPECIES) {
    const speciesAnimals = animalsEnriched.filter((a) => a.species === species.key);
    const speciesCategories = categoriesForSpecies(species.key);

    pages.push({
      id: `${species.slug}-all`,
      speciesSlug: species.slug,
      speciesKey: species.key,
      speciesLabel: species.label,
      categorySlug: null,
      categoryLabel: null,
      permalink: `/nasi-sverenci/${species.slug}/`,
      title: `${species.label} | Naši svěřenci | Daisy Azyl`,
      description: `${species.label} v péči azylu Daisy Azyl.`,
      listingHeading: species.label,
      listingTagline: "Naši svěřenci",
      listingIntro: `Podívejte se na ${species.key === "kočka" ? "kočičky" : "pejsky"}, které momentálně máme v péči.`,
      listingEmpty: `Momentálně tu nejsou žádní ${species.key === "kočka" ? "kočičí" : "psí"} svěřenci.`,
      animals: speciesAnimals,
      filterCategories: speciesCategories.map((c) => ({
        slug: c.slug,
        label: categoryLabel(c.slug, species.key),
        href: `/nasi-sverenci/${species.slug}/${c.slug}/`,
        count: speciesAnimals.filter((a) => a.category === c.slug).length,
      })),
    });

    for (const category of speciesCategories) {
      const animals = speciesAnimals.filter((a) => a.category === category.slug);
      const label = categoryLabel(category.slug, species.key);
      pages.push({
        id: `${species.slug}-${category.slug}`,
        speciesSlug: species.slug,
        speciesKey: species.key,
        speciesLabel: species.label,
        categorySlug: category.slug,
        categoryLabel: label,
        permalink: `/nasi-sverenci/${species.slug}/${category.slug}/`,
        title: `${label} – ${species.label} | Daisy Azyl`,
        description: `${label}: ${species.label.toLowerCase()} v azylu Daisy Azyl.`,
        listingHeading: label,
        listingTagline: species.label,
        listingIntro: `${species.label}: ${label.toLowerCase()}.`,
        listingEmpty: `V kategorii „${label}“ momentálně nejsou žádní ${species.key === "kočka" ? "kočičí" : "psí"} svěřenci.`,
        animals,
        filterCategories: speciesCategories.map((c) => ({
          slug: c.slug,
          label: categoryLabel(c.slug, species.key),
          href: `/nasi-sverenci/${species.slug}/${c.slug}/`,
          count: speciesAnimals.filter((a) => a.category === c.slug).length,
        })),
      });
    }
  }

  return pages;
}

function buildHub(animalsEnriched) {
  return SPECIES.map((species) => {
    const speciesAnimals = animalsEnriched.filter((a) => a.species === species.key);
    const categories = categoriesForSpecies(species.key).map((c) => {
      const animals = speciesAnimals.filter((a) => a.category === c.slug);
      return {
        slug: c.slug,
        label: categoryLabel(c.slug, species.key),
        href: `/nasi-sverenci/${species.slug}/${c.slug}/`,
        count: animals.length,
      };
    });
    return {
      ...species,
      href: `/nasi-sverenci/${species.slug}/`,
      count: speciesAnimals.length,
      categories,
    };
  });
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

  const animalsWithSlug = data.map((a) => {
    const category = resolveCategory(a);
    const speciesMeta = SPECIES_BY_KEY[a.species] || null;
    const tags = Array.isArray(a.tags) ? [...a.tags] : [];
    // Preserve reserved visibility when migrating from legacy adoptionStatus.
    if (a.adoptionStatus === "reserved" && !tags.includes("Rezervováno")) {
      tags.push("Rezervováno");
    }
    return {
      ...a,
      category,
      categoryLabel: categoryLabel(category, a.species),
      speciesSlug: speciesMeta ? speciesMeta.slug : slugifyCzech(a.species),
      listingHref: speciesMeta
        ? `/nasi-sverenci/${speciesMeta.slug}/${category}/`
        : "/nasi-sverenci/",
      inShelter: !OUT_OF_SHELTER.has(category),
      slug: animalSlug(a) || a.id || "detail",
      gallery: normalizeGallery(a.gallery),
      tags,
    };
  });

  const animalsEnriched = await Promise.all(
    animalsWithSlug.map((animal) => enrichAnimalImage(animal)),
  );

  const inShelterEnriched = animalsEnriched.filter((a) => a.inShelter);
  const adoptedEnriched = animalsEnriched.filter(
    (a) => a.category === "nasli-domov",
  );

  const listingPages = buildListingPages(animalsEnriched);
  const hub = buildHub(animalsEnriched);

  return {
    animals: data,
    animalsEnriched,
    inShelterEnriched,
    adoptedEnriched,
    listingPages,
    hub,
    categories: CATEGORIES,
    species: SPECIES,
    speciesBySlug: SPECIES_BY_SLUG,
    categoryBySlug: CATEGORY_BY_SLUG,
  };
};
