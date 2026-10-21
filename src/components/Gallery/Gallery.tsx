import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { images } from '../../config/images.config'
import { Img, SectionTitle } from '../ui/ui'

const RATIOS = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[4/3]']

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const n = images.gallery.length

  useEffect(() => {
    if (open === null) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % n))
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + n) % n))
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [open, n])

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="container-x">
        <SectionTitle title="Галерея" lead="Интерьер, стойка и то, что у нас в стаканах." />
        <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4">
          {images.gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Открыть фото ${i + 1} из ${n}`}
              className="group block w-full overflow-hidden rounded-card p-0 border-0 bg-transparent break-inside-avoid"
            >
              <Img src={src} alt={`Фото ${i + 1}`} seed={i} className={`w-full object-cover ${RATIOS[(i * 3) % 4]}`} hover />
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[95] bg-black/85 grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр фото"
            onClick={() => setOpen(null)}
          >
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <Img src={images.gallery[open]} alt={`Фото ${open + 1}`} seed={open} className="w-full max-h-[80vh] aspect-[4/3] object-contain rounded-card" />
              <div className="mt-4 flex justify-between gap-3">
                <button type="button" className="btn" onClick={() => setOpen((open - 1 + n) % n)} aria-label="Предыдущее фото">
                  ←
                </button>
                <button type="button" className="btn btn-ghost !text-white" onClick={() => setOpen(null)}>
                  Закрыть
                </button>
                <button type="button" className="btn" onClick={() => setOpen((open + 1) % n)} aria-label="Следующее фото">
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
