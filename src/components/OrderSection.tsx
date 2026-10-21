import { useRef } from 'react'
import { AnimatePresence, useInView } from 'framer-motion'
import { CupCarousel } from './CupCarousel/CupCarousel'
import { OrderBuilder } from './OrderBuilder/OrderBuilder'
import { BrewingStage } from './BrewingStage/BrewingStage'
import { ReadyCup } from './ReadyCup/ReadyCup'
import { useOrder } from '../store/order'
import { SectionTitle } from './ui/ui'

export function OrderSection() {
  const phase = useOrder((s) => s.phase)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.15 })

  return (
    <section id="order" ref={ref} className="py-20 md:py-28 bg-milk scroll-mt-16">
      <div className="container-x">
        <SectionTitle title="Соберите свой напиток" lead="Листайте стаканы, выбирайте размер, молоко и сироп. Стакан меняется сразу." />
        {phase === 'ready' ? (
          <ReadyCup />
        ) : (
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-center pb-24 lg:pb-0">
            <CupCarousel />
            <OrderBuilder visible={inView && phase === 'select'} />
          </div>
        )}
      </div>
      <AnimatePresence>{phase === 'brewing' && <BrewingStage key="brew" />}</AnimatePresence>
    </section>
  )
}
