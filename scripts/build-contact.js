import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contactPath = path.resolve(__dirname, '../contact-data/contact.md')
const indexPath = path.resolve(__dirname, '../index.html')

const CONTACT_START = '<!-- CONTACT_GENERATED_START -->'
const CONTACT_END = '<!-- CONTACT_GENERATED_END -->'

export function generateContactHTML(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)
  const { intro, currently, links = [], games = [] } = data

  const linksHTML = links.map(l => {
    const target = l.target ? ` target="${l.target}"` : ''
    return `<a href="${l.url}"${target}>${l.label}</a>`
  }).join('\n    ')

  const gamesHTML = games.map(g => {
    const target = g.target ? ` target="${g.target}"` : ''
    return `<li><a href="${g.url}"${target}>${g.label}</a></li>`
  }).join('\n    ')

  return `<p>${intro}</p>
<div class="contact-card">
<p>${currently}</p>
<div class="contact-links">
    ${linksHTML}
</div>
</div>
<h3>Play my games</h3>
<ul id="play-games">
    ${gamesHTML}
</ul>`
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const contactHTML = generateContactHTML(contactPath)

  let indexHTML = fs.readFileSync(indexPath, 'utf8')
  const startIdx = indexHTML.indexOf(CONTACT_START)
  const endIdx = indexHTML.indexOf(CONTACT_END)

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Markers not found in index.html. Add these comments:\n  ${CONTACT_START}\n  ${CONTACT_END}`)
    process.exit(1)
  }

  const before = indexHTML.slice(0, startIdx + CONTACT_START.length)
  const after = indexHTML.slice(endIdx)
  fs.writeFileSync(indexPath, `${before}\n${contactHTML}\n${after}`)
  console.log('Contact section updated.')
}
