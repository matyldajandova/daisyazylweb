const path = require("path");
const Image = require("@11ty/eleventy-img");

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

async function imageShortcode(src, alt, sizes = "100vw", widths = [400, 800, 1200]) {
  if (!src) {
    throw new Error("Image shortcode: `src` is required.");
  }
  if (!alt) {
    throw new Error(`Image shortcode: missing alt text for ${src}`);
  }

  const projectRoot = __dirname;
  const inputPath = path.join(projectRoot, src.replace(/^\//, ""));

  const metadata = await Image(inputPath, {
    widths,
    formats: ["avif", "webp", "jpeg"],
    outputDir: path.join(projectRoot, "public", "images", "generated"),
    urlPath: "/images/generated/",
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("slug", (str) => slugifyCzech(String(str ?? "")));
  eleventyConfig.addFilter("animalSlug", (animal) => {
    if (!animal || typeof animal !== "object") return "";
    const species = slugifyCzech(animal.species ?? "");
    const name = slugifyCzech(animal.name ?? animal.id ?? "");
    return name ? `${species}-${name}` : species || animal.id || "detail";
  });

  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  eleventyConfig.addPassthroughCopy("admin/config.yml");
  eleventyConfig.addPassthroughCopy({ "admin/config.yml": "config.yml" });
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