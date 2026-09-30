const CAMPAIGN_URL = 'https://www.znesnaze21.cz/sbirka/specialni-krmivo-pro-marody-z-daisy-azylu';
const DONATE_URL = `${CAMPAIGN_URL}/darovat`;

function clean(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#0*39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseZnesnazeHtml(html) {
  if (!html || typeof html !== 'string') return null;

  const decoded = html.replace(/&nbsp;/gi, ' ').replace(/&#160;/gi, ' ');
  const raisedMatch = decoded.match(/Vybráno\s+([\d\s]+)\s*Kč/i);
  const goalMatch = decoded.match(/\bz\s+([\d\s]+)\s*Kč/i);
  const scoreMatch = decoded.match(/data-score="(\d+(?:\.\d+)?)"/);
  const daysMatch = decoded.match(/class="funding-info__days"[^>]*>([\s\S]*?)<\/div>/i);
  const donorsMatch = decoded.match(/class="funding-info__donors"[^>]*>([\s\S]*?)<\/div>/i);
  const titleMatch = decoded.match(/<title>([^<]*)<\/title>/i);

  const raised = raisedMatch ? clean(raisedMatch[1]) : '';
  const goal = goalMatch ? clean(goalMatch[1]) : '';
  const percent = scoreMatch ? Math.round(Number(scoreMatch[1])) : null;
  if (!raised && percent == null) return null;

  return {
    title: titleMatch ? clean(titleMatch[1]) : 'Speciální krmivo pro marody z Daisy azylu',
    raisedLabel: raised ? `Vybráno ${raised} Kč` : '',
    goalLabel: goal ? `z ${goal} Kč` : '',
    percent: Number.isFinite(percent) ? percent : null,
    daysLabel: daysMatch ? clean(daysMatch[1]) : '',
    donorsLabel: donorsMatch ? clean(donorsMatch[1]) : '',
    url: CAMPAIGN_URL,
    donateUrl: DONATE_URL,
  };
}

async function fetchCampaign() {
  const response = await fetch(CAMPAIGN_URL, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'DaisyAzylWeb/1.0 (+https://daisyazyl.cz)',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Znesnáze ${response.status}`);
  }
  const parsed = parseZnesnazeHtml(await response.text());
  if (!parsed) throw new Error('Znesnáze parse failed');
  return parsed;
}

module.exports = {
  CAMPAIGN_URL,
  DONATE_URL,
  parseZnesnazeHtml,
  fetchCampaign,
};
