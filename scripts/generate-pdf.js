import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

const PHONE = '213.793.1790'

const PDF_CONFIGS = [
  {
    disciplines: ['product-management'],
    filename: 'resume-product-manager.pdf',
    downloadName: 'Anthony Maitz - Product Manager.pdf',
  },
  {
    disciplines: ['game-design'],
    filename: 'resume-game-designer.pdf',
    downloadName: 'Anthony Maitz - Game Designer.pdf',
  },
  {
    disciplines: ['product-management', 'game-design'],
    filename: 'resume-product-manager-game-designer.pdf',
    downloadName: 'Anthony Maitz - Product Manager & Game Designer.pdf',
    isDefault: true,
  },
]

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

async function generatePdf(browser, port, config) {
  const page = await browser.newPage()
  try {
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForFunction(() => typeof navctrl !== 'undefined', { timeout: 30000 })

    await page.evaluate(() => navctrl('resume'))
    await page.waitForFunction(() => {
      const el = document.getElementById('resume')
      return el && getComputedStyle(el).display !== 'none'
    }, { timeout: 30000 })

    await page.evaluate((disciplines) => {
      document.querySelectorAll('#resume-filters .filter-btn').forEach(btn => {
        btn.classList.remove('selected')
      })
      disciplines.forEach(d => {
        const btn = document.querySelector('#resume-filters .filter-btn[data-filter="' + d + '"]')
        if (btn) btn.classList.add('selected')
      })
      applyResumeFilter()
    }, config.disciplines)

    await page.evaluate((phone) => {
      const contact = document.getElementById('resume-contact')
      if (contact) {
        const span = document.createElement('span')
        span.textContent = ' · ' + phone
        contact.appendChild(span)
      }
    }, PHONE)

    const outputPath = path.join(distDir, config.filename)
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: false,
      margin: { top: '0.75in', bottom: '0.75in', left: '0.75in', right: '0.75in' },
    })

    console.log(`PDF written: ${config.filename} (${config.downloadName})`)
    return outputPath
  } finally {
    await page.close()
  }
}

async function main() {
  const server = serveDir(distDir)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    let defaultPath = null
    for (const config of PDF_CONFIGS) {
      const outputPath = await generatePdf(browser, port, config)
      if (config.isDefault) defaultPath = outputPath
    }

    if (defaultPath) {
      const resumePdfPath = path.join(distDir, 'resume.pdf')
      fs.copyFileSync(defaultPath, resumePdfPath)
      console.log('Copied default to resume.pdf')
    }
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch(err => { console.error(err); process.exit(1) })
