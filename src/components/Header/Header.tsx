import { useEffect, useState } from 'react'
import { site } from '../../config/site.config'
import { images } from '../../config/images.config'
import { useImageOk } from '../../hooks/hooks'

const links = [
  { href: '#order', label: 'Заказ' },
  { href: '#menu', label: 'Меню' },
  { href: '#about', label: 'О нас' },
  { href: '#gallery', label: 'Галерея' },
  { href: '#location', label: 'Контакты' },
]

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light') return saved
    } catch {
      /* без хранилища работаем с системной темой */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])
  return [theme, () => setTheme(theme === 'dark' ? 'light' : 'dark')] as const
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, toggle] = useTheme()
  const logoOk = useImageOk(images.logo)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/70 backdrop-blur-lg shadow-[0_1px_0_var(--line)]' : 'bg-transparent'
      }`}
    >
      <div className="container-x h-[68px] flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-display font-extrabold text-xl no-underline text-ink" aria-label={`${site.name}, на главную`}>
          {logoOk ? <img src={images.logo} alt="" className="h-8" /> : null}
          {site.name}
        </a>
        <nav aria-label="Разделы сайта" className="hidden md:flex gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-ink no-underline font-semibold hover:text-accent transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            className="w-11 h-11 grid place-items-center rounded-full bg-transparent border-0 text-ink hover:bg-line transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {theme === 'dark' ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </>
              ) : (
                <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
              )}
            </svg>
          </button>
          <a href="#order" className="btn !min-h-[44px] !px-5 no-underline">
            Заказать
          </a>
        </div>
      </div>
    </header>
  )
}
