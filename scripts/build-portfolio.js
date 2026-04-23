import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsDir = path.resolve(__dirname, '../projects')
const indexPath = path.resolve(__dirname, '../index.html')

const PORTFOLIO_START = '<!-- PORTFOLIO_GENERATED_START -->'
const PORTFOLIO_END = '<!-- PORTFOLIO_GENERATED_END -->'

function htmlEncode(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function isExternalUrl(src) {
  return src.startsWith('http://') || src.startsWith('https://')
}

function mediaHref(src) {
  return isExternalUrl(src) ? src : `../media/${src}`
}

function renderProject(project) {
  const { slug, title, disciplines, stub, no_trigger, media = [] } = project
  const disciplineAttr = (disciplines ?? []).join(' ')

  if (stub) {
    return `<div class="portfolio-item" id="${slug}" data-discipline="${disciplineAttr}">
<div class="portfolio-stub-card">${title}</div>
</div>\n`
  }

  const allItems = media.map(item =>
    typeof item === 'string' ? { src: item, caption: '' } : { src: item.src || '', caption: item.caption || '' }
  )

  let trigger = ''
  let galleryItems = allItems

  if (!no_trigger && allItems.length > 0) {
    const first = allItems[0]
    const href = htmlEncode(mediaHref(first.src))
    const alt = htmlEncode(title)
    trigger = `<a href="#${slug}" data-trigger="${slug}"><img src="${href}" title="${alt}" alt="${alt}"></a>\n`
    galleryItems = allItems.slice(1)
  }

  const galleryHTML = galleryItems.map(item => {
    const href = htmlEncode(mediaHref(item.src))
    const inner = item.caption ? `\n${htmlEncode(item.caption)}\n` : ''
    return `<a href="${href}" class="hidden" data-fancybox="${slug}" alt="">${inner}</a>\n`
  }).join('')

  return `<div class="portfolio-item" id="${slug}" data-discipline="${disciplineAttr}">\n${trigger}${galleryHTML}</div>\n`
}

export function generatePortfolioHTML(dir) {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8')
      return matter(raw).data
    })
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

  return files.map(renderProject).join('\n')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const portfolioHTML = generatePortfolioHTML(projectsDir)

  let indexHTML = fs.readFileSync(indexPath, 'utf8')
  const startIdx = indexHTML.indexOf(PORTFOLIO_START)
  const endIdx = indexHTML.indexOf(PORTFOLIO_END)

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Markers not found in index.html. Add these comments:\n  ${PORTFOLIO_START}\n  ${PORTFOLIO_END}`)
    process.exit(1)
  }

  const before = indexHTML.slice(0, startIdx + PORTFOLIO_START.length)
  const after = indexHTML.slice(endIdx)
  fs.writeFileSync(indexPath, `${before}\n${portfolioHTML}${after}`)

  const count = (portfolioHTML.match(/class="portfolio-item"/g) || []).length
  console.log(`Portfolio section updated: ${count} projects`)
}
