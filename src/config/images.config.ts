// Пути к фотографиям. Файлы кладите в public/images/ с этими именами.
// Если файла нет, сайт покажет заглушку в цветах бренда.
const raw = {
  logo: '/images/logo.svg',
  hero: '/images/hero.jpg',
  about: ['/images/about-1.jpg', '/images/about-2.jpg'],
  gallery: [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
    '/images/gallery-5.jpg',
    '/images/gallery-6.jpg',
    '/images/gallery-7.jpg',
    '/images/gallery-8.jpg',
  ],
  menu: {
    espresso: '/images/menu/espresso.jpg',
    americano: '/images/menu/americano.jpg',
    cappuccino: '/images/menu/cappuccino.jpg',
    latte: '/images/menu/latte.jpg',
    'flat-white': '/images/menu/flat-white.jpg',
    raf: '/images/menu/raf.jpg',
    mocha: '/images/menu/mocha.jpg',
    'iced-latte': '/images/menu/iced-latte.jpg',
    'matcha-latte': '/images/menu/matcha-latte.jpg',
    cocoa: '/images/menu/cocoa.jpg',
    lemonade: '/images/menu/lemonade.jpg',
    'tea-bergamot': '/images/menu/tea-bergamot.jpg',
    croissant: '/images/menu/croissant.jpg',
    cheesecake: '/images/menu/cheesecake.jpg',
    brownie: '/images/menu/brownie.jpg',
    'cinnamon-roll': '/images/menu/cinnamon-roll.jpg',
  } as Record<string, string>,
}

// Пути работают и на корне домена, и в подпапке (GitHub Pages): добавляем base.
const withBase = <T,>(v: T): T => {
  if (typeof v === 'string') return (import.meta.env.BASE_URL + v.replace(/^\//, '')) as T
  if (Array.isArray(v)) return v.map(withBase) as T
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withBase(x)])) as T
  return v
}
export const images: typeof raw = withBase(raw)
