const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'));

const root = path.join(__dirname, '..');
const iconSvg = fs.readFileSync(path.join(root, 'assets/img/app-icon.svg'), 'utf8');

async function renderSquare(svg, size, outPath, opts = {}) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`
    <html><head><style>
      html,body{margin:0;padding:0;background:${opts.bg || 'transparent'};}
      svg{display:block;width:${size}px;height:${size}px;}
    </style></head>
    <body>${svg}</body></html>
  `);
  await page.screenshot({ path: outPath, omitBackground: !opts.bg });
  await browser.close();
}

async function renderOg(outPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const html = fs.readFileSync(path.join(root, 'scripts/og-template.html'), 'utf8');
  await page.setContent(html);
  await page.screenshot({ path: outPath });
  await browser.close();
}

(async () => {
  const imgDir = path.join(root, 'assets/img');
  await renderSquare(iconSvg, 180, path.join(imgDir, 'apple-touch-icon.png'), { bg: '#ffffff' });
  await renderSquare(iconSvg, 32, path.join(imgDir, 'favicon-32.png'));
  await renderSquare(iconSvg, 16, path.join(imgDir, 'favicon-16.png'));
  await renderSquare(iconSvg, 512, path.join(imgDir, 'icon-512.png'));
  await renderOg(path.join(imgDir, 'og-image.png'));
  console.log('done');
})();
