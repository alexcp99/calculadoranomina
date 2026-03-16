/**
 * generate-favicons.js
 * Generates favicon.ico, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png
 * into the public/ directory using sharp (SVG → PNG).
 *
 * Usage: node scripts/generate-favicons.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC = path.join(__dirname, "..", "public");

// ─── SVG templates ────────────────────────────────────────────────────────────

function makeSvg(size) {
  const r = Math.round(size * 0.18); // corner radius
  const fontSize = Math.round(size * 0.38);
  const letterSpacing = size > 64 ? -2 : -1;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f52d4"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#bg)"/>
  <!-- Subtle top-left highlight -->
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}"
    fill="url(#hl)" opacity="0.15"/>
  <!-- CN letters -->
  <text
    x="${size / 2}"
    y="${size * 0.645}"
    font-family="system-ui, -apple-system, Arial, sans-serif"
    font-weight="800"
    font-size="${fontSize}"
    letter-spacing="${letterSpacing}"
    fill="white"
    text-anchor="middle"
    dominant-baseline="auto"
  >CN</text>
</svg>`;
}

// ─── ICO builder (embeds a PNG stream inside ICO container) ──────────────────

function buildIco(png16Buffer, png32Buffer) {
  // ICO format: ICONDIR + 2 ICONDIRENTRY + 2 PNG blobs
  const entry16Offset = 6 + 2 * 16; // after ICONDIR (6) + 2 entries (16 each)
  const entry32Offset = entry16Offset + png16Buffer.length;

  const buf = Buffer.alloc(6 + 2 * 16);
  // ICONDIR
  buf.writeUInt16LE(0, 0);  // reserved
  buf.writeUInt16LE(1, 2);  // type: ICO
  buf.writeUInt16LE(2, 4);  // count: 2 images

  // ICONDIRENTRY for 16x16
  buf.writeUInt8(16, 6);    // width
  buf.writeUInt8(16, 7);    // height
  buf.writeUInt8(0, 8);     // color count
  buf.writeUInt8(0, 9);     // reserved
  buf.writeUInt16LE(1, 10); // color planes
  buf.writeUInt16LE(32, 12);// bits per pixel
  buf.writeUInt32LE(png16Buffer.length, 14); // size of image data
  buf.writeUInt32LE(entry16Offset, 18);      // offset to image data

  // ICONDIRENTRY for 32x32
  buf.writeUInt8(32, 22);
  buf.writeUInt8(32, 23);
  buf.writeUInt8(0, 24);
  buf.writeUInt8(0, 25);
  buf.writeUInt16LE(1, 26);
  buf.writeUInt16LE(32, 28);
  buf.writeUInt32LE(png32Buffer.length, 30);
  buf.writeUInt32LE(entry32Offset, 34);

  return Buffer.concat([buf, png16Buffer, png32Buffer]);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Generating favicons…");

  const [png16, png32, png180] = await Promise.all([
    sharp(Buffer.from(makeSvg(16))).png().toBuffer(),
    sharp(Buffer.from(makeSvg(32))).png().toBuffer(),
    sharp(Buffer.from(makeSvg(180))).png().toBuffer(),
  ]);

  fs.writeFileSync(path.join(PUBLIC, "favicon-16x16.png"), png16);
  console.log("✓ favicon-16x16.png");

  fs.writeFileSync(path.join(PUBLIC, "favicon-32x32.png"), png32);
  console.log("✓ favicon-32x32.png");

  fs.writeFileSync(path.join(PUBLIC, "apple-touch-icon.png"), png180);
  console.log("✓ apple-touch-icon.png");

  const ico = buildIco(png16, png32);
  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), ico);
  console.log("✓ favicon.ico (16×16 + 32×32 embedded)");

  console.log("\nDone! All favicons saved to public/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
