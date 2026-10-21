import { memo, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Layer, Size } from '../../config/menu.config'
import { SLOTS, rgb, useAnimatedLayers, useImageOk } from '../../hooks/hooks'
import { images } from '../../config/images.config'
import { site } from '../../config/site.config'

export interface CupProps {
  size?: Size
  layers: Layer[]
  fillProgress?: number // 0..1
  showLid?: boolean
  showSleeve?: boolean
  stickerName?: string
  transparent?: boolean // режим «рентгена»
  hot?: boolean // пар над напитком
  cold?: boolean // конденсат на стенке
  tween?: number // длительность перетекания слоёв, мс
  float?: boolean
  className?: string
}

const SCALE: Record<Size, number> = { S: 0.86, M: 1, L: 1.12 }

// Геометрия стакана в координатах viewBox 0 0 200 330
const TOP = 70
const BOTTOM = 306
const xl = (y: number) => 36 + ((y - TOP) * 22) / (BOTTOM - TOP)
const xr = (y: number) => 200 - xl(y)
const LIQ_BOTTOM = 303
const LIQ_H = 226

const cupPath = (inset = 0) =>
  `M${xl(TOP) + inset} ${TOP} L${xr(TOP) - inset} ${TOP} L${xr(BOTTOM) - inset} ${BOTTOM - inset} Q100 ${BOTTOM + 3 - inset} ${xl(BOTTOM) + inset} ${BOTTOM - inset} Z`

const wavePath = (y: number, amp: number) => {
  let d = `M-40 ${y} q10 ${-amp} 20 0`
  for (let i = 0; i < 13; i++) d += ' t20 0'
  return d + ` L240 340 L-40 340 Z`
}

function CupBase({
  size = 'M',
  layers,
  fillProgress = 1,
  showLid = false,
  showSleeve = false,
  stickerName,
  transparent = false,
  hot = false,
  cold = false,
  tween = 600,
  float = false,
  className = '',
}: CupProps) {
  const uid = useId().replace(/:/g, '')
  const { slots, ice } = useAnimatedLayers(layers, fillProgress, tween)
  const logoOk = useImageOk(images.logo)

  // верхние границы слоёв
  let cum = 0
  const tops = slots.map((s) => {
    cum += s.amount
    return LIQ_BOTTOM - cum * LIQ_H
  })
  const present = slots.map((s) => s.amount > 0.004)
  const topIdx = present.lastIndexOf(true)
  const liquidTop = topIdx >= 0 ? tops[topIdx] : LIQ_BOTTOM

  // смесь на границе эспрессо и молочного слоя
  const iEsp = SLOTS.indexOf('espresso')
  const upperIdx = [SLOTS.indexOf('milk'), SLOTS.indexOf('cream'), SLOTS.indexOf('foam')].find(
    (i) => present[i],
  )
  const mix = present[iEsp] && upperIdx !== undefined ? { y: tops[iEsp], from: slots[upperIdx].color, to: slots[iEsp].color } : null

  const sticker = (stickerName ?? '').trim()
  const fs = Math.min(30, 96 / (Math.max(sticker.length, 1) * 0.43))

  return (
    <div className={`cup-wrap ${float ? 'float' : ''} ${className}`}>
      <motion.svg
        viewBox="0 0 200 330"
        role="img"
        aria-label="Стаканчик с напитком"
        className="block w-full h-auto overflow-visible"
        animate={{ scale: SCALE[size] }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        style={{ transformOrigin: '50% 100%' }}
      >
        <defs>
          <clipPath id={`${uid}c`}>
            <path d={cupPath(3)} />
          </clipPath>
          <linearGradient id={`${uid}p`} x1="0" x2="1">
            <stop offset="0" stopColor="#E6D8C2" />
            <stop offset=".35" stopColor="#FFFBF2" />
            <stop offset="1" stopColor="#DCCBB1" />
          </linearGradient>
          <linearGradient id={`${uid}k`} x1="0" x2="1">
            <stop offset="0" stopColor="#A8763F" />
            <stop offset=".4" stopColor="#C8894B" />
            <stop offset="1" stopColor="#94622F" />
          </linearGradient>
          <linearGradient id={`${uid}m`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mix ? rgb(mix.from) : '#fff'} />
            <stop offset="1" stopColor={mix ? rgb(mix.to) : '#fff'} />
          </linearGradient>
          <pattern id={`${uid}f`} width="14" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.6" fill="#fff" opacity=".55" />
            <circle cx="10" cy="8" r="1.1" fill="#C9A878" opacity=".45" />
            <circle cx="12" cy="2" r=".8" fill="#fff" opacity=".6" />
            <circle cx="5" cy="10" r=".9" fill="#C9A878" opacity=".35" />
          </pattern>
        </defs>

        {/* пар */}
        {hot && !showLid && fillProgress > 0.3 && (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3.5" opacity=".5" className="text-espresso/50 dark:text-cream/60">
            {[78, 100, 122].map((x, i) => (
              <path key={x} className={`steam steam-${i + 1}`} d={`M${x} ${liquidTop - 6} c-8 -12 8 -22 0 -34`} />
            ))}
          </g>
        )}

        {/* жидкость: слои рисуем сверху вниз, нижние перекрывают, поэтому зазоров нет */}
        {transparent && (
          <g clipPath={`url(#${uid}c)`}>
            <g className="sway">
              {SLOTS.map((_t, k) => k)
                .reverse()
                .map((i) => {
                  if (!present[i]) return null
                  const s = slots[i]
                  const isFoam = SLOTS[i] === 'foam'
                  const y = tops[i]
                  return isFoam ? (
                    <g key={i}>
                      <path d={`M20 ${y + 2} Q100 ${y - 13} 180 ${y + 2} L180 340 L20 340Z`} fill={rgb(s.color)} />
                      <path d={`M20 ${y + 2} Q100 ${y - 13} 180 ${y + 2} L180 340 L20 340Z`} fill={`url(#${uid}f)`} />
                    </g>
                  ) : (
                    <g key={i} className="wave" style={{ animationDuration: `${2.4 + i * 0.35}s`, animationDelay: `${-i * 0.7}s` }}>
                      <path d={wavePath(y, 3.2)} fill={rgb(s.color)} />
                    </g>
                  )
                })}
            </g>
            {mix && (
              <rect x="0" y={mix.y - 8} width="200" height="14" fill={`url(#${uid}m)`} opacity=".9" />
            )}
            {ice > 0.03 && (
              <g opacity={Math.min(1, ice)} fill="#EAF8FF" fillOpacity=".5" stroke="#fff" strokeOpacity=".8" strokeWidth="1.4">
                {[
                  [78, 14, -12],
                  [112, 8, 9],
                  [92, 38, 16],
                  [130, 30, -8],
                  [70, 54, 6],
                ].map(([x, dy, r], i) => (
                  <rect
                    key={i}
                    className="ice"
                    style={{ animationDelay: `${-i * 0.6}s` }}
                    x={x}
                    y={liquidTop + dy}
                    width="24"
                    height="24"
                    rx="5"
                    transform={`rotate(${r} ${x + 12} ${liquidTop + dy + 12})`}
                  />
                ))}
              </g>
            )}
          </g>
        )}

        {/* стенка */}
        {transparent ? (
          <>
            <path d={cupPath()} fill="rgba(255,255,255,.10)" stroke="currentColor" strokeWidth="2.5" className="text-espresso/70 dark:text-cream/70" />
            <path d={`M${xl(96) + 8} 96 L${xl(260) + 9} 262`} stroke="#fff" strokeOpacity=".5" strokeWidth="5" strokeLinecap="round" />
          </>
        ) : (
          <path d={cupPath()} fill={`url(#${uid}p)`} stroke="#B49B78" strokeWidth="1.5" />
        )}

        {/* конденсат */}
        {cold && transparent && (
          <g fill="#fff" fillOpacity=".55">
            {[
              [60, 130, 3],
              [140, 150, 2.4],
              [72, 190, 2.8],
              [128, 214, 3.2],
              [84, 246, 2.2],
            ].map(([x, y, r], i) => (
              <ellipse key={i} className="drop" style={{ animationDelay: `${-i * 1.3}s` }} cx={x} cy={y} rx={r} ry={r * 1.4} />
            ))}
          </g>
        )}

        {/* логотип на бумажном стакане */}
        {!transparent && (
          <g>
            {logoOk ? (
              <image href={images.logo} x="70" y="84" width="60" height="44" preserveAspectRatio="xMidYMid meet" />
            ) : (
              <text x="100" y="114" textAnchor="middle" fontFamily="'Literata Variable', serif" fontWeight="800" fontSize="15" fill="#3B2418" letterSpacing="-0.3">
                {site.shortName}
              </text>
            )}
            <path d={`M${xl(124) + 14} 124 H${xr(124) - 14}`} stroke="#C2441F" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* рукав-холдер */}
        <AnimatePresence>
          {showSleeve && (
            <motion.g
              key="sleeve"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            >
              <path
                d={`M${xl(150) - 2} 150 Q100 156 ${xr(150) + 2} 150 L${xr(236) + 2} 236 Q100 242 ${xl(236) - 2} 236 Z`}
                fill={`url(#${uid}k)`}
              />
              {[160, 174, 188, 202, 216, 228].map((y) => (
                <path key={y} d={`M${xl(y) + 1} ${y + 3} Q100 ${y + 8} ${xr(y) - 1} ${y + 3}`} fill="none" stroke="#7a4d22" strokeOpacity=".28" strokeWidth="1" />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* стикер с именем */}
        {sticker && (
          <motion.g
            key={sticker}
            initial={{ y: -230, rotate: -28, scale: 1.35, opacity: 0 }}
            animate={{
              y: [-230, 0, 0, 0, 0],
              rotate: [-28, -4, -4, -4, -4],
              scale: 1,
              scaleX: [1.35, 1.35, 1.14, 0.97, 1],
              scaleY: [1.35, 1.35, 0.78, 1.05, 1],
              opacity: 1,
            }}
            transition={{ duration: 1.1, times: [0, 0.5, 0.62, 0.8, 1], ease: 'easeOut' }}
          >
            <rect x="46" y="176" width="108" height="46" rx="5" fill="#000" opacity=".16" transform="translate(2 4)" />
            <rect x="46" y="176" width="108" height="46" rx="5" fill="#FFFDF6" stroke="#E2D6BF" strokeWidth="1" />
            <path d="M154 222 L154 205 Q154 209 150 212 Q146 216 137 222 Z" fill="#E4D8C0" />
            <path d="M154 222 L137 222 Q146 216 150 212 Q154 209 154 205 Z" fill="#C9BA9C" opacity=".55" />
            <text x="98" y={205 + fs * 0.08} textAnchor="middle" fontFamily="'Caveat Variable', cursive" fontWeight="700" fontSize={fs} fill="#2a1a10">
              {sticker}
            </text>
          </motion.g>
        )}

        {/* крышка */}
        <AnimatePresence>
          {showLid && (
            <motion.g
              key="lid"
              initial={{ y: -110, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 11, mass: 0.9 }}
            >
              <path d="M44 60 Q100 36 156 60 L158 66 L42 66 Z" fill="#4a2e20" />
              <rect x="30" y="64" width="140" height="11" rx="5.5" fill="#3B2418" />
              <path d="M60 52 Q100 40 138 50" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="124" cy="53" rx="9" ry="2.6" fill="#1d110a" />
            </motion.g>
          )}
        </AnimatePresence>
      </motion.svg>
    </div>
  )
}

export const Cup = memo(CupBase)
export default Cup
