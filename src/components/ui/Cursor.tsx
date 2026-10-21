import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useMediaQuery } from '../../hooks/hooks'

/** Кастомный курсор-кружок: только для мыши, на тач-устройствах не рисуется. */
export function Cursor() {
  const fine = useMediaQuery('(pointer: fine)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fine || reduced || !dot.current) return
    const el = dot.current
    document.body.classList.add('has-cursor')
    const x = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3' })
    const move = (e: MouseEvent) => {
      x(e.clientX)
      y(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const hit = (e.target as HTMLElement).closest('a,button,input,label,[data-cursor]')
      gsap.to(el, { scale: hit ? 1.9 : 1, backgroundColor: hit ? 'rgba(194,68,31,.15)' : 'rgba(0,0,0,0)', duration: 0.2 })
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [fine, reduced])

  if (!fine || reduced) return null
  return <div ref={dot} className="cursor-dot" aria-hidden="true" />
}
