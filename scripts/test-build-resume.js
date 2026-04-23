import assert from 'assert'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateResumeHTML } from './build-resume.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const employersPath = path.resolve(__dirname, '../resume-data/employers.md')
const projectsDir = path.resolve(__dirname, '../projects')

const html = generateResumeHTML(employersPath, projectsDir)

// Must have exactly 9 employer sections
assert((html.match(/class="resume-employer"/g) || []).length === 9, 'must have exactly 9 employer sections')

// data-disciplines attributes
assert(html.includes('data-disciplines="product"'), 'product discipline section must exist')
assert(html.includes('data-disciplines="interactive product"'), 'ThoughtWorks must have interactive+product disciplines')
assert(html.includes('data-disciplines="production"'), 'production discipline section must exist')
assert(html.includes('data-disciplines="game-production"'), 'game-production discipline section must exist')

// Employer names present
assert(html.includes('ForeVR Games'), 'ForeVR must appear')
assert(html.includes('>Insummary<'), 'Insummary must appear')
assert(html.includes('>Pariveda<'), 'Pariveda must appear')
assert(html.includes('>Checkr<'), 'Checkr must appear')
assert(html.includes('>ThoughtWorks<'), 'ThoughtWorks must appear')
assert(html.includes('The Playsets Team'), 'Playsets must appear')
assert(html.includes('Discovery Communications'), 'Discovery must appear')
assert(html.includes('Eyeboogie Inc'), 'Eyeboogie must appear')
assert(html.includes('Production Design'), 'Production Design must appear')

// Playsets h2 must have data-trigger
assert(html.includes('data-trigger="playsets"'), 'Playsets h2 must have data-trigger')

// Checkr projects appear
assert(html.includes('Checkr Direct'), 'Checkr Direct must appear')
assert(html.includes('Self-Service Program'), 'Self-Service Program must appear')
assert(html.includes('Segmentation and Enterprise'), 'Segmentation and Enterprise must appear')
assert(html.includes('Expungements'), 'Expungements must appear')
assert(html.includes('Federated Identity and SSO'), 'Federated Identity and SSO must appear')
assert(html.includes('Fairness Framework'), 'Fairness Framework must appear')

// ThoughtWorks-lead projects appear
assert(html.includes('C4 Media, Conference feedback platform'), 'QCon entry must appear')
assert(html.includes('Tchibo, Connected coffee machine'), 'Qbo entry must appear')
assert(html.includes('GAP Inc, Validated learning process'), 'GAP entry must appear')
assert(html.includes('Natural Markets Food Group, Retail food at Eaton Center'), 'NMFG entry must appear')
assert(html.includes('ThoughtWorks, Digital Platform Strategy Offering'), 'Digital Platform Strategy must appear')

// ThoughtWorks-sej projects appear
assert(html.includes('UCSF Virtual Mentor'), 'UCSF entry must appear')
assert(html.includes('Response Innovation Lab, Matchmaker'), 'Response Innovation Lab must appear')
assert(html.includes('Hutton 2.0'), 'Hutton entry must appear')

// Production design entries use <em> for client
assert(html.includes('<em>Death Cab For Cutie</em>'), 'youareatourist must use em for client')
assert(html.includes('<em>M.I.A.</em>'), 'bornfree must use em for client')

// Adidasallin has subtitle + em
assert(html.includes('(Los Angeles)'), 'adidasallin subtitle must appear')
assert(html.includes('<em>Adidas</em>'), 'adidasallin client must be in em tag')

// data-trigger on project links
assert(html.includes('data-trigger="qcon"'), 'qcon must have data-trigger')
assert(html.includes('data-trigger="ucsf"'), 'ucsf must have data-trigger')
assert(html.includes('data-trigger="hutton"'), 'hutton must have data-trigger')

// Link title on qcon
assert(html.includes('title="Qcon case study"'), 'qcon link must have title attribute')

// Iframe type for Response Innovation Lab
assert(html.includes('data-type="iframe"'), 'Response Innovation Lab must use iframe type')
assert(!html.includes('href="https://responseinnovationlab'), 'iframe link must not have direct href')

// Bullets
assert(html.includes('<ul>'), 'bullets must render as ul')
assert(html.includes('Winner of a Schmidt Futures grant'), 'expungements bullets must appear')
assert(html.includes('Saving Lives at Birth Seed Grant'), 'ucsf bullet link text must appear')

// Notable Projects header appears
assert(html.includes('<h4>Notable Projects</h4>'), 'Notable Projects header must appear')

// Employer order
const parivIdx = html.indexOf('>Pariveda<')
const checkIdx = html.indexOf('>Checkr<')
const twIdx = html.indexOf('>ThoughtWorks<')
const plIdx = html.indexOf('The Playsets Team')
const discIdx = html.indexOf('Discovery Communications')
const eyeIdx = html.indexOf('Eyeboogie Inc')
const prodIdx = html.indexOf('Production Design')
assert(parivIdx < checkIdx, 'Pariveda must come before Checkr')
assert(checkIdx < twIdx, 'Checkr must come before ThoughtWorks')
assert(twIdx < plIdx, 'ThoughtWorks must come before Playsets')
assert(plIdx < discIdx, 'Playsets must come before Discovery')
assert(discIdx < eyeIdx, 'Discovery must come before Eyeboogie')
assert(eyeIdx < prodIdx, 'Eyeboogie must come before Production Design')

console.log('All resume tests passed')
