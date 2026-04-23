import resume from '../data/resume.json'

const container = document.getElementById('resume-content')

function resumeHTML(data) {
  const experienceRows = data.experience.map(role => `
    <div class="resume-role">
      <div class="resume-role__header">
        <div>
          <span class="resume-role__title">${role.role}</span>
          <span class="resume-role__company"> — ${role.company}</span>
        </div>
        <span class="resume-role__years">${role.years}</span>
      </div>
      ${role.bullets.length ? `<ul>${role.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    </div>`).join('')

  const educationSection = data.education.length ? `
    <div class="resume-section">
      <div class="resume-section-title">Education</div>
      ${data.education.map(ed => `
        <div class="resume-role">
          <div class="resume-role__header">
            <span class="resume-role__title">${ed.degree} — ${ed.school}</span>
            <span class="resume-role__years">${ed.years}</span>
          </div>
        </div>`).join('')}
    </div>` : ''

  const skillsSection = data.skills.length ? `
    <div class="resume-section">
      <div class="resume-section-title">Skills</div>
      <p>${data.skills.join(' · ')}</p>
    </div>` : ''

  const featuredSection = data.featured ? `
    <div class="resume-section">
      <div class="resume-section-title">Featured</div>
      <div class="resume-role">
        <div class="resume-role__header">
          <span class="resume-role__title">${data.featured.label}</span>
          <span class="resume-role__years">${data.featured.note}</span>
        </div>
      </div>
    </div>` : ''

  return `
    <div class="resume-actions">
      <button id="print-btn">Print / Save as PDF</button>
      <a href="/resume.pdf" download>Download PDF</a>
    </div>
    <h1 class="resume-name">${data.name}</h1>
    <div class="resume-title">${data.title}</div>
    <div class="resume-contact"><a href="mailto:${data.email}">${data.email}</a></div>
    ${featuredSection}
    <div class="resume-section">
      <div class="resume-section-title">Experience</div>
      ${experienceRows}
    </div>
    ${educationSection}
    ${skillsSection}`
}

container.innerHTML = resumeHTML(resume)
document.getElementById('print-btn').addEventListener('click', () => window.print())
