/**
 * Dev server that serves the built site and, for /images/uploads, serves
 * from the repo so CMS uploads are visible in preview without rebuilding.
 */
const path = require("path");
const express = require("express");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT) || 8080;

const app = express();

// Serve CMS uploads from repo so preview works for newly uploaded files
app.use("/images/uploads", express.static(path.join(root, "images", "uploads")));
// Serve the rest from the built site
app.use(express.static(path.join(root, "_site")));

app.listen(port, () => {
  console.log(`Serving at http://localhost:${port}`);
});
