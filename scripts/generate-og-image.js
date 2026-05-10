// Generates public/og-image.jpg (1200×630) for Open Graph / social sharing.
// Requires: npm run dev (port 5300) to be running before executing this script.
// Run: node scripts/generate-og-image.js
// Re-run any time og-card.html or its referenced assets change.

import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const output = path.resolve(__dirname, '../public/og-image.jpg')
const url = 'http://localhost:5300/og-card.html'

const browser = await puppeteer.launch()
const page = await browser.newPage()

await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: 'networkidle0' })

await page.screenshot({
  path: output,
  type: 'jpeg',
  quality: 90,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
})

await browser.close()
console.log(`✓ ${output}`)
