import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '../../config/site.config'
import { images } from '../../config/images.config'
import { Img, Reveal } from '../ui/ui'

gsap.registerPlugin(ScrollTrigger)

export function About() {
  const facts = useRef<HTMLDListElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.utils.toArray<HTMLElement>('.count').forEach((el) => {
        const end = Number(el.dataset.value)
        const o = { v: reduce ? end : 0 }
        const write = () => (el.textContent = Math.round(o.v).toLocaleString('ru-RU'))
        write()
        if (reduce) return
        gsap.to(o, {
          v: end,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: write,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    }, facts)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="py-20 md:py-28 bg-milk">
      <div className="container-x grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <h2 className="text-4xl md:text-5xl">{site.about.title}</h2>
          <div className="mt-6 grid gap-4 text-mute max-w-prose">
            {site.about.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <dl ref={facts} className="mt-10 grid grid-cols-3 gap-4">
            {site.about.facts.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="m-0">
                  <span className="count font-display font-extrabold text-3xl md:text-5xl text-accent" data-value={f.value}>
                    {f.value.toLocaleString('ru-RU')}
                  </span>
                  <span className="block text-sm text-mute mt-1">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
          <Img src={images.about[0]} alt="Бариста за стойкой" seed={0} className="rounded-big w-full aspect-[3/4] object-cover" />
          <Img src={images.about[1]} alt="Обжарка зерна" seed={3} className="rounded-big w-full aspect-[3/4] object-cover mt-10" />
        </Reveal>
      </div>
    </section>
  )
}
