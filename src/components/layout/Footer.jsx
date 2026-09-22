import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Youtube, Linkedin, Music2, Mail, MapPin } from 'lucide-react'
import funacLogo from '@/assets/funac-logo.png'
import homeService from '../../services/homeService'

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Music2,
}

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([])

  useEffect(() => {
    homeService
      .getSocialMedia()
      .then((data) => {
        if (!data) return
        const links = Object.entries(data)
          .filter(([, cfg]) => cfg?.activo !== false && cfg?.url)
          .map(([key, cfg]) => ({ key, url: cfg.url, Icon: SOCIAL_ICONS[key] }))
          .filter((l) => l.Icon)
        setSocialLinks(links)
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-5" />
      <div className="blob top-0 left-1/3 h-72 w-72 bg-primary/30 animate-blob-float" />
      <div
        className="blob bottom-0 right-1/4 h-64 w-64 bg-secondary/20 animate-blob-float"
        style={{ animationDelay: '5s' }}
      />

      <div className="relative container mx-auto grid grid-cols-1 gap-12 px-6 py-20 md:grid-cols-12 md:gap-8">
        {/* Brand */}
        <div className="md:col-span-5">
          <img
            src={funacLogo}
            alt="FUNAC"
            className="h-12 w-auto object-contain"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/70">
            Construyendo el futuro con transparencia, compromiso y resultados medibles desde 2018.
          </p>
          <div className="mt-6 space-y-2 text-sm text-background/70">
            <p className="flex items-center gap-2">
              <MapPin size={14} /> Calle 100 #19-61, Centro Empresarial Cien, Bogotá D.C.
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} /> contacto@funac.org
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-3">
          <h4 className="text-xs uppercase tracking-widest text-background/60">Navegación</h4>
          <div className="mt-5 flex flex-col gap-3">
            {[
              { to: '/', label: 'Inicio' },
              { to: '/quienes-somos', label: 'Quiénes Somos' },
              { to: '/valores', label: 'Valores' },
              { to: '/mision-vision', label: 'Misión y Visión' },
              { to: '/contacto', label: 'Contáctenos' },
              { to: '/voluntarios', label: 'Voluntarios' },
              { to: '/donaciones', label: 'Donaciones' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-background/80 transition-all hover:text-funac-yellow hover:translate-x-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social */}
        {socialLinks.length > 0 && (
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-background/60">Síganos</h4>
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ key, url, Icon }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="group relative flex h-12 w-12 items-center justify-center rounded-xl glass-dark transition-all hover:bg-funac-yellow hover:text-foreground hover:-translate-y-1"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative border-t border-white/10 px-6 py-6 text-center text-xs text-background/60">
        © {new Date().getFullYear()} FUNAC — Fundación Ayudando a Construir. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer
