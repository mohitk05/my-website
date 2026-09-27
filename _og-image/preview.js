#!/usr/bin/env node
/**
 * Hot-reloading preview server for the OG image design (`template.njk`).
 *
 * Watches `template.njk` and the font files, re-rendering the PNG on every
 * change and pushing a live reload to the browser via Server-Sent Events.
 * Lets you iterate on the design without running the full Eleventy build.
 *
 * Usage:
 *   node _og-image/preview.js
 *   node _og-image/preview.js "Custom title to test" "01 January 2026"
 *
 * Then open http://localhost:4001
 */
const fs = require("fs");
const path = require("path");
const http = require("http");
const chokidar = require("chokidar");
const { Resvg } = require("@resvg/resvg-js");
const { renderTemplate, loadFonts } = require("./generate");

const TEMPLATE_PATH = path.join(__dirname, "template.njk");
const FONTS_DIR = path.resolve(__dirname, "../fonts");
const WIDTH = 1200;
const HEIGHT = 630;
const PORT = process.env.PORT || 4001;

const title =
  process.argv[2] ||
  "Software runtimes: AOT compiled, interpreted, JIT compiled and more";
const date = process.argv[3] || "26 September 2026";
const fontSize = title.length > 70 ? 64 : title.length > 45 ? 72 : 80;

let latestPng = null;
let clients = [];

async function render() {
  const { default: satori } = await import("satori");
  const { html } = await import("satori-html");

  const markup = html(
    renderTemplate({ width: WIDTH, height: HEIGHT, title, date, fontSize })
  );

  const svg = await satori(markup, {
    width: WIDTH,
    height: HEIGHT,
    fonts: loadFonts(),
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
  latestPng = resvg.render().asPng();
}

function notifyClients() {
  for (const res of clients) res.write("data: reload\n\n");
}

async function rerender(reason) {
  try {
    await render();
    console.log(`[preview] re-rendered (${reason})`);
    notifyClients();
  } catch (err) {
    console.error(`[preview] render failed: ${err.message}`);
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/preview.png")) {
    res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "no-store" });
    res.end(latestPng);
    return;
  }

  if (req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("\n");
    clients.push(res);
    req.on("close", () => {
      clients = clients.filter((c) => c !== res);
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<!doctype html>
<html>
  <head>
    <title>OG image preview</title>
    <style>
      body { margin:0; background:#0b0f19; display:flex; align-items:center; justify-content:center; min-height:100vh; }
      img { max-width:90vw; box-shadow:0 10px 40px rgba(0,0,0,0.5); }
    </style>
  </head>
  <body>
    <img id="preview" src="/preview.png" alt="OG image preview" />
    <script>
      const img = document.getElementById("preview");
      const events = new EventSource("/events");
      events.onmessage = () => {
        img.src = "/preview.png?t=" + Date.now();
      };
    </script>
  </body>
</html>`);
});

async function main() {
  await render();
  server.listen(PORT, () => {
    console.log(`[preview] watching template.njk — http://localhost:${PORT}`);
  });

  chokidar
    .watch([TEMPLATE_PATH, FONTS_DIR], { ignoreInitial: true })
    .on("all", (event, file) => rerender(path.relative(process.cwd(), file)));
}

main();
