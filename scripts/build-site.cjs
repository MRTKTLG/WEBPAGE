/* eslint-env node */

const nodeCrypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const { PurgeCSS } = require('purgecss');

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, '_site');
const outputAssetsDir = path.join(outputDir, 'assets');

const readSource = (relativePath) => fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
const writeOutput = (relativePath, content) => {
  const outputPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf8');
};

const formatBytes = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

async function build() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputAssetsDir, { recursive: true });

  const htmlFiles = ['index.html'];
  const collectHtmlFiles = (directory, prefix = '') => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relativePath = path.join(prefix, entry.name);
      if (entry.isDirectory()) {
        collectHtmlFiles(path.join(directory, entry.name), relativePath);
      } else if (entry.name.endsWith('.html')) {
        htmlFiles.push(relativePath);
      }
    }
  };
  const blogDir = path.join(rootDir, 'blog');
  if (fs.existsSync(blogDir)) collectHtmlFiles(blogDir, 'blog');
  const htmlSources = htmlFiles.map((relativePath) => ({
    relativePath,
    source: readSource(relativePath)
  }));
  const allHtmlSource = htmlSources.map(({ source }) => source).join('\n');
  const appSource = readSource('assets/app.js');
  const stylesSource = readSource('assets/styles.css');
  const bootstrapSource = fs.readFileSync(
    require.resolve('bootstrap/dist/css/bootstrap.min.css'),
    'utf8'
  );
  const [purgedBootstrap] = await new PurgeCSS().purge({
    content: [
      {
        raw: `${allHtmlSource}\n${appSource}\n${stylesSource}`,
        extension: 'html'
      }
    ],
    css: [{ raw: bootstrapSource }],
    safelist: {
      standard: [
        'active',
        'collapsed',
        'collapsing',
        'fade',
        'hiding',
        'show',
        'showing',
        /^accordion-/,
        /^carousel-/,
        /^modal-/,
        /^navbar-/
      ]
    }
  });
  const combinedStyles = `${purgedBootstrap.css}\n${stylesSource}`;
  const bundledAppSource = `
    import Carousel from 'bootstrap/js/dist/carousel';
    import Collapse from 'bootstrap/js/dist/collapse';
    import Modal from 'bootstrap/js/dist/modal';
    window.bootstrap = { Carousel, Collapse, Modal };
    ${appSource}
  `;

  const [cssResult, jsResult] = await Promise.all([
    esbuild.transform(combinedStyles, {
      loader: 'css',
      minify: true,
      target: ['chrome90', 'edge90', 'firefox88', 'safari14'],
      legalComments: 'none'
    }),
    esbuild.build({
      stdin: {
        contents: bundledAppSource,
        loader: 'js',
        resolveDir: rootDir
      },
      bundle: true,
      write: false,
      format: 'iife',
      minify: true,
      target: ['es2020'],
      legalComments: 'none',
      charset: 'utf8'
    })
  ]);

  const jsCode = jsResult.outputFiles[0].text;
  const versionToken = nodeCrypto
    .createHash('sha256')
    .update(cssResult.code)
    .update(jsCode)
    .digest('hex')
    .slice(0, 12);

  for (const { relativePath, source } of htmlSources) {
    const html = source
      .replace(/\s*<link[^>]*data-build-remove[^>]*\/>/g, '')
      .replace(/\s*<script[^>]*data-build-remove[^>]*><\/script>/g, '')
      .replace(/assets\/styles\.css\?v=[^"]+/g, `assets/styles.css?v=${versionToken}`)
      .replace(/assets\/app\.js\?v=[^"]+/g, `assets/app.js?v=${versionToken}`);
    writeOutput(relativePath, html);
  }
  writeOutput('assets/styles.css', cssResult.code);
  writeOutput('assets/app.js', jsCode);
  fs.copyFileSync(path.join(rootDir, 'sitemap.xml'), path.join(outputDir, 'sitemap.xml'));
  fs.cpSync(path.join(rootDir, 'assets/img'), path.join(outputAssetsDir, 'img'), {
    recursive: true
  });
  fs.writeFileSync(path.join(outputDir, '.nojekyll'), '', 'utf8');

  const sourceCssBytes = Buffer.byteLength(bootstrapSource) + Buffer.byteLength(stylesSource);
  const sourceJsBytes =
    Buffer.byteLength(appSource) +
    fs.statSync(require.resolve('bootstrap/dist/js/bootstrap.min.js')).size;
  const outputCssBytes = Buffer.byteLength(cssResult.code);
  const outputJsBytes = Buffer.byteLength(jsCode);

  // eslint-disable-next-line no-console
  console.log(
    `Production assets: CSS ${formatBytes(sourceCssBytes)} → ${formatBytes(outputCssBytes)}, ` +
      `JS ${formatBytes(sourceJsBytes)} → ${formatBytes(outputJsBytes)}, cache ${versionToken}`
  );
}

build().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
