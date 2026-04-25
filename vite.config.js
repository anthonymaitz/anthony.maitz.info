import { defineConfig } from 'vite'

function spaMiddleware(server) {
  server.middlewares.use((req, res, next) => {
    const pathname = req.url.split('?')[0]
    if (pathname === '/pdf' || pathname === '/resume-as-pdf') {
      res.writeHead(301, { Location: '/resume.pdf' })
      res.end()
      return
    }
    if (pathname === '/resume' || pathname === '/portfolio') {
      req.url = '/index.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '')
    }
    next()
  })
}

const spaRouting = {
  name: 'spa-routing',
  configureServer: spaMiddleware,
  configurePreviewServer: spaMiddleware,
}

export default defineConfig({
  base: '/',
  server: {
    host: true,
    port: 5300,
  },
  build: {
    outDir: 'dist',
  },
  plugins: [spaRouting],
})
