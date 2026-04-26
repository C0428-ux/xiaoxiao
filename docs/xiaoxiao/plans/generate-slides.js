const { chromium } = require('C:/Users/xiaoxiao/AppData/Roaming/npm/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function generateSlides() {
  const htmlPath = path.join(__dirname, 'promotion-slides.html');
  const outputDir = __dirname;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto(`file://${htmlPath}`);

  // Get all slides
  const slides = await page.$$('.slide');
  console.log(`Found ${slides.length} slides`);

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    // Hide other slides
    await page.evaluate((idx) => {
      const allSlides = document.querySelectorAll('.slide');
      allSlides.forEach((s, i) => {
        s.style.display = i === idx ? 'block' : 'none';
        s.style.margin = '0';
        s.style.pageBreakAfter = 'avoid';
      });
    }, i);

    // Wait for content to render
    await page.waitForTimeout(500);

    // Screenshot
    const outputPath = path.join(outputDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await slide.screenshot({
      path: outputPath,
      type: 'png'
    });

    console.log(`Saved: ${outputPath}`);
  }

  await browser.close();
  console.log('Done!');
}

generateSlides().catch(console.error);