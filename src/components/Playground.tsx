import { useState } from 'react'
import { drinks } from '../config/menu.config'
import { buildLayers } from '../store/order'
import { Cup } from './Cup/Cup'

/** Проверка стакана на всех напитках: открыть сайт с #/playground */
export function Playground() {
  const [xray, setXray] = useState(true)
  const [lid, setLid] = useState(false)
  return (
    <div className="container-x py-10">
      <h1 className="text-4xl mb-4">Playground: стакан</h1>
      <div className="flex gap-4 mb-8">
        <label><input type="checkbox" checked={xray} onChange={(e) => setXray(e.target.checked)} /> Рентген</label>
        <label><input type="checkbox" checked={lid} onChange={(e) => setLid(e.target.checked)} /> Крышка и холдер</label>
        <a href="#top">На сайт</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {drinks.map((d) => (
          <figure key={d.id} className="m-0 text-center">
            <Cup
              layers={buildLayers(d, { size: 'M', milk: 'regular', syrup: 'none', shot: false, name: '' })}
              transparent={xray}
              showLid={lid}
              showSleeve={lid}
              stickerName={lid ? 'Аня' : undefined}
              hot={d.hot}
              cold={!d.hot}
            />
            <figcaption>{d.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
