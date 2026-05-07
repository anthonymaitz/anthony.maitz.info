// One-time script: converts all JPG/PNG in media/ to WebP alongside the originals.
// Run: node scripts/convert-to-webp.js
// Safe to re-run — skips files that already have a .webp counterpart.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mediaDir = path.resolve(__dirname, '../media')

const files = fs.readdirSync(mediaDir).filter(f => /\.(jpe?g|png)$/i.test(f))

let converted = 0, skipped = 0
for (const file of files) {
  const webpPath = path.join(mediaDir, file.replace(/\.(jpe?g|png)$/i, '.webp'))
  if (fs.existsSync(webpPath)) { skipped++; continue }
  await sharp(path.join(mediaDir, file)).webp({ quality: 82 }).toFile(webpPath)
  const origSize = fs.statSync(path.join(mediaDir, file)).size
  const webpSize = fs.statSync(webpPath).size
  const saved = Math.round((1 - webpSize / origSize) * 100)
  console.log(`✓ ${file} → ${path.basename(webpPath)} (${saved}% smaller)`)
  converted++
}
console.log(`\nDone: ${converted} converted, ${skipped} already existed.`)
