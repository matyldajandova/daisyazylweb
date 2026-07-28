/** Czech-friendly URL slug (e.g. "Bětuška" → "betuska", "kočka" → "kocka"). */
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

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("slug", (str) => slugifyCzech(String(str ?? "")));
  eleventyConfig.addFilter("animalSlug", (animal) => {
    if (!animal || typeof animal !== "object") return "";
    const species = slugifyCzech(animal.species ?? "");
    const name = slugifyCzech(animal.name ?? animal.id ?? "");
    return name ? `${species}-${name}` : species || animal.id || "detail";
  });

  // Prepared by scripts/prepare-cms-config.js (injects production base_url for GitHub OAuth).
  // Decap loads /config.yml because admin/index.html sets <base href="/">.
  eleventyConfig.addPassthroughCopy({ ".cms-config/config.yml": "config.yml" });
  eleventyConfig.addPassthroughCopy({ public: "." });
  eleventyConfig.addPassthroughCopy("images");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    templateFormats: ["html", "md", "liquid"],
  };
};