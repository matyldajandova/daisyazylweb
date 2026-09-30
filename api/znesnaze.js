const { fetchCampaign } = require('./_lib/znesnaze');

module.exports = async function handler(_req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  try {
    const data = await fetchCampaign();
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  } catch {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'unavailable' }));
  }
};
