const fs = require("fs");
const path = require("path");

module.exports = function () {
  const jsonPath = path.join(__dirname, "..", "cms", "partners.json");
  let data = [];
  try {
    const raw = fs.readFileSync(jsonPath, "utf8");
    data = JSON.parse(raw);
  } catch {
    data = [];
  }
  if (!Array.isArray(data)) {
    data = data.partners || [];
  }

  const partners = data.filter(
    (p) =>
      p &&
      typeof p === "object" &&
      typeof p.name === "string" &&
      p.name.trim() &&
      typeof p.logo === "string" &&
      p.logo.trim(),
  );

  return { partners };
};
