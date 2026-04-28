const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const versionToken = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

const nextHtml = indexHtml
  .replace(/assets\/styles\.css\?v=[^"]+/g, `assets/styles.css?v=${versionToken}`)
  .replace(/assets\/app\.js\?v=[^"]+/g, `assets/app.js?v=${versionToken}`);

if (nextHtml === indexHtml) {
  // eslint-disable-next-line no-console
  console.log('No version token updated in index.html');
  process.exit(0);
}

fs.writeFileSync(indexPath, nextHtml, 'utf8');
// eslint-disable-next-line no-console
console.log(`Asset version updated: ${versionToken}`);
