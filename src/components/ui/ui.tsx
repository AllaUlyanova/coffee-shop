import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

/** Фото с аккуратной заглушкой, если файла нет. */
export function Img({
  src,
  alt,
  seed = 0,
  className = '',
  hover = false,
}: {
  src?: string
  alt: string
  seed?: number
  className?: string
  hover?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    const hues = ['#C8894B', '#A8643A', '#8a4b2d', '#D6A066', '#7a4d2e', '#B9763F']
    const a = hues[seed % hues.length]
    const b = hues[(seed + 2) % hues.length]
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid place-items-center ${className}`}
        style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
      >
        <svg width="42" height="42" viewBox="0 0 64 64" fill="none" aria-hidden="true" opacity=".7">
          <path d="M16 20h32l-4 32H20z" stroke="#FFF8EE" strokeWidth="3" strokeLinejoin="round" />
          <path d="M20 30h24" stroke="#FFF8EE" strokeWidth="3" />
          <path d="M26 10c-3 3 3 5 0 8M36 10c-3 3 3 5 0 8" stroke="#FFF8EE" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} ${hover ? 'transition-transform duration-500 group-hover:scale-105' : ''}`}
    />
  )
}

/** Появление блока при скролле (fade + slide). stagger задаётся через delay. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-4xl md:text-5xl">{title}</h2>
      {lead && <p className="mt-4 text-mute text-lg max-w-xl">{lead}</p>}
    </div>
  )
}
