// Generates public/og-image.jpg (1200×630) for Open Graph / social sharing.
// Run: node scripts/generate-og-image.js
// Re-run any time the photo or text content changes.

import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const photo = path.resolve(__dirname, '../public/Anthony_Profile.jpg')
const output = path.resolve(__dirname, '../public/og-image.jpg')

const W = 1200, H = 630
const PHOTO_W = 680  // photo column width; left text column gets the rest
const PHOTO_LEFT = W - PHOTO_W  // = 520

// Resize + crop photo to exact column size
const photoBuffer = await sharp(photo)
  .resize({ width: PHOTO_W, height: H, fit: 'cover', position: 'top' })
  .toBuffer()

// SVG: gradient fade over photo + text left side
const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#1d2630" stop-opacity="1"/>
      <stop offset="43%"  stop-color="#1d2630" stop-opacity="1"/>
      <stop offset="65%"  stop-color="#1d2630" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#1d2630" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <text x="72" y="246" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="bold" fill="#eaf0f6" letter-spacing="-1">Anthony Maitz</text>
  <text x="75" y="312" font-family="Georgia, 'Times New Roman', serif" font-size="31" fill="#7eb5e5">Product Manager &amp; Game Designer</text>
  <line x1="75" y1="348" x2="420" y2="348" stroke="#4b5866" stroke-width="1"/>
  <text x="75" y="386" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#6b7d8e">anthony.maitz.work</text>
</svg>`

await sharp({ create: { width: W, height: H, channels: 3, background: { r: 29, g: 38, b: 48 } } })
  .composite([
    { input: photoBuffer, top: 0, left: PHOTO_LEFT },
    { input: Buffer.from(svg), top: 0, left: 0 },
  ])
  .jpeg({ quality: 90 })
  .toFile(output)

console.log(`✓ ${output}`)
