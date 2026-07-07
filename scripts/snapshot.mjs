// Capture DOM + full-page screenshots of every route into site-snapshots/
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:5173';
const OUT = path.resolve('site-snapshots');

const PAGES = [
  { name: 'home', url: '/' },
  { name: 'shop-all', url: '/category/all' },
  { name: 'product-cami-set-cream', url: '/product/cami-set-cream' },
  { name: 'product-cami-set-brown', url: '/product/cami-set-brown' },
  { name: 'product-bundle-cami', url: '/product/bundle-cami' },
  { name: 'cart', url: '/cart' },
  { name: 'checkout-pending', url: '/checkout' },
  { name: 'policy', url: '/policy' },
];

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();

for (const p of PAGES) {
  const url = BASE + p.url;
  console.log(`Capturing ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch {
    console.warn(`  networkidle timeout, capturing current state`);
  }
  // let images/animations settle
  await new Promise(r => setTimeout(r, 1500));

  const html = await page.content();
  fs.writeFileSync(path.join(OUT, `${p.name}.html`), html, 'utf8');
  await page.screenshot({ path: path.join(OUT, `${p.name}.png`), fullPage: true });
  console.log(`  saved ${p.name}.html + ${p.name}.png`);
}

await browser.close();
console.log(`\nDone. Output: ${OUT}`);
