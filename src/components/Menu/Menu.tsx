import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { categories, menuItems, type MenuCategory } from '../../config/menu.config'
import { images } from '../../config/images.config'
import { site } from '../../config/site.config'
import { Img, SectionTitle } from '../ui/ui'

export function Menu() {
  const [cat, setCat] = useState<MenuCategory | 'all'>('all')
  const list = menuItems.filter((m) => cat === 'all' || m.category === cat)

  return (
    <section id="menu" className="py-20 md:py-28">
      <div className="container-x">
        <SectionTitle title="Меню" lead="Цены указаны для среднего размера. Остальные размеры и добавки выбираются в конструкторе." />
        <div role="tablist" aria-label="Категории меню" className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className={`min-h-[44px] px-5 rounded-full font-semibold transition-colors ${
                cat === c.id ? 'bg-espresso text-cream' : 'bg-transparent text-ink shadow-[inset_0_0_0_2px_var(--line)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <motion.ul layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
          <AnimatePresence mode="popLayout">
            {list.map((m, i) => (
              <motion.li
                layout
                key={m.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.02 }}
                whileHover={{ y: -6 }}
                className="group card overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Img src={images.menu[m.id]} alt={m.name} seed={i} className="w-full h-full object-cover" hover />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl">{m.name}</h3>
                    <span className="font-bold whitespace-nowrap">
                      {m.price} {site.currency}
                    </span>
                  </div>
                  <p className="text-mute text-[15px] mt-1">{m.description}</p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}
