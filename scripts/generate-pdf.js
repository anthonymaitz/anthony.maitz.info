import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const outputPath = path.join(distDir, 'resume.pdf')

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function serveDir(dir) {
  const absDir = path.resolve(dir)
  return http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0]
    if (urlPath === '/') urlPath = '/index.html'
    const filePath = path.resolve(path.join(absDir, urlPath))
    if (!filePath.startsWith(absDir + path.sep) && filePath !== absDir) {
      res.writeHead(403)
      res.end()
      return
    }
    const ext = path.extname(filePath)
    try {
      const data = fs.readFileSync(filePath)
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end()
    }
  })
}

async function main() {
  const server = serveDir(distDir)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  try {
    const page = await browser.newPage()

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForFunction(() => typeof navctrl !== 'undefined', { timeout: 30000 })
    await page.evaluate(() => navctrl('resume'))
    await page.waitForFunction(() => {
      const el = document.getElementById('resume')
      return el && getComputedStyle(el).display !== 'none'
    }, { timeout: 30000 })

    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: false,
      margin: { top: '0.75in', bottom: '0.75in', left: '0.75in', right: '0.75in' },
    })

    console.log(`PDF written to ${outputPath}`)
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch(err => { console.error(err); process.exit(1) })
