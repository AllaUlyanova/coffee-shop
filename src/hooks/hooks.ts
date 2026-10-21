import { useEffect, useRef, useState } from 'react'
import type { Layer, LayerType } from '../config/menu.config'

export function useMediaQuery(q: string) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Проверяет, что картинка существует и грузится (для логотипа и фото-заглушек). */
export function useImageOk(src?: string) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    if (!src) return
    let alive = true
    const img = new Image()
    img.onload = () => alive && setOk(true)
    img.onerror = () => alive && setOk(false)
    img.src = src
    return () => {
      alive = false
    }
  }, [src])
  return ok
}

/* ---------- плавное перетекание слоёв ---------- */

/** Порядок слоёв снизу вверх: у каждого типа свой постоянный «слот», поэтому слои можно плавно менять. */
export const SLOTS: Exclude<LayerType, 'ice'>[] = ['syrup', 'espresso', 'water', 'milk', 'cream', 'foam']

export interface SlotState {
  amount: number
  color: [number, number, number]
}

const hex = (h: string): [number, number, number] => {
  const s = h.replace('#', '')
  const n = parseInt(s.length === 3 ? s.replace(/./g, '$&$&') : s, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
export const rgb = (c: [number, number, number]) => `rgb(${c.map(Math.round).join(',')})`

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function target(layers: Layer[], fill: number): { slots: SlotState[]; ice: number } {
  const slots = SLOTS.map<SlotState>((t) => {
    const l = layers.find((x) => x.type === t)
    return { amount: l ? l.amount * fill : 0, color: hex(l?.color ?? '#888888') }
  })
  const ice = layers.find((l) => l.type === 'ice')
  return { slots, ice: ice ? ice.amount * Math.min(1, fill * 1.4) : 0 }
}

/** Плавно ведёт слои от прежнего состояния к новому за duration мс. */
export function useAnimatedLayers(layers: Layer[], fill: number, duration = 600) {
  const key = JSON.stringify(layers) + '|' + fill.toFixed(3)
  const [state, setState] = useState(() => target(layers, fill))
  const cur = useRef(state)
  const raf = useRef(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const from = cur.current
    const to = target(layers, fill)
    const dur = reduced ? 0 : duration
    const t0 = performance.now()
    cancelAnimationFrame(raf.current)
    const step = (now: number) => {
      const p = dur === 0 ? 1 : Math.min(1, (now - t0) / dur)
      const e = ease(p)
      const next = {
        slots: to.slots.map((s, i) => ({
          amount: from.slots[i].amount + (s.amount - from.slots[i].amount) * e,
          // цвет пустого слота не мешаем: берём цель, чтобы слой «рос» уже нужного цвета
          color: (from.slots[i].amount < 0.003
            ? s.color
            : s.color.map((c, k) => from.slots[i].color[k] + (c - from.slots[i].color[k]) * e)) as [number, number, number],
        })),
        ice: from.ice + (to.ice - from.ice) * e,
      }
      cur.current = next
      setState(next)
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, duration, reduced])

  return state
}
