/* eslint-env node */

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const indexSource = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const navbarTemplate = indexSource.match(
  / {4}<nav class="navbar navbar-expand-lg">[\s\S]*? {4}<\/nav>/
)?.[0];
const footerTemplate = indexSource.match(
  / {8}<footer class="site-footer"[\s\S]*? {8}<\/footer>/
)?.[0];

if (!navbarTemplate || !footerTemplate) {
  throw new Error('Ana sayfadaki ortak navbar veya footer bulunamadı.');
}

const blogFiles = [
  'blog/index.html',
  'blog/amigurumi-oyuncak-bakimi/index.html',
  'blog/amigurumi-hediye-secimi/index.html',
  'blog/kisiye-ozel-amigurumi-tasarim/index.html'
];

const localizeLayout = (template, rootPrefix, topTarget) =>
  template
    .replaceAll('href="#anasayfa"', `href="${rootPrefix}index.html"`)
    .replaceAll('href="#hakkimizda"', `href="${rootPrefix}index.html#hakkimizda"`)
    .replaceAll('href="#urunler"', `href="${rootPrefix}index.html#urunler"`)
    .replaceAll('href="#blog"', `href="${rootPrefix}blog/index.html"`)
    .replaceAll('href="#sss"', `href="${rootPrefix}index.html#sss"`)
    .replaceAll('href="#iletisim"', `href="${rootPrefix}index.html#iletisim"`)
    .replaceAll('href="blog/index.html"', `href="${rootPrefix}blog/index.html"`)
    .replace(
      `class="nav-link" href="${rootPrefix}blog/index.html"`,
      `class="nav-link is-active" href="${rootPrefix}blog/index.html"`
    )
    .replaceAll(`href="${rootPrefix}index.html"\n            aria-label="Yukarı kaydır"`, `href="#${topTarget}"\n            aria-label="Yukarı kaydır"`)
    .replace(/^ {8}/gm, '    ');

for (const relativePath of blogFiles) {
  const absolutePath = path.join(rootDir, relativePath);
  const depth = relativePath.split('/').length - 1;
  const rootPrefix = '../'.repeat(depth);
  const topTarget = relativePath === 'blog/index.html' ? 'blog-top' : 'article-top';
  let source = fs.readFileSync(absolutePath, 'utf8');
  const navbar = localizeLayout(navbarTemplate, rootPrefix, topTarget);
  const footer = localizeLayout(footerTemplate, rootPrefix, topTarget);

  source = source.replace(/ {4}<nav class="navbar navbar-expand-lg">[\s\S]*? {4}<\/nav>/, navbar);
  source = source.replace(
    / {4}<footer class="(?:blog-footer|site-footer)"[\s\S]*? {4}<\/footer>/,
    footer
  );
  fs.writeFileSync(absolutePath, source, 'utf8');
}
