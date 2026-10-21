import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { Cup } from '../Cup/Cup'
import { useCurrent, useOrder } from '../../store/order'
import { useReducedMotion } from '../../hooks/hooks'
import { site } from '../../config/site.config'

export function ReadyCup() {
  const { drink, opts, layers, price } = useCurrent()
  const orderNo = useOrder((s) => s.orderNo)
  const reset = useOrder((s) => s.reset)
  const reduced = useReducedMotion()
  const card = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const name = opts.name.trim() || 'Гость'

  // сдержанный разлёт зёрен после наклейки стикера
  const beans = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4
        const r = 150 + Math.random() * 110
        return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7 - 40, rot: Math.random() * 360, d: 0.9 + Math.random() * 0.2 }
      }),
    [],
  )

  const share = async () => {
    if (!card.current) return
    setBusy(true)
    setError('')
    try {
      const url = await toPng(card.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
      })
      const a = document.createElement('a')
      a.download = `${site.shortName}-${name}-${orderNo}.png`.replace(/\s+/g, '-')
      a.href = url
      a.click()
    } catch {
      setError('Не удалось создать картинку. Попробуйте ещё раз.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div
      className="max-w-xl mx-auto text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div ref={card} className="relative px-6 pt-10 pb-8 rounded-big bg-cream">
        <div className="relative w-[230px] sm:w-[270px] mx-auto">
          {!reduced &&
            beans.map((b, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 w-[9px] h-[13px] rounded-[50%] bg-espresso z-10"
                initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                animate={{ x: b.x, y: [0, b.y, b.y + 60], opacity: [0, 1, 0], rotate: b.rot }}
                transition={{ delay: b.d, duration: 1.5, ease: 'easeOut' }}
              />
            ))}
          <Cup layers={layers} size={opts.size} showLid showSleeve stickerName={name} hot={false} float className="drop-shadow-[0_24px_24px_rgba(59,36,24,.25)]" />
        </div>
        <h3 className="text-3xl md:text-4xl mt-6">
          {name}, ваш {drink.name.toLowerCase()} готов!
        </h3>
        <p className="mt-2 text-mute">
          Заказ № {orderNo} · {price} {site.currency}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <button type="button" className="btn" onClick={reset}>
          Заказать ещё
        </button>
        <button type="button" className="btn btn-ghost" onClick={share} disabled={busy}>
          {busy ? 'Готовим картинку…' : 'Поделиться'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-accent font-semibold">
          {error}
        </p>
      )}
    </motion.div>
  )
}
