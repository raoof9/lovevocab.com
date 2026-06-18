const path = require('path');
const { chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'));

const targets = [
  { url: 'http://localhost:8080/', theme: 'light', viewport: { width: 1440, height: 1000 }, out: 'home-desktop-light.png', fullPage: true },
  { url: 'http://localhost:8080/', theme: 'dark', viewport: { width: 1440, height: 1000 }, out: 'home-desktop-dark.png', fullPage: true },
  { url: 'http://localhost:8080/', theme: 'light', viewport: { width: 390, height: 844 }, out: 'home-mobile-light.png', fullPage: true },
  { url: 'http://localhost:8080/privacy.html', theme: 'light', viewport: { width: 1440, height: 1000 }, out: 'privacy-desktop-light.png', fullPage: true },
];

(async () => {
  const browser = await chromium.launch();
  for (const t of targets) {
    const page = await browser.newPage({ viewport: t.viewport });
    await page.addInitScript((theme) => {
      window.localStorage.setItem('lv-theme', theme);
    }, t.theme);
    await page.goto(t.url, { waitUntil: 'networkidle' });
    const fullHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= fullHeight; y += 200) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join('/tmp', t.out), fullPage: !!t.fullPage });
    await page.close();
    console.log('saved', t.out);
  }
  await browser.close();
})();
