import { existsSync } from 'node:fs'
import path from 'node:path'

// `npm run dev` は Vite の開発サーバーだけなので、そのままでは api/ フォルダの
// Vercel Functions が動かない。開発時だけ Vite の中で同じハンドラーを直接呼び出し、
// 本番（Vercel）ではこのプラグインを使わず実際の Vercel Functions が動く。
export function apiDevPlugin() {
  const apiDir = path.resolve(process.cwd(), 'api')

  return {
    name: 'api-dev-plugin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()

        const url = new URL(req.url, 'http://localhost')
        const routeName = url.pathname.slice('/api/'.length).split('/')[0]
        const filePath = path.join(apiDir, `${routeName}.js`)

        if (!existsSync(filePath)) return next()

        const mod = await server.ssrLoadModule(filePath)
        const handler = mod.default
        if (typeof handler !== 'function') return next()

        req.query = Object.fromEntries(url.searchParams.entries())

        let body = ''
        for await (const chunk of req) body += chunk
        try {
          req.body = body ? JSON.parse(body) : {}
        } catch {
          req.body = {}
        }

        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }

        try {
          await handler(req, res)
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}
