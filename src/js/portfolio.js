import projects from '../data/projects.json'

const FILTER_LABELS = {
  all: 'All',
  interactive: 'Interactive & Game Design',
  product: 'Product',
  'game-production': 'Game Production',
  'production-design': 'Production Design',
}

function cardHTML(project) {
  const image = project.thumbnail
    ? `<img src="/assets/${project.thumbnail}" alt="${project.title}" loading="lazy">`
    : `<span class="card__placeholder-text">Coming soon</span>`

  const disciplineLabel = project.discipline
    .map(d => FILTER_LABELS[d])
    .join(', ')

  return `
    <article
      class="card project-card"
      data-discipline="${project.discipline.join(',')}"
    >
      <div class="card__image-wrap">${image}</div>
      <div class="card__body">
        <div class="card__title">${project.title}</div>
        <div class="card__meta">${disciplineLabel} · ${project.year}</div>
      </div>
    </article>`
}

function getActiveFilter() {
  const hash = location.hash.slice(1)
  return Object.keys(FILTER_LABELS).includes(hash) ? hash : 'all'
}

function applyFilter(filter) {
  document.querySelectorAll('.project-card').forEach(card => {
    const disciplines = card.dataset.discipline.split(',')
    card.hidden = filter !== 'all' && !disciplines.includes(filter)
  })
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter)
  })
}

const grid = document.getElementById('portfolio-grid')
grid.innerHTML = projects.map(cardHTML).join('')

document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter
    if (filter === 'all') {
      history.pushState('', document.title, location.pathname)
    } else {
      location.hash = filter
    }
    applyFilter(filter)
  })
})

window.addEventListener('hashchange', () => applyFilter(getActiveFilter()))
applyFilter(getActiveFilter())
