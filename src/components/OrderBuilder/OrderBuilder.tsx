import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { drinks, milks, syrups, extras, type Size } from '../../config/menu.config'
import { site } from '../../config/site.config'
import { useCurrent, useOrder } from '../../store/order'
import { useMediaQuery } from '../../hooks/hooks'

function Chips<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { id: T; name: string; hint?: string }[]
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="font-bold mb-2 text-base">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            className={`min-h-[44px] px-4 rounded-full text-[15px] font-semibold transition-colors ${
              value === o.id
                ? 'bg-espresso text-cream'
                : 'bg-transparent text-ink shadow-[inset_0_0_0_2px_var(--line)] hover:shadow-[inset_0_0_0_2px_var(--ink)]'
            }`}
          >
            {o.name}
            {o.hint && <span className="opacity-70 font-medium"> {o.hint}</span>}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Panel() {
  const s = useOrder()
  const { drink, price } = useCurrent()
  const hasMilk = drink.layers.some((l) => l.type === 'milk')
  const hasEsp = drink.layers.some((l) => l.type === 'espresso')

  return (
    <div className="grid gap-5">
      <Chips<Size>
        label="Размер"
        value={s.size}
        onChange={(v) => s.set('size', v)}
        options={(['S', 'M', 'L'] as Size[]).map((z) => ({ id: z, name: z, hint: `${drink.volume[z]} мл` }))}
      />
      {hasMilk && (
        <Chips
          label="Молоко"
          value={s.milk}
          onChange={(v) => s.set('milk', v)}
          options={milks.map((m) => ({ id: m.id, name: m.name, hint: m.extra ? `+${m.extra}` : undefined }))}
        />
      )}
      <Chips
        label="Сироп"
        value={s.syrup}
        onChange={(v) => s.set('syrup', v)}
        options={syrups.map((m) => ({ id: m.id, name: m.name, hint: m.id !== 'none' ? `+${extras.syrup}` : undefined }))}
      />
      <label className="flex items-center gap-3 min-h-[44px] cursor-pointer font-bold">
        <input
          type="checkbox"
          checked={s.shot}
          onChange={(e) => s.set('shot', e.target.checked)}
          className="w-5 h-5 accent-[var(--accent)]"
        />
        <span>
          {hasEsp ? 'Ещё один шот эспрессо' : 'Добавить шот эспрессо'}{' '}
          <span className="font-medium text-mute">+{extras.shot} {site.currency}</span>
        </span>
      </label>
      <div>
        <label htmlFor="cust-name" className="font-bold block mb-2">
          Ваше имя для стикера
        </label>
        <input
          id="cust-name"
          value={s.name}
          maxLength={14}
          autoComplete="given-name"
          onChange={(e) => s.set('name', e.target.value)}
          placeholder="Гость"
          className="w-full min-h-[48px] px-4 rounded-soft bg-cream text-ink border-2 border-line focus:border-accent outline-none text-lg"
        />
        <p className="text-sm text-mute mt-1">{s.name.length}/14</p>
      </div>

      <motion.button
        type="button"
        className="btn !min-h-[56px] text-lg justify-between"
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        onClick={s.start}
      >
        <span>Заказать</span>
        <motion.span key={price} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {price} {site.currency}
        </motion.span>
      </motion.button>
    </div>
  )
}

export function OrderBuilder({ visible }: { visible: boolean }) {
  const mobile = useMediaQuery('(max-width: 1023px)')
  const [open, setOpen] = useState(false)
  const { drink, price } = useCurrent()
  const size = useOrder((s) => s.size)

  if (!mobile) {
    return (
      <aside className="card p-7" aria-label="Конструктор заказа">
        <h3 className="text-2xl mb-5">Соберите напиток</h3>
        <Panel />
      </aside>
    )
  }

  return (
    <>
      <div className="card p-5 lg:hidden" aria-hidden={visible}>
        <p className="text-mute text-sm">Размер, молоко, сироп и имя настраиваются внизу экрана.</p>
      </div>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="sheet"
            className="fixed inset-x-0 bottom-0 z-40 rounded-t-[24px] bg-surface shadow-[0_-12px_40px_-10px_rgba(0,0,0,.35)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            role="region"
            aria-label="Конструктор заказа"
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls="sheet-body"
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between gap-3 px-5 pt-3 pb-3 bg-transparent border-0 text-ink text-left"
            >
              <span>
                <span className="block mx-auto w-10 h-1.5 rounded-full bg-line mb-2" />
                <span className="font-bold">
                  {drink.name}, {size}
                </span>
                <span className="block text-sm text-mute">{open ? 'Свернуть' : 'Настроить'}</span>
              </span>
              <span className="font-bold text-lg">
                {price} {site.currency}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id="sheet-body"
                  key="body"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-y-auto max-h-[68vh] px-5 pb-6"
                  style={{ overflow: 'hidden auto' }}
                >
                  <Panel />
                </motion.div>
              ) : (
                <motion.div key="cta" className="px-5 pb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button type="button" className="btn w-full !min-h-[52px]" onClick={useOrder.getState().start}>
                    Заказать за {price} {site.currency}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export { drinks }
