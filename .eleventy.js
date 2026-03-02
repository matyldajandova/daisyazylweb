module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin/config.yml");
  eleventyConfig.addPassthroughCopy({ "admin/config.yml": "config.yml" });
  eleventyConfig.addPassthroughCopy({ public: "." });
  eleventyConfig.addPassthroughCopy("images");

  // During --serve, serve passthrough files (e.g. images/uploads) from source
  // so CMS uploads are visible in preview without rebuilding (Eleventy standard).
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
};

