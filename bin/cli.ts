#!/usr/bin/env node

import { Command } from "commander";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name("ochub-harness")
  .description("Test harness for OCID-authenticated mini apps")
  .requiredOption(
    "-u, --url <url>",
    "Mini app URL to load in iframe",
    "http://localhost:3000",
  )
  .option("-p, --port <port>", "Port to run the server on", "8080")
  .parse(process.argv);

const opts = program.opts();
const port = parseInt(opts.port, 10);
let url: string = opts.url;

if (url.startsWith("localhost:")) {
  url = `http://${url}`;
}

if (!url.startsWith("http://") && !url.startsWith("https://")) {
  console.error("Error: URL must start with http:// or https://");
  process.exit(1);
}

const app = express();

// Inject the mini-app URL into the HTML so the frontend knows where to point iframes
const html = readFileSync(join(__dirname, "index.html"), "utf-8").replace(
  "</head>",
  `<script>window.__MINIAPP_URL__=${JSON.stringify(url)}</script></head>`,
);
app.get(["/", "/redirect", "/widget"], (_req, res) => {
  res.type("html").send(html);
});

app.listen(port, () => {
  console.log(`\nLoading mini app: ${url}`);
  console.log(`OCID Mini App Harness running at http://localhost:${port}`);
});
