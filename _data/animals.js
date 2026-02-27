const fs = require("fs");
const path = require("path");

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

const jsonPath = path.join(__dirname, "..", "cms", "animals.json");
let data = [];
try {
  const raw = fs.readFileSync(jsonPath, "utf8");
  data = JSON.parse(raw);
} catch (_) {
  // ignore
}
if (!Array.isArray(data)) {
  data = data.animals || [];
}
const animalsWithSlug = data.map((a) => ({
  ...a,
  slug: animalSlug(a) || a.id || "detail",
}));

module.exports = { animals: data, animalsEnriched: animalsWithSlug };
