const fs = require("fs");
const path = require("path");

module.exports = function () {
  const jsonPath = path.join(__dirname, "..", "cms", "vyrocni-zpravy.json");
  let data = [];
  try {
    const raw = fs.readFileSync(jsonPath, "utf8");
    data = JSON.parse(raw);
  } catch {
    data = [];
  }
  if (!Array.isArray(data)) {
    data = data.reports || [];
  }

  const reports = data.filter(
    (r) =>
      r &&
      typeof r === "object" &&
      typeof r.name === "string" &&
      r.name.trim() &&
      typeof r.file === "string" &&
      r.file.trim(),
  );

  return { reports };
};
