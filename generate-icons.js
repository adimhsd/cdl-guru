const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = path.join(__dirname, 'public', 'cdl-guru-logo.jpg');
const outputDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(inputImagePath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White background to fit jpg
        })
        .toFormat('png')
        .toFile(path.join(outputDir, `icon-${size}.png`));
      console.log(`Generated icon-${size}.png`);
    }

    // Generate maskable icon (often needs some padding, we will use contain with white background)
    await sharp(inputImagePath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'maskable-icon.png'));
    console.log('Generated maskable-icon.png');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
