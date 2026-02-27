module.exports = {
  eleventyComputed: {
    permalink(data) {
      const items = data.pagination && data.pagination.items;
      const item = items && items[0];
      const segment = (item && typeof item === "object" && (item.slug || item.id))
        ? (item.slug || item.id)
        : (data.pagination && typeof data.pagination.pageNumber === "number"
          ? data.pagination.pageNumber
          : "detail");
      return "/adopce/" + segment + "/";
    },
  },
};
