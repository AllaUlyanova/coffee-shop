import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Cup } from '../Cup/Cup'
import { site } from '../../config/site.config'
import { images } from '../../config/images.config'
import { useImageOk, useMediaQuery } from '../../hooks/hooks'
import { buildLayers } from '../../store/order'
import { drinks } from '../../config/menu.config'

const BEAN_POS = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 53 + 7) % 100,
  y: (i * 37 + 11) % 100,
  s: 22 + ((i * 13) % 26),
  r: (i * 47) % 180,
  z: 0.4 + ((i * 7) % 10) / 10,
}))

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [fill, setFill] = useState(0)
  const heroOk = useImageOk(images.hero)
  const fine = useMediaQuery('(pointer: fine)')
  const latte = drinks.find((d) => d.id === 'latte')!
  const layers = buildLayers(latte, { size: 'M', milk: 'regular', syrup: 'none', shot: false, name: '' })

  // единственный «выход» на загрузке: стакан в рентген-режиме наполняется
  useEffect(() => {
    const t = setTimeout(() => setFill(1), 500)
    return () => clearTimeout(t)
  }, [])

  // параллакс зёрен по курсору
  useEffect(() => {
    if (!fine || !ref.current) return
    const el = ref.current
    const beans = el.querySelectorAll<HTMLElement>('.bean')
    const movers = Array.from(beans).map((b) => ({
      x: gsap.quickTo(b, 'x', { duration: 0.8, ease: 'power3' }),
      y: gsap.quickTo(b, 'y', { duration: 0.8, ease: 'power3' }),
      z: Number(b.dataset.z),
    }))
    const on = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      movers.forEach((m) => {
        m.x(nx * 60 * m.z)
        m.y(ny * 60 * m.z)
      })
    }
    window.addEventListener('mousemove', on)
    return () => window.removeEventListener('mousemove', on)
  }, [fine])

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-[68px] min-h-[92vh] flex items-center">
      {heroOk && (
        <img src={images.hero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      )}
      <div className="absolute inset-0 spin-slow pointer-events-none" aria-hidden="true" style={{ transformOrigin: '60% 50%' }}>
        {BEAN_POS.map((b, i) => (
          <span
            key={i}
            data-z={b.z}
            className="bean absolute block"
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s * 1.45, opacity: 0.16 + b.z * 0.1 }}
          >
            <svg viewBox="0 0 20 29" width="100%" height="100%" style={{ transform: `rotate(${b.r}deg)` }}>
              <ellipse cx="10" cy="14.5" rx="9" ry="13.5" fill="var(--espresso)" />
              <path d="M10 2 C4 10 16 19 10 27" stroke="var(--cream)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        ))}
      </div>

      <div className="container-x relative grid md:grid-cols-[1.15fr_.85fr] gap-6 items-center py-10">
        <div>
          <h1 className="text-[clamp(3.2rem,9vw,7rem)]">{site.name}</h1>
          <p className="mt-5 font-display text-2xl md:text-3xl font-semibold text-accent">{site.slogan}</p>
          <p className="mt-5 text-lg text-mute max-w-md">{site.heroText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#order" className="btn no-underline !min-h-[54px] text-lg">
              Собрать напиток
            </a>
            <a href="#menu" className="btn btn-ghost no-underline !min-h-[54px] text-lg">
              Смотреть меню
            </a>
          </div>
        </div>
        <div className="relative justify-self-center w-[220px] sm:w-[280px] md:w-[320px]">
          <Cup layers={layers} fillProgress={fill} transparent hot tween={2600} float />
        </div>
      </div>
    </section>
  )
}
