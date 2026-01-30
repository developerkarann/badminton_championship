import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const URL = 'https://worldbedmintonbyag.my.canva.site/5pages';

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const outDir = path.resolve(process.cwd(), 'tmp/canva-capture');
  await ensureDir(outDir);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120_000 });
  // Canva pages often hydrate slowly.
  await page.waitForLoadState('networkidle', { timeout: 120_000 }).catch(() => {});
  await page.waitForTimeout(4000);

  const html = await page.content();
  await fs.writeFile(path.join(outDir, 'page.html'), html, 'utf8');

  const meta = await page.evaluate(() => {
    const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean).sort();
    const els = Array.from(document.querySelectorAll('*'));
    const fonts = [];
    const fontSizes = [];
    const colors = [];
    for (const el of els) {
      const cs = window.getComputedStyle(el);
      fonts.push(cs.fontFamily);
      fontSizes.push(cs.fontSize);
      colors.push(cs.color);
    }
    return {
      title: document.title,
      url: location.href,
      viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
      counts: { elements: els.length },
      samples: {
        fonts: uniq(fonts).slice(0, 80),
        fontSizes: uniq(fontSizes).slice(0, 80),
        colors: uniq(colors).slice(0, 80),
      },
    };
  });
  await fs.writeFile(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');

  await page.screenshot({ path: path.join(outDir, 'full.png'), fullPage: true });

  // The actual site UI is hosted inside the embedded codelet iframe.
  const frame = page.frameLocator('iframe');

  // Capture the 5 "pages" via top navigation clicks inside the iframe.
  const pages = ['Home', 'Tournament', 'Players', 'History', 'Contact'];
  for (const name of pages) {
    const locator = frame.getByRole('link', { name, exact: true }).or(frame.getByRole('button', { name, exact: true }));
    await locator.first().click({ timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(1200);

    const safe = name.toLowerCase();
    const firstFrame = page.frames().find((f) => f !== page.mainFrame() && f.url().includes('/_assets/remote/embed/codelet/'));
    if (firstFrame) {
      await fs.writeFile(path.join(outDir, `${safe}.frame.html`), await firstFrame.content(), 'utf8');
    }
    await page.screenshot({ path: path.join(outDir, `${safe}.png`), fullPage: false });
  }

  await browser.close();
  console.log(`Captured to: ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

