#!/usr/bin/env node

import { Command } from "commander";
import express from "express";
import proxy from "express-http-proxy";
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

// Serve HTML harness for specific routes only
const html = readFileSync(join(__dirname, "index.html"), "utf-8");
app.get(["/", "/redirect", "/widget"], (_req, res) => {
  res.type("html").send(html);
});

// Proxy all other paths to mini app
const proxyMiddleware = proxy(url);
app.use("/app", proxyMiddleware);
app.use(proxyMiddleware);

app.listen(port, () => {
  console.log(`\nLoading mini app: ${url}`);
  console.log(`OCID Mini App Harness running at http://localhost:${port}`);
});
