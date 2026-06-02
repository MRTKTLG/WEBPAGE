const { spawn } = require('node:child_process');
const { chromium } = require('@playwright/test');

const PORT = Number(process.env.MOBILE_TOUCH_TEST_PORT || 8123);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SERVER_READY_TIMEOUT_MS = 8000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startServer = () =>
  new Promise((resolve, reject) => {
    const server = spawn(process.execPath, ['server.mjs'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PORT: String(PORT)
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      server.kill();
      reject(new Error(`Server did not start within ${SERVER_READY_TIMEOUT_MS}ms.`));
    }, SERVER_READY_TIMEOUT_MS);

    const handleOutput = (chunk) => {
      const output = chunk.toString();
      if (!output.includes(BASE_URL) || settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(server);
    };

    server.stdout.on('data', handleOutput);
    server.stderr.on('data', handleOutput);
    server.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });
    server.on('exit', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(new Error(`Server exited before test start with code ${code}.`));
    });
  });

const getFirstProductMedia = (page) => page.locator('.product-carousel .product-media').first();

const getCenterPoint = async (locator) => {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('Product media is not visible.');
  }

  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2
  };
};

const isPreviewActive = (page) =>
  page.locator('.product-media.is-touch-preview-active').count().then((count) => count > 0);

const clearPreview = async (page) => {
  await page.touchscreen.tap(12, 12);
  await page.waitForFunction(
    () => !document.querySelector('.product-media.is-touch-preview-active'),
    null,
    { timeout: 1200 }
  );
};

const dispatchTouchDragOnMedia = async (page) => {
  await page.evaluate(() => {
    const mediaEl = document.querySelector('.product-carousel .product-media');
    if (!mediaEl) throw new Error('Product media not found.');

    const rect = mediaEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const pointerId = 17;

    const fire = (type, clientY) => {
      mediaEl.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY,
          isPrimary: true,
          pointerId,
          pointerType: 'touch'
        })
      );
    };

    fire('pointerdown', y);
    window.scrollBy(0, 90);
    fire('pointermove', y + 90);
    fire('pointerup', y + 90);
  });
};

(async () => {
  const server = await startServer();
  let browser;

  try {
    browser = await chromium.launch();
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: {
        width: 390,
        height: 844
      }
    });
    const page = await context.newPage();

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const media = getFirstProductMedia(page);
    await media.scrollIntoViewIfNeeded();
    await wait(320);

    const tapPoint = await getCenterPoint(media);
    await page.touchscreen.tap(tapPoint.x, tapPoint.y);
    await page.waitForFunction(
      () => document.querySelector('.product-media.is-touch-preview-active'),
      null,
      { timeout: 1200 }
    );

    await clearPreview(page);

    await page.evaluate(() => window.scrollBy(0, 72));
    await wait(80);
    const movingTapPoint = await getCenterPoint(media);
    await page.touchscreen.tap(movingTapPoint.x, movingTapPoint.y);
    await wait(220);
    if (await isPreviewActive(page)) {
      throw new Error('Preview activated immediately after page scroll.');
    }

    await wait(500);
    await media.scrollIntoViewIfNeeded();
    await wait(320);
    await dispatchTouchDragOnMedia(page);
    await wait(220);
    if (await isPreviewActive(page)) {
      throw new Error('Preview activated during touch drag/scroll on product media.');
    }

    await browser.close();
    server.kill();
    // eslint-disable-next-line no-console
    console.log('Mobile product touch smoke test passed.');
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    server.kill();
    throw error;
  }
})();
