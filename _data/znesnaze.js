const { fetchCampaign } = require('../api/_lib/znesnaze');

module.exports = async function () {
  try {
    return await fetchCampaign();
  } catch (err) {
    console.warn('Znesnáze widget:', err && err.message ? err.message : err);
    return null;
  }
};
