import { create } from 'zustand'
import {
  drinks,
  milks,
  syrups,
  extras,
  type Drink,
  type Layer,
  type MilkId,
  type Size,
  type SyrupId,
} from '../config/menu.config'

export type Phase = 'select' | 'brewing' | 'ready'

export const layerColors: Record<string, string> = {
  espresso: '#3B2418',
  milk: '#F3E7D3',
  foam: '#FBF3E4',
  syrup: '#C8782A',
  water: '#7a4d2e',
  cream: '#E9D3B0',
  ice: '#DFF1F7',
}

export interface Options {
  size: Size
  milk: MilkId
  syrup: SyrupId
  shot: boolean
  name: string
}

/** Собирает итоговые слои напитка с учётом выбранных опций (снизу вверх). */
export function buildLayers(drink: Drink, o: Options): Layer[] {
  const milk = milks.find((m) => m.id === o.milk)!
  const syrup = syrups.find((s) => s.id === o.syrup)!
  let layers: Layer[] = drink.layers.map((l) => ({ ...l, color: l.color ?? layerColors[l.type] }))

  const hasMilk = layers.some((l) => l.type === 'milk')
  if (hasMilk && o.milk === 'none') {
    // без молока молочный слой заменяется водой, а пена и сливки пропадают
    const milkAmount = layers.filter((l) => l.type === 'milk').reduce((s, l) => s + l.amount, 0)
    layers = layers
      .filter((l) => l.type !== 'foam' && l.type !== 'cream')
      .map((l) =>
        l.type === 'milk' ? { type: 'water', amount: milkAmount, color: '#6b4328' } : l,
      )
  } else if (hasMilk) {
    // оттенок молочного слоя зависит от вида молока; цветные рецепты (какао, матча) не трогаем
    layers = layers.map((l) =>
      l.type === 'milk' && (!drink.layers.find((d) => d.type === 'milk')?.color)
        ? { ...l, color: milk.color }
        : l,
    )
  }

  if (o.shot) {
    const i = layers.findIndex((l) => l.type === 'espresso')
    if (i >= 0) layers[i] = { ...layers[i], amount: layers[i].amount + 0.1 }
    else layers.unshift({ type: 'espresso', amount: 0.14, color: layerColors.espresso })
  }

  if (syrup.id !== 'none') {
    layers = layers.filter((l) => l.type !== 'syrup')
    layers.unshift({ type: 'syrup', amount: 0.06, color: syrup.color })
  }

  const sum = layers.filter((l) => l.type !== 'ice').reduce((s, l) => s + l.amount, 0)
  if (sum > 0.94) {
    const k = 0.94 / sum
    layers = layers.map((l) => (l.type === 'ice' ? l : { ...l, amount: l.amount * k }))
  }
  return layers
}

export function calcPrice(drink: Drink, o: Options): number {
  const milk = milks.find((m) => m.id === o.milk)!
  const hasMilk = drink.layers.some((l) => l.type === 'milk')
  let p = drink.prices[o.size]
  if (hasMilk) p += milk.extra
  if (o.syrup !== 'none') p += extras.syrup
  if (o.shot) p += extras.shot
  return p
}

interface OrderState extends Options {
  index: number
  phase: Phase
  orderNo: number
  setIndex: (i: number) => void
  set: <K extends keyof Options>(k: K, v: Options[K]) => void
  start: () => void
  finish: () => void
  reset: () => void
}

export const useOrder = create<OrderState>((set) => ({
  index: 2,
  size: 'M',
  milk: 'regular',
  syrup: 'none',
  shot: false,
  name: '',
  phase: 'select',
  orderNo: 0,
  setIndex: (i) => set({ index: Math.max(0, Math.min(drinks.length - 1, i)) }),
  set: (k, v) => set({ [k]: v } as Partial<OrderState>),
  start: () => set({ phase: 'brewing', orderNo: 100 + Math.floor(Math.random() * 900) }),
  finish: () => set({ phase: 'ready' }),
  reset: () => set({ phase: 'select', name: '' }),
}))

export function useCurrent() {
  const s = useOrder()
  const drink = drinks[s.index]
  const opts: Options = { size: s.size, milk: s.milk, syrup: s.syrup, shot: s.shot, name: s.name }
  return { drink, opts, layers: buildLayers(drink, opts), price: calcPrice(drink, opts) }
}
