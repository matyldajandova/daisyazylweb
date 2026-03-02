const baseConfig = require("./.eleventy.cjs");

module.exports = function (eleventyConfig) {
  const config = baseConfig(eleventyConfig);

  // During --serve, serve passthrough files (e.g. images/uploads) from source
  // so CMS uploads are visible in preview without rebuilding (Eleventy standard).
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  return config;
};

