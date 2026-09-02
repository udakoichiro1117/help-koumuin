import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { apiDevPlugin } from './vite-plugins/apiDevPlugin.js'

export default defineConfig(({ mode }) => {
  // .env.local の DB接続情報などを process.env にも反映し、
  // apiDevPlugin 経由で動く api/ ハンドラーから参照できるようにする
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), apiDevPlugin()],
    // devcontainer からポート転送してホスト側ブラウザで開く運用のため、
    // ループバックだけでなく全インターフェースで待ち受ける
    server: {
      host: true,
      port: 5173,
    },
  }
})
