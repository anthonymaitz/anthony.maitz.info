import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const manifestoPath = path.resolve(__dirname, '../manifesto.md')
const indexPath = path.resolve(__dirname, '../index.html')

const MANIFESTO_START = '<!-- MANIFESTO_START -->'
const MANIFESTO_END = '<!-- MANIFESTO_END -->'

export function generateManifestoHTML(filePath) {
  return fs.readFileSync(filePath, 'utf8').trim()
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifestoHTML = generateManifestoHTML(manifestoPath)

  let indexHTML = fs.readFileSync(indexPath, 'utf8')
  const startIdx = indexHTML.indexOf(MANIFESTO_START)
  const endIdx = indexHTML.indexOf(MANIFESTO_END)

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Markers not found in index.html. Add:\n  ${MANIFESTO_START}\n  ${MANIFESTO_END}`)
    process.exit(1)
  }

  const before = indexHTML.slice(0, startIdx + MANIFESTO_START.length)
  const after = indexHTML.slice(endIdx)
  fs.writeFileSync(indexPath, `${before}\n${manifestoHTML}\n${after}`)
  console.log('Manifesto updated in index.html.')
}
