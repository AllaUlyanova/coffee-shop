import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { OrderSection } from './components/OrderSection'
import { Menu } from './components/Menu/Menu'
import { About } from './components/About/About'
import { Gallery } from './components/Gallery/Gallery'
import { Location } from './components/Location/Location'
import { Footer } from './components/Footer/Footer'
import { Cursor } from './components/ui/Cursor'
import { Playground } from './components/Playground'
import { useEffect, useState } from 'react'

export default function App() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => setHash(location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  if (hash === '#/playground') return <Playground />

  return (
    <>
      <a href="#order" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] btn">
        Перейти к заказу
      </a>
      <Header />
      <main>
        <Hero />
        <OrderSection />
        <Menu />
        <About />
        <Gallery />
        <Location />
      </main>
      <Footer />
      <Cursor />
    </>
  )
}
