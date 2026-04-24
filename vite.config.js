import { defineConfig } from 'vite'

const spaRouting = {
  name: 'spa-routing',
  configureServer(server) {
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
  },
  configurePreviewServer(server) {
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
  },
}

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
  plugins: [spaRouting],
})
