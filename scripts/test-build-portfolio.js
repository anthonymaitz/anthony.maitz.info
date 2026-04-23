import assert from 'assert'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { generatePortfolioHTML } from './build-portfolio.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsDir = path.resolve(__dirname, '../projects')

const html = generatePortfolioHTML(projectsDir)

// All slugs should appear somewhere in the output
const slugs = [
  'jetpack-geography', 'forevr', 'insummary', 'ucsf', 'playsets', 'shine',
  'qcon', 'qbo', 'nmfg', 'collagio', 'youareatourist', 'adidasallin',
  'bornfree', 'startraders', 'igotalot', 'ayyo', 'thenaturebetweenus',
  'theexecutionofsolomonharris', 'whentwoislandsmeet', 'hutton',
]
for (const slug of slugs) {
  assert.ok(html.includes(`"${slug}"`), `Missing slug in output: ${slug}`)
}

// Stubs: have stub card, no trigger image
assert.ok(html.includes('>Jetpack Geography!</div>'), 'jetpack stub card text')
assert.ok(html.includes('>ForeVR Games</div>'), 'forevr stub card text')
assert.ok(html.includes('>Insummary</div>'), 'insummary stub card text')
assert.ok(!html.includes('data-trigger="jetpack-geography"'), 'jetpack must not have trigger')
assert.ok(!html.includes('data-trigger="forevr"'), 'forevr must not have trigger')

// Projects with media: have trigger img and gallery items
assert.ok(html.includes('data-trigger="playsets"'), 'playsets has trigger')
assert.ok(html.includes('data-trigger="shine"'), 'shine has trigger')
assert.ok(html.includes('data-fancybox="playsets"'), 'playsets has gallery items')
assert.ok(html.includes('data-fancybox="shine"'), 'shine has gallery items')

// Disciplines on portfolio-item wrappers
assert.ok(html.includes('data-discipline="interactive game-production"'), 'jetpack disciplines')
assert.ok(html.includes('data-discipline="interactive product"'), 'playsets disciplines')
assert.ok(html.includes('data-discipline="production"'), 'production discipline present')

// Captions: ucsf media items have text inside the <a>
assert.ok(html.includes('We tested with medical workers in Kenya.'), 'ucsf caption 1')
assert.ok(html.includes('This is a poster made to explain'), 'ucsf caption 2')

// Hutton: no visible trigger, but has hidden gallery items
assert.ok(!html.includes('data-trigger="hutton"'), 'hutton must not have trigger')
assert.ok(html.includes('data-fancybox="hutton"'), 'hutton has gallery items')

// Order: jetpack (order 1) before forevr (order 2) before insummary (order 3)
const jIdx = html.indexOf('"jetpack-geography"')
const fIdx = html.indexOf('"forevr"')
const iIdx = html.indexOf('"insummary"')
assert.ok(jIdx < fIdx && fIdx < iIdx, 'projects ordered by order field')

// URL-safe: & in playsets URL must be HTML-encoded as &amp;
assert.ok(html.includes('&amp;list='), 'playsets YouTube URL has & encoded as &amp;')

// Local media paths use ../media/ prefix
assert.ok(html.includes('../media/playsets-0.jpg'), 'local media path convention')
assert.ok(html.includes('../media/qbo-6.m4v'), 'local m4v media path')

// All items should have id attribute with their slug
assert.ok(html.includes('id="jetpack-geography"'), 'jetpack id attr')
assert.ok(html.includes('id="playsets"'), 'playsets id attr')
assert.ok(html.includes('id="hutton"'), 'hutton id attr')

// portfolio: false filtering
{
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-test-'))
  fs.writeFileSync(path.join(tmpDir, 'visible.md'), '---\nslug: visible\ntitle: Visible\ndisciplines: [product]\norder: 1\nmedia:\n  - img.jpg\n---\n')
  fs.writeFileSync(path.join(tmpDir, 'hidden.md'), '---\nslug: hidden\ntitle: Hidden\nportfolio: false\ndisciplines: [product]\norder: 2\nmedia:\n  - img.jpg\n---\n')
  const html = generatePortfolioHTML(tmpDir)
  assert(!html.includes('id="hidden"'), 'portfolio: false item must not appear in portfolio HTML')
  assert(html.includes('id="visible"'), 'portfolio: true item must appear in portfolio HTML')
  fs.rmSync(tmpDir, { recursive: true })
}

console.log('All tests passed ✓')
