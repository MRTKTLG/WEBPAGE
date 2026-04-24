import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 8000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self'"
  ].join('; ')
};

function writePlainResponse(res, status, message, cacheControl = 'no-store') {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': cacheControl,
    ...SECURITY_HEADERS
  });
  res.end(message);
}

function safeResolvePath(urlPathname) {
  let decoded = '/';
  try {
    decoded = decodeURIComponent(urlPathname.split('?')[0]);
  } catch {
    return null;
  }

  if (decoded.includes('\0')) return null;

  const normalized = path.posix.normalize(decoded);
  const relativePath = normalized.replace(/^\/+/, '');
  const absolutePath = path.resolve(__dirname, relativePath);
  const relativeToRoot = path.relative(__dirname, absolutePath);

  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
    return null;
  }

  return absolutePath;
}

function serveStatic(req, res) {
  const reqPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = safeResolvePath(reqPath);

  if (!filePath || !filePath.startsWith(__dirname)) {
    writePlainResponse(res, 403, 'Forbidden');
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    writePlainResponse(res, 404, 'Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    ...SECURITY_HEADERS
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on('error', () => {
    if (res.headersSent) {
      res.destroy();
      return;
    }
    writePlainResponse(res, 500, 'Internal Server Error');
  });
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    writePlainResponse(res, 400, 'Bad Request');
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    writePlainResponse(res, 405, 'Method Not Allowed');
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
