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
    "script-src 'self' https://code.jquery.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self' https://graph.instagram.com"
  ].join('; ')
};

function writeJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...SECURITY_HEADERS
  });
  res.end(JSON.stringify(payload));
}

async function handleInstagramFeed(res) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    writeJson(res, 200, { items: [] });
    return;
  }

  try {
    const endpoint = new URL(`https://graph.instagram.com/${encodeURIComponent(userId)}/media`);
    endpoint.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
    endpoint.searchParams.set('limit', '12');
    endpoint.searchParams.set('access_token', token);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(endpoint, { method: 'GET', signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      writeJson(res, 502, { error: 'Instagram API request failed.' });
      return;
    }

    const payload = await response.json();
    const items = Array.isArray(payload?.data) ? payload.data : [];

    const normalized = items
      .filter((item) => item?.permalink && (item?.media_url || item?.thumbnail_url))
      .map((item) => ({
        id: item.id,
        caption: item.caption || '',
        permalink: item.permalink,
        media_type: item.media_type || '',
        image_url: item.media_type === 'VIDEO' ? (item.thumbnail_url || item.media_url) : (item.media_url || item.thumbnail_url),
        media_url: item.media_url || '',
        thumbnail_url: item.thumbnail_url || '',
        timestamp: item.timestamp || ''
      }));

    writeJson(res, 200, { items: normalized });
  } catch (error) {
    writeJson(res, 500, {
      error: 'Unexpected error while reading Instagram feed.'
    });
  }
}

function safeResolvePath(urlPathname) {
  let decoded = '/';
  try {
    decoded = decodeURIComponent(urlPathname.split('?')[0]);
  } catch {
    return null;
  }
  const normalized = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  return path.join(__dirname, normalized);
}

function serveStatic(req, res) {
  const reqPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = safeResolvePath(reqPath);

  if (!filePath || !filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404);
    res.end('Not Found');
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

  createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  if (req.url.startsWith('/api/instagram-feed')) {
    if (req.method !== 'GET') {
      writeJson(res, 405, { error: 'Method Not Allowed' });
      return;
    }
    await handleInstagramFeed(res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, SECURITY_HEADERS);
    res.end('Method Not Allowed');
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
