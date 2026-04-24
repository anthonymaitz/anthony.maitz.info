import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const employersPath = path.resolve(__dirname, '../resume-data/employers.md')
const projectsDir = path.resolve(__dirname, '../projects')
const indexPath = path.resolve(__dirname, '../index.html')

const RESUME_START = '<!-- RESUME_GENERATED_START -->'
const RESUME_END = '<!-- RESUME_GENERATED_END -->'

function htmlEncode(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildProjectMap(dir) {
  const map = {}
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8')
    const data = matter(raw).data
    if (data.resume_section) {
      if (!map[data.resume_section]) map[data.resume_section] = []
      map[data.resume_section].push(data)
    }
  }
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => (a.resume_order ?? 999) - (b.resume_order ?? 999))
  }
  return map
}

function renderProjectEntry(p) {
  const title = htmlEncode(p.resume_entry_title || p.title || '')

  let linkOpen = ''
  let linkClose = ''
  if (p.resume_link_url) {
    if (p.resume_link_type === 'iframe') {
      let attrs = `href="javascript:;" data-type="iframe" data-src="${htmlEncode(p.resume_link_url)}"`
      if (p.resume_link_target) attrs += ` target="${htmlEncode(p.resume_link_target)}"`
      linkOpen = `<a ${attrs}>`
    } else {
      let attrs = `href="${htmlEncode(p.resume_link_url)}"`
      if (p.resume_link_trigger) attrs += ` data-trigger="${htmlEncode(p.resume_link_trigger)}"`
      if (p.resume_link_target) attrs += ` target="${htmlEncode(p.resume_link_target)}"`
      if (p.resume_link_title) attrs += ` title="${htmlEncode(p.resume_link_title)}"`
      linkOpen = `<a ${attrs}>`
    }
    linkClose = `</a>`
  }

  let separator = ''
  if (p.resume_role) {
    separator = ` – ${htmlEncode(p.resume_role)}`
  } else if (p.resume_client) {
    const sub = p.resume_subtitle ? ` ${htmlEncode(p.resume_subtitle)}` : ''
    separator = `${sub} <em>${htmlEncode(p.resume_client)}</em>`
  }

  let html = `<h5>${linkOpen}${title}${linkClose}${separator}</h5>\n`

  if (p.resume_description) {
    html += `<p>${htmlEncode(p.resume_description)}</p>\n`
  }

  if (p.resume_bullets && p.resume_bullets.length > 0) {
    html += `<ul>\n`
    for (const b of p.resume_bullets) {
      html += `<li>${b}</li>\n`
    }
    html += `</ul>\n`
  }

  return html
}

function renderEmployer(employer, projectMap) {
  const disciplines = (employer.disciplines || []).join(' ')
  let html = `<div class="resume-employer" data-disciplines="${htmlEncode(disciplines)}">\n`

  if (employer.url) {
    let attrs = `href="${htmlEncode(employer.url)}"`
    if (employer.url_target) attrs += ` target="${htmlEncode(employer.url_target)}"`
    if (employer.h2_trigger) attrs += ` data-trigger="${htmlEncode(employer.h2_trigger)}"`
    html += `<h2><a ${attrs}>${htmlEncode(employer.name)}</a></h2>\n`
  } else {
    html += `<h2>${htmlEncode(employer.name)}</h2>\n`
  }

  for (const role of (employer.roles || [])) {
    if (role.dates) {
      html += role.title
        ? `<h3>${role.title} <em>${htmlEncode(role.dates)}</em></h3>\n`
        : `<h3><em>${htmlEncode(role.dates)}</em></h3>\n`
    }
    for (const desc of (role.descriptions || [])) {
      html += `<p>${desc}</p>\n`
    }
    const projects = projectMap[role.id] || []
    if (projects.length > 0) {
      html += `<h4>Notable Projects</h4>\n`
      for (const p of projects) {
        html += renderProjectEntry(p)
      }
    }
  }

  html += `</div>\n`
  return html
}

export function generateResumeHTML(empPath, projDir) {
  const overviewPath = path.join(path.dirname(empPath), 'overview.md')
  const overviewData = matter(fs.readFileSync(overviewPath, 'utf8')).data
  const startYear = overviewData.start_year || 2007
  const years = new Date().getFullYear() - startYear
  const overviews = overviewData.overviews || {}

  let html = ''
  Object.entries(overviews).forEach(([key, ov], i) => {
    const hidden = i > 0 ? ' style="display:none"' : ''
    html += `<div class="resume-overview"${hidden} data-overview="${htmlEncode(key)}">\n`
    html += `<h2>${htmlEncode(ov.title || '')}</h2>\n`
    for (const para of (ov.paragraphs || [])) {
      html += `<p>${para.replace('{years}', String(years))}</p>\n`
    }
    html += `</div>\n`
  })
  html += '\n'

  const raw = fs.readFileSync(empPath, 'utf8')
  const employers = matter(raw).data.employers || []
  const projectMap = buildProjectMap(projDir)
  html += employers.map(e => renderEmployer(e, projectMap)).join('\n')
  return html
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const resumeHTML = generateResumeHTML(employersPath, projectsDir)

  let indexHTML = fs.readFileSync(indexPath, 'utf8')
  const startIdx = indexHTML.indexOf(RESUME_START)
  const endIdx = indexHTML.indexOf(RESUME_END)

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Markers not found in index.html. Add:\n  ${RESUME_START}\n  ${RESUME_END}`)
    process.exit(1)
  }

  const before = indexHTML.slice(0, startIdx + RESUME_START.length)
  const after = indexHTML.slice(endIdx)
  fs.writeFileSync(indexPath, `${before}\n${resumeHTML}${after}`)

  const count = (resumeHTML.match(/class="resume-employer"/g) || []).length
  console.log(`Resume section updated: ${count} employers`)
}
