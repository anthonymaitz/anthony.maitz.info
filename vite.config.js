import { defineConfig } from 'vite'

const pdfRedirect = {
  name: 'pdf-redirect',
  configureServer(server) {
    server.middlewares.use('/pdf', (_req, res) => {
      res.writeHead(302, { Location: '/resume.pdf' })
      res.end()
    })
  },
  configurePreviewServer(server) {
    server.middlewares.use('/pdf', (_req, res) => {
      res.writeHead(302, { Location: '/resume.pdf' })
      res.end()
    })
  },
}

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
  plugins: [pdfRedirect],
})
