import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.join(currentDir, "..", "public_html");
const port = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".otf": "font/otf"
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(request.url.split("?")[0]);
  let filePath = path.join(
    siteDir,
    requestPath === "/" ? "index.html" : requestPath
  );

  if (!filePath.startsWith(siteDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(siteDir, "index.html");
  }

  const extension = path.extname(filePath);

  response.writeHead(200, {
    "Content-Type": mimeTypes[extension] || "application/octet-stream"
  });

  response.end(fs.readFileSync(filePath));
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
