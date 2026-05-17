/**
 * Script untuk generate semua ukuran icon PWA dari satu gambar sumber.
 * 
 * CARA PENGGUNAAN:
 * 1. Letakkan gambar sumber di: public/icons/icon-source.png
 *    (harus berupa PNG persegi, minimal 512x512px)
 * 2. Jalankan: npm run generate-icons
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Coba sumber dari icon-source.png dulu, fallback ke logo existing
const iconSourcePath = path.join(__dirname, '..', 'public', 'icons', 'icon-source.png');
const logoFallbackPath = path.join(__dirname, '..', 'public', 'cdl-guru-logo.jpg');

const inputImagePath = fs.existsSync(iconSourcePath) ? iconSourcePath : logoFallbackPath;
const outputDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

async function generateIcons() {
  console.log(`📌 Sumber gambar: ${inputImagePath}`);
  
  if (!fs.existsSync(inputImagePath)) {
    console.error('❌ Error: File sumber tidak ditemukan!');
    console.error('   Letakkan file PNG persegi di: public/icons/icon-source.png');
    process.exit(1);
  }

  try {
    for (const size of sizes) {
      await sharp(inputImagePath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFormat('png')
        .toFile(path.join(outputDir, `icon-${size}.png`));
      console.log(`✅ Generated icon-${size}.png`);
    }

    // Apple touch icon (180x180)
    await sharp(inputImagePath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('✅ Generated apple-touch-icon.png (180x180)');

    // Maskable icon dengan padding 20% (zona aman untuk maskable)
    await sharp(inputImagePath)
      .resize(410, 410, {
        fit: 'contain',
        background: { r: 37, g: 99, b: 235, alpha: 1 } // #2563eb biru tema
      })
      .extend({
        top: 51, bottom: 51, left: 51, right: 51,
        background: { r: 37, g: 99, b: 235, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'maskable-icon.png'));
    console.log('✅ Generated maskable-icon.png (512x512 dengan padding)');

    console.log('\n🎉 Semua icon berhasil digenerate!');
    console.log(`📁 Tersimpan di: ${outputDir}`);
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
