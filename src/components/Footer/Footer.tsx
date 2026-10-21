import { site } from '../../config/site.config'

export function Footer() {
  return (
    <footer className="py-12" style={{ background: "#3B2418" }}>
      <div className="container-x flex flex-wrap gap-8 justify-between items-start">
        <div>
          <p className="font-display font-extrabold text-2xl text-[#F5EFE6]">{site.name}</p>
          <p className="mt-1 text-[#E3D2BF]">{site.slogan}</p>
        </div>
        <ul className="list-none p-0 m-0 flex gap-5 flex-wrap" aria-label="Соцсети">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-[#F5EFE6] font-semibold">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[#E3D2BF] text-sm w-full">
          © {new Date().getFullYear()} {site.name}. {site.address}.
        </p>
      </div>
    </footer>
  )
}
