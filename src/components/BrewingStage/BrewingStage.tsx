import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { Cup } from '../Cup/Cup'
import { useCurrent, useOrder } from '../../store/order'
import { useReducedMotion } from '../../hooks/hooks'
import { milks, syrups } from '../../config/menu.config'
import { site } from '../../config/site.config'
import type { LayerType } from '../../config/menu.config'

type StepId = 'order' | 'grind' | 'extract' | 'pour' | 'milk' | 'syrup' | 'lid' | 'ready'

const BEANS = Array.from({ length: 9 }, (_, i) => ({ x: 280 + ((i * 37) % 44), d: i * 0.16 }))

export function BrewingStage() {
  const { drink, opts, layers, price } = useCurrent()
  const orderNo = useOrder((s) => s.orderNo)
  const finish = useOrder((s) => s.finish)
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [shown, setShown] = useState<LayerType[]>([])
  const [lid, setLid] = useState(false)
  const [sleeve, setSleeve] = useState(false)

  const has = (t: LayerType) => layers.some((l) => l.type === t)
  const steps = useMemo(() => {
    const s: { id: StepId; label: string }[] = [{ id: 'order', label: 'Заказ принят' }]
    if (has('espresso')) {
      s.push({ id: 'grind', label: 'Помол' }, { id: 'extract', label: 'Экстракция' })
    }
    if (has('water')) s.push({ id: 'pour', label: has('espresso') ? 'Горячая вода' : 'Матча' })
    if (has('milk')) s.push({ id: 'milk', label: 'Молоко' })
    if (opts.syrup !== 'none') s.push({ id: 'syrup', label: 'Сироп' })
    s.push({ id: 'lid', label: 'Крышка и холдер' }, { id: 'ready', label: 'Готово' })
    return s
    // рецепт фиксируется на момент заказа
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const milkColor = milks.find((m) => m.id === opts.milk)!.color
  const syrupColor = syrups.find((m) => m.id === opts.syrup)!.color
  const waterColor = layers.find((l) => l.type === 'water')?.color ?? '#6b4328'
  const showArt = !!drink.latteArt && has('milk')
  const name = opts.name.trim() || 'Гость'

  useEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const ctx = gsap.context(() => {
      gsap.set(q('.s-receipt-in'), { yPercent: -105 })
      gsap.set([q('.s-grinder'), q('.s-holder'), q('.s-pitcher'), q('.s-bottle')], { autoAlpha: 0 })
      gsap.set(q('.s-grinder'), { y: -60 })
      gsap.set(q('.s-holder'), { y: -50 })
      gsap.set(q('.s-pitcher'), { x: -90, rotation: 0, transformOrigin: '50% 80%' })
      gsap.set(q('.s-bottle'), { x: 90, y: -30 })
      gsap.set(q('.s-stream'), { scaleY: 0, transformOrigin: '50% 0%' })
      gsap.set(q('.s-milkstream'), { strokeDashoffset: 120 })
      gsap.set(q('.s-bean, .s-dust, .s-drop'), { autoAlpha: 0 })
      gsap.set(q('.s-art'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' })

      const tl = gsap.timeline({ onComplete: () => setTimeout(finish, 500) })
      const mark = (i: number) => tl.call(() => setStepIdx(i))
      const reveal = (t: LayerType[]) => tl.call(() => setShown((p) => [...p, ...t]))
      const idx = (id: StepId) => steps.findIndex((s) => s.id === id)
      const out = (sel: string, at = '>') => tl.to(q(sel), { autoAlpha: 0, y: -40, duration: 0.3 }, at)

      // 1. Заказ принят: чек «печатается»
      mark(idx('order'))
      tl.to(q('.s-receipt-in'), { yPercent: 0, duration: 0.9, ease: 'steps(14)' })
      tl.to({}, { duration: 0.3 })

      // 2. Помол
      if (steps.some((s) => s.id === 'grind')) {
        mark(idx('grind'))
        tl.to(q('.s-grinder'), { autoAlpha: 1, y: 0, duration: 0.35, ease: 'back.out(1.6)' })
        tl.to(q('.s-grinder-body'), { x: '+=1.5', yoyo: true, repeat: 7, duration: 0.05 }, '<0.1')
        tl.to(q('.s-bean'), { autoAlpha: 1, y: 120, duration: 0.55, stagger: 0.1, ease: 'power1.in' }, '<')
        tl.to(q('.s-bean'), { autoAlpha: 0, duration: 0.1, stagger: 0.1 }, '<0.45')
        tl.fromTo(q('.s-dust'), { autoAlpha: 0, y: 0 }, { autoAlpha: 0.9, y: 70, duration: 0.5, stagger: 0.05 }, '<0.2')
        tl.to(q('.s-dust'), { autoAlpha: 0, duration: 0.2 })
        out('.s-grinder')
      }

      // 3. Экстракция: две струйки из холдера
      if (steps.some((s) => s.id === 'extract')) {
        mark(idx('extract'))
        tl.to(q('.s-holder'), { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' })
        tl.set(q('.s-stream'), { fill: '#3B2418' })
        tl.to(q('.s-stream'), { scaleY: 1, duration: 0.25, stagger: 0.08 })
        reveal(has('milk') ? ['espresso'] : ['espresso', 'cream'])
        tl.to({}, { duration: 1.1 })
        tl.to(q('.s-stream'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.25 })
        if (!steps.some((s) => s.id === 'pour')) out('.s-holder')
      }

      // вода (американо) или матча
      if (steps.some((s) => s.id === 'pour')) {
        mark(idx('pour'))
        tl.to(q('.s-holder'), { autoAlpha: 1, y: 0, duration: 0.3 })
        tl.set(q('.s-stream'), { fill: waterColor, transformOrigin: '50% 0%' })
        tl.to(q('.s-stream'), { scaleY: 1, duration: 0.25, stagger: 0.05 })
        reveal(['water'])
        tl.to({}, { duration: 0.8 })
        tl.to(q('.s-stream'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.25 })
        out('.s-holder')
      }

      // 4. Молоко + латте-арт
      if (steps.some((s) => s.id === 'milk')) {
        mark(idx('milk'))
        tl.to(q('.s-pitcher'), { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' })
        tl.to(q('.s-pitcher'), { rotation: -34, duration: 0.35, ease: 'power1.inOut' })
        tl.to(q('.s-milkstream'), { strokeDashoffset: 0, duration: 0.3 })
        reveal(['milk', 'foam', 'cream', 'ice'])
        tl.to({}, { duration: 0.9 })
        if (showArt) tl.to(q('.s-art'), { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' })
        tl.to(q('.s-milkstream'), { strokeDashoffset: -120, duration: 0.3 })
        tl.to(q('.s-pitcher'), { rotation: 0, autoAlpha: 0, x: -80, duration: 0.4 })
      }

      // 5. Сироп
      if (steps.some((s) => s.id === 'syrup')) {
        mark(idx('syrup'))
        tl.to(q('.s-bottle'), { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'power2.out' })
        tl.to(q('.s-bottle'), { rotation: 60, transformOrigin: '30% 70%', duration: 0.25 })
        tl.fromTo(q('.s-drop'), { autoAlpha: 1, y: 0 }, { y: 120, duration: 0.45, stagger: 0.18, ease: 'power1.in' }, '<0.1')
        reveal(['syrup'])
        tl.to(q('.s-drop'), { autoAlpha: 0, duration: 0.1 })
        tl.to(q('.s-bottle'), { autoAlpha: 0, x: 80, duration: 0.3 }, '>0.2')
      }

      // 6. Крышка и холдер
      mark(idx('lid'))
      tl.to(q('.s-art'), { autoAlpha: 0, duration: 0.2 })
      tl.call(() => setLid(true))
      tl.to({}, { duration: 0.55 })
      tl.call(() => setSleeve(true))
      tl.to({}, { duration: 0.6 })

      // 7. Готово
      mark(idx('ready'))
      tl.to({}, { duration: 0.4 })

      if (reduced) tl.timeScale(2.5)
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visible = layers.filter((l) => shown.includes(l.type))
  const grow = visible.filter((l) => l.type !== 'ice').length

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-y-auto bg-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Приготовление заказа"
    >
      <div className="container-x py-5 md:py-8 min-h-full flex flex-col">
        <div className="flex items-center justify-between gap-4 mb-5">
          <p className="font-display font-extrabold text-xl">{site.shortName}</p>
          <button type="button" className="btn btn-ghost !min-h-[44px]" onClick={finish}>
            Пропустить анимацию
          </button>
        </div>

        {/* прогресс этапов */}
        <ol className="flex gap-1.5 md:gap-2 mb-4 list-none p-0 m-0" aria-label="Этапы приготовления">
          {steps.map((s, i) => (
            <li key={s.id} className="flex-1 min-w-0" aria-current={i === stepIdx ? 'step' : undefined}>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={false}
                  animate={{ width: i < stepIdx ? '100%' : i === stepIdx ? '100%' : '0%' }}
                  transition={{ duration: i === stepIdx ? 1.2 : 0.2 }}
                />
              </div>
              <span
                className={`hidden md:block mt-2 text-sm truncate ${i === stepIdx ? 'font-bold text-ink' : 'text-mute'}`}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
        <p className="md:hidden font-bold mb-2" aria-live="polite">
          {steps[stepIdx]?.label}
        </p>

        <div className="flex-1 grid place-items-center">
          <div ref={root} className="relative w-full max-w-[600px] aspect-[600/520]">
            {/* чек */}
            <div className="absolute left-0 top-0 w-[34%] overflow-hidden z-20" aria-hidden="true">
              <div className="s-receipt-in bg-[#fffdf6] text-[#2a1a10] text-[11px] md:text-[13px] leading-snug px-3 pt-3 pb-5 shadow-md [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),92%_100%,84%_calc(100%-8px),76%_100%,68%_calc(100%-8px),60%_100%,52%_calc(100%-8px),44%_100%,36%_calc(100%-8px),28%_100%,20%_calc(100%-8px),12%_100%,4%_calc(100%-8px),0_100%)]">
                <p className="font-extrabold tracking-tight">{site.shortName}</p>
                <p className="font-bold mt-1">Заказ № {orderNo}</p>
                <p>{name}</p>
                <hr className="border-dashed border-[#2a1a10]/30 my-1.5" />
                <p>
                  {drink.name}, {opts.size}
                </p>
                {has('milk') && opts.milk !== 'regular' && <p>{milks.find((m) => m.id === opts.milk)!.name} молоко</p>}
                {opts.syrup !== 'none' && <p>Сироп: {syrups.find((m) => m.id === opts.syrup)!.name}</p>}
                {opts.shot && <p>Доп. шот</p>}
                <p className="font-extrabold mt-1">
                  {price} {site.currency}
                </p>
              </div>
            </div>

            {/* стакан */}
            <div className="absolute left-1/2 bottom-0 w-[36%] -translate-x-1/2">
              <Cup
                layers={visible}
                size={opts.size}
                transparent={!sleeve}
                hot={drink.hot}
                cold={!drink.hot}
                showLid={lid}
                showSleeve={sleeve}
                stickerName={undefined}
                tween={grow > 0 ? 1400 : 300}
              />
            </div>

            {/* сцена над стаканом */}
            <svg viewBox="0 0 600 520" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" aria-hidden="true">
              {/* кофемолка */}
              <g className="s-grinder">
                <g className="s-grinder-body">
                  <path d="M262 20 H338 L326 84 H274 Z" fill="#8a8f93" opacity=".55" stroke="#3B2418" strokeWidth="3" />
                  {BEANS.slice(0, 5).map((_b, i) => (
                    <ellipse key={i} cx={278 + i * 11} cy={60 + (i % 2) * 8} rx="5" ry="7" fill="#3B2418" transform={`rotate(${i * 30} ${278 + i * 11} 62)`} />
                  ))}
                  <rect x="270" y="84" width="60" height="46" rx="8" fill="#3B2418" />
                  <rect x="286" y="130" width="28" height="12" fill="#2a1a10" />
                  <circle cx="300" cy="106" r="7" fill="#C8894B" />
                </g>
                {BEANS.map((b, i) => (
                  <ellipse key={i} className="s-bean" cx={b.x + 6} cy="140" rx="5" ry="7" fill="#3B2418" transform={`rotate(${i * 40} ${b.x + 6} 140)`} />
                ))}
                {Array.from({ length: 12 }, (_, i) => (
                  <circle key={i} className="s-dust" cx={290 + (i % 6) * 4} cy={150 + (i % 3) * 3} r="1.8" fill="#5a3a26" />
                ))}
              </g>

              {/* холдер с двумя струйками */}
              <g className="s-holder">
                <rect x="296" y="118" width="130" height="14" rx="7" fill="#2a1a10" />
                <path d="M266 130 H334 L322 172 H278 Z" fill="#B8BCBF" stroke="#3B2418" strokeWidth="3" strokeLinejoin="round" />
                <rect className="s-stream" x="287" y="172" width="4.5" height="82" rx="2" fill="#3B2418" />
                <rect className="s-stream" x="309" y="172" width="4.5" height="82" rx="2" fill="#3B2418" />
              </g>

              {/* питчер с молоком */}
              <g className="s-pitcher">
                <path d="M120 120 H210 L202 196 Q200 206 190 206 H140 Q130 206 128 196 Z" fill="#C9CDD0" stroke="#3B2418" strokeWidth="3" strokeLinejoin="round" />
                <path d="M210 124 L232 112 L210 140" fill="#C9CDD0" stroke="#3B2418" strokeWidth="3" strokeLinejoin="round" />
                <path d="M120 140 Q96 150 120 178" fill="none" stroke="#3B2418" strokeWidth="5" strokeLinecap="round" />
                <path d="M124 126 H206" stroke={milkColor} strokeWidth="6" strokeLinecap="round" />
                <path className="s-milkstream" d="M228 116 Q282 130 300 258" fill="none" stroke={milkColor} strokeWidth="9" strokeLinecap="round" strokeDasharray="120 400" style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,.25))' }} />
                {[150, 172].map((x, i) => (
                  <path key={x} className={`steam steam-${i + 1}`} d={`M${x} 114 c-6 -9 6 -17 0 -26`} fill="none" stroke="#3B2418" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
                ))}
              </g>

              {/* бутылка сиропа */}
              <g className="s-bottle">
                <rect x="400" y="60" width="44" height="86" rx="10" fill={syrupColor === 'transparent' ? '#C8782A' : syrupColor} stroke="#3B2418" strokeWidth="3" />
                <rect x="412" y="40" width="20" height="22" rx="4" fill="#3B2418" />
                <rect x="404" y="86" width="36" height="30" rx="4" fill="#FFF8EE" opacity=".8" />
              </g>
              {[0, 1, 2].map((i) => (
                <path key={i} className="s-drop" d="M300 150 c-4 8 -7 12 -7 16 a7 7 0 0 0 14 0 c0 -4 -3 -8 -7 -16z" fill={syrupColor === 'transparent' ? '#C8782A' : syrupColor} transform="translate(0 40)" />
              ))}
            </svg>

            {/* латте-арт: вид сверху */}
            {showArt && (
              <div className="s-art absolute right-[2%] top-[4%] w-[26%] aspect-square rounded-full bg-[#7a4d2e] shadow-lg grid place-items-center ring-4 ring-surface" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="w-[88%] h-[88%]">
                  <circle cx="50" cy="50" r="46" fill="#4a2c1b" />
                  {drink.latteArt === 'heart' ? (
                    <path d="M50 78 C20 56 26 30 42 32 C48 33 50 38 50 38 C50 38 52 33 58 32 C74 30 80 56 50 78Z" fill={milkColor} />
                  ) : (
                    <g fill={milkColor}>
                      <path d="M50 20 C70 28 74 44 50 52 C26 44 30 28 50 20Z" />
                      <path d="M50 44 C72 50 74 66 50 74 C26 66 28 50 50 44Z" />
                      <path d="M49 70 H51 V86 H49Z" />
                    </g>
                  )}
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
