/**
 * Generates a default Open Graph image (title + date) for any post that
 * does not define its own `coverImage` in front matter.
 *
 * Runs at build time (see `.eleventy.js` -> `eleventy.before`), rendering
 * via satori (HTML/CSS -> SVG) and @resvg/resvg-js (SVG -> PNG), so no
 * headless browser is required. Output is written to `img/og/<slug>.png`,
 * which is already passthrough-copied to the site output as `img/`.
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const moment = require("moment");
const nunjucks = require("nunjucks");
const { Resvg } = require("@resvg/resvg-js");

const POSTS_DIR = path.resolve(__dirname, "../posts");
const FONTS_DIR = path.resolve(__dirname, "../fonts");
const OUTPUT_DIR = path.resolve(__dirname, "../img/og");
const TEMPLATE_PATH = path.join(__dirname, "template.njk");

const WIDTH = 1200;
const HEIGHT = 630;

function walkMarkdownFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function titleFontSize(title) {
  if (title.length > 70) return 64;
  if (title.length > 45) return 72;
  return 80;
}

// We escape values ourselves via escapeHtml() before rendering, and
// satori-html's HTML parser does not decode named/numeric entities in text
// nodes — so nunjucks' own autoescaping (which would turn a plain "'" into
// the literal text "&#39;") must be disabled here.
const nunjucksEnv = new nunjucks.Environment(null, { autoescape: false });

/**
 * Renders `template.njk` with the given data and returns the HTML string.
 * Exported so the design can be previewed outside of the full generation
 * pipeline (see `_og-image/preview.js`).
 */
function renderTemplate(data) {
  return nunjucksEnv.renderString(fs.readFileSync(TEMPLATE_PATH, "utf-8"), data);
}

/**
 * Loads the Inter font files satori needs (regular/bold, normal/italic).
 * Exported so `_og-image/preview.js` uses the exact same font set.
 */
function loadFonts() {
  const load = (name) => fs.readFileSync(path.join(FONTS_DIR, name));
  return [
    { name: "Inter", data: load("Inter-Regular.ttf"), weight: 400, style: "normal" },
    { name: "Inter", data: load("Inter-Bold.ttf"), weight: 700, style: "normal" },
    { name: "Inter", data: load("Inter-Italic.ttf"), weight: 400, style: "italic" },
    { name: "Inter", data: load("Inter-BoldItalic.ttf"), weight: 700, style: "italic" },
  ];
}

async function generateMissingOgImages() {
  const { default: satori } = await import("satori");
  const { html } = await import("satori-html");

  const fonts = loadFonts();
  const templateMtime = fs.statSync(TEMPLATE_PATH).mtimeMs;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = walkMarkdownFiles(POSTS_DIR);

  for (const file of files) {
    const { data } = matter(fs.readFileSync(file, "utf-8"));
    if (!data.title || !data.date) continue;
    if (data.coverImage) continue;

    const slug = path.basename(file, ".md");
    const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);

    if (
      fs.existsSync(outputPath) &&
      fs.statSync(outputPath).mtimeMs >= fs.statSync(file).mtimeMs &&
      fs.statSync(outputPath).mtimeMs >= templateMtime
    ) {
      continue;
    }

    const title = escapeHtml(data.title);
    const dateStr = moment(data.date).format("DD MMMM YYYY");
    const fontSize = titleFontSize(data.title);

    const markup = html(
      renderTemplate({ width: WIDTH, height: HEIGHT, title, date: dateStr, fontSize })
    );

    const svg = await satori(markup, {
      width: WIDTH,
      height: HEIGHT,
      fonts,
    });

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
    const png = resvg.render().asPng();
    fs.writeFileSync(outputPath, png);
    console.log(`[og-image] generated img/og/${slug}.png`);
  }
}

module.exports = { generateMissingOgImages, renderTemplate, loadFonts };
