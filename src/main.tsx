import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { site } from './config/site.config'
import './styles/index.css'

// акцентный цвет и микроразметка берутся из конфига
const root = document.documentElement
root.style.setProperty('--accent', site.accent)
const style = document.createElement('style')
style.textContent = `[data-theme='dark']{--accent:${site.accentDark}}`
document.head.appendChild(style)

const ld = document.getElementById('ld-json')
if (ld)
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: site.name,
    description: site.slogan,
    address: site.address,
    telephone: site.phone,
    email: site.email,
    openingHours: ['Mo-Fr 08:00-21:00', 'Sa-Su 09:00-22:00'],
    servesCuisine: 'Кофе, десерты',
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
