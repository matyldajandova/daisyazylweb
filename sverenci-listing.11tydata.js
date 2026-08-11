module.exports = {
  pagination: {
    data: "animals.listingPages",
    size: 1,
    alias: "listing",
  },
  eleventyComputed: {
    permalink(data) {
      return data.listing && data.listing.permalink
        ? data.listing.permalink
        : false;
    },
    title(data) {
      return data.listing?.title || "Naši svěřenci | Daisy Azyl";
    },
    description(data) {
      return data.listing?.description || "";
    },
    listingHeading(data) {
      return data.listing?.listingHeading || "Naši svěřenci";
    },
    listingTagline(data) {
      return data.listing?.listingTagline || "Adopce";
    },
    listingIntro(data) {
      return data.listing?.listingIntro || "";
    },
    listingEmpty(data) {
      return data.listing?.listingEmpty || "Momentálně u nás nejsou žádní svěřenci.";
    },
  },
};
