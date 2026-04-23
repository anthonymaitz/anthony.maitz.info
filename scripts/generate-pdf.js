import puppeteer from 'puppeteer'
import { createServer } from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { extname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
}

async function generatePdf() {
  const server = createServer((req, res) => {
    let urlPath = req.url.split('?')[0]
    if (urlPath.endsWith('/')) urlPath += 'index.html'
    const filePath = join(distDir, urlPath)
    if (!existsSync(filePath)) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    res.setHeader('Content-Type', MIME[extname(filePath)] || 'text/plain')
    createReadStream(filePath).pipe(res)
  })

  await new Promise(res => server.listen(4174, res))

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:4174/resume/index.html', { waitUntil: 'networkidle0' })

  await page.pdf({
    path: join(distDir, 'resume.pdf'),
    format: 'A4',
    printBackground: false,
    margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
  })

  await browser.close()
  server.close()
  console.log('dist/resume.pdf generated')
}

generatePdf().catch(err => {
  console.error(err)
  process.exit(1)
})
