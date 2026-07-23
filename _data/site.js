/** Global site metadata for SEO, canonical URLs, and schema.org. */
module.exports = function () {
  const siteUrl = (process.env.URL || process.env.SITE_URL || "https://daisyazyl.cz").replace(/\/$/, "");
  return {
    siteUrl,
    featureFlags: {
      showAktuality: false,
    },
    siteName: "Daisy Azyl",
    legalName: "Daisy azyl z.s.",
    defaultOgImage: `${siteUrl}/images/og.png`,
    locale: "cs_CZ",
    localeAlternate: "cs",
    address: {
      streetAddress: "Nový 30",
      addressLocality: "Městec Králové",
      postalCode: "28903",
      addressCountry: "CZ",
      addressRegion: "Středočeský kraj",
    },
    contact: {
      telephone: "+420605793896",
      email: "daisyazyl@gmail.com",
      facebook: "https://www.facebook.com/daisyazyl",
      instagram: "https://www.instagram.com/daisyazylzs/",
    },
    taxID: "21636982", // IČO
  };
};
