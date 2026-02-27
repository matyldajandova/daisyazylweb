module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin/config.yml");
  eleventyConfig.addPassthroughCopy({ "admin/config.yml": "config.yml" });
  eleventyConfig.addPassthroughCopy({ public: "." });
};

