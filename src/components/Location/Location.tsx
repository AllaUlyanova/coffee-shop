import { site } from '../../config/site.config'
import { Reveal, SectionTitle } from '../ui/ui'

export function Location() {
  return (
    <section id="location" className="py-20 md:py-28 bg-milk">
      <div className="container-x">
        <SectionTitle title="Как нас найти" />
        <div className="grid md:grid-cols-[.8fr_1.2fr] gap-8">
          <Reveal>
            <address className="not-italic grid gap-6">
              <div>
                <h3 className="text-xl mb-1">Адрес</h3>
                <p className="text-mute">{site.address}</p>
              </div>
              <div>
                <h3 className="text-xl mb-1">Часы работы</h3>
                <ul className="list-none p-0 m-0 text-mute">
                  {site.hours.map((h) => (
                    <li key={h.days}>
                      {h.days}: {h.time}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl mb-1">Связаться</h3>
                <p className="text-mute">
                  <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} className="text-ink font-semibold">
                    {site.phone}
                  </a>
                  <br />
                  <a href={`mailto:${site.email}`} className="text-ink font-semibold">
                    {site.email}
                  </a>
                </p>
              </div>
            </address>
          </Reveal>
          <Reveal delay={0.1}>
            <iframe
              title="Карта: как добраться до кофейни"
              src={site.mapEmbedUrl}
              loading="lazy"
              className="w-full h-[360px] md:h-[420px] rounded-big border-0 shadow-[var(--shadow)]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
