import { useRef, type KeyboardEvent } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { drinks } from '../../config/menu.config'
import { site } from '../../config/site.config'
import { Cup } from '../Cup/Cup'
import { buildLayers, useCurrent, useOrder } from '../../store/order'

const STEP = 190

export function CupCarousel() {
  const { index, setIndex, size, milk, syrup, shot } = useOrder()
  const { drink, layers, price } = useCurrent()
  const ref = useRef<HTMLDivElement>(null)

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setIndex(index + 1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setIndex(index - 1)
    }
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const v = info.velocity.x
    const o = info.offset.x
    if (o < -50 || v < -450) setIndex(index + 1)
    else if (o > 50 || v > 450) setIndex(index - 1)
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="карусель"
      aria-label="Выбор напитка"
      tabIndex={0}
      onKeyDown={onKey}
      className="relative select-none outline-offset-8"
    >
      <div className="relative h-[430px] md:h-[500px] overflow-x-clip" style={{ perspective: 1100 }}>
        <motion.div
          className="absolute inset-0 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={onDragEnd}
          data-cursor
        >
          {drinks.map((d, i) => {
            const off = i - index
            if (Math.abs(off) > 2) return null
            const lay = buildLayers(d, { size, milk, syrup, shot, name: '' })
            return (
              <motion.button
                key={d.id}
                type="button"
                tabIndex={-1}
                aria-label={off === 0 ? `${d.name}, выбран` : `Выбрать ${d.name}`}
                onClick={() => setIndex(i)}
                className="absolute left-1/2 top-1/2 w-[150px] md:w-[190px] -ml-[75px] md:-ml-[95px] -mt-[120px] md:-mt-[150px] bg-transparent border-0 p-0"
                initial={false}
                animate={{
                  x: off * STEP,
                  scale: off === 0 ? 0.01 : 1 - Math.abs(off) * 0.22,
                  rotateY: off * -26,
                  opacity: off === 0 ? 0 : 1 - (Math.abs(off) - 1) * 0.35,
                  filter: `blur(${Math.abs(off) * 2.2}px)`,
                  zIndex: 10 - Math.abs(off),
                }}
                transition={{ type: 'spring', stiffness: 130, damping: 20, mass: 0.9 }}
                style={{ pointerEvents: off === 0 ? 'none' : 'auto' }}
              >
                <Cup layers={lay} transparent hot={d.hot} cold={!d.hot} size="M" tween={0} />
              </motion.button>
            )
          })}
        </motion.div>

        {/* активный стакан: слои перетекают из рецепта в рецепт */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-[210px] md:w-[270px] -translate-x-1/2 -translate-y-[52%]">
          <Cup layers={layers} size={size} transparent hot={drink.hot} cold={!drink.hot} float />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          className="btn btn-ghost !px-0 w-12"
          aria-label="Предыдущий напиток"
          onClick={() => setIndex(index - 1)}
          disabled={index === 0}
        >
          ←
        </button>
        <div className="text-center min-w-[240px]" aria-live="polite">
          <h3 className="text-3xl">{drink.name}</h3>
          <p className="text-mute text-base mt-1">{drink.description}</p>
          <p className="mt-2 text-sm text-mute">
            {drink.volume[size]} мл · {price} {site.currency}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost !px-0 w-12"
          aria-label="Следующий напиток"
          onClick={() => setIndex(index + 1)}
          disabled={index === drinks.length - 1}
        >
          →
        </button>
      </div>
    </div>
  )
}
