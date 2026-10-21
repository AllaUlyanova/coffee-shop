import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base нужен для GitHub Pages (сайт лежит в подпапке /coffee-shop/).
// Для Vercel/Netlify собирайте с BASE=/ : BASE=/ npm run build
export default defineConfig({ base: process.env.BASE ?? '/coffee-shop/', plugins: [react()] })
