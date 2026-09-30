const baseConfig = require('./.eleventy.cjs');

module.exports = function (eleventyConfig) {
  const config = baseConfig(eleventyConfig);

  // During --serve, serve passthrough files (e.g. images/uploads) from source
  // so CMS uploads are visible in preview without rebuilding (Eleventy standard).
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');

  eleventyConfig.setServerOptions({
    middleware: [
      async function znesnazeWidget(req, res, next) {
        const url = req.url || '';
        if (!url.startsWith('/api/znesnaze')) return next();
        try {
          const { fetchCampaign } = require('./api/_lib/znesnaze');
          const data = await fetchCampaign();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=300');
          res.end(JSON.stringify(data));
        } catch {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'unavailable' }));
        }
      },
    ],
  });

  return config;
};
