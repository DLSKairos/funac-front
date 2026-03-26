import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Heart } from 'lucide-react'
import homeService from '../../services/homeService'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/quienes-somos', label: 'Quienes Somos' },
  { to: '/valores', label: 'Valores' },
  { to: '/mision-vision', label: 'Mision y Vision' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/voluntarios', label: 'Voluntarios' },
  { to: '/donaciones', label: 'Donaciones' },
]

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState([])

  useEffect(() => {
    homeService.getSocialMedia()
      .then((data) => {
        const links = Array.isArray(data) ? data : (data?.redes || [])
        setSocialLinks(links.filter((r) => r.activo && r.url))
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-funac-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white font-black text-sm">F</span>
              </div>
              <span className="font-black text-xl">
                <span className="text-funac-orange">FUN</span>
                <span className="text-white">AC</span>
              </span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Fundacion de Apoyo a la Comunidad. Trabajamos para construir un futuro mejor a traves del voluntariado, la solidaridad y el compromiso social.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-300 mb-4">Navegacion</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-blue-200 hover:text-funac-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-300 mb-4">Siguenos</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((red) => {
                const Icon = socialIcons[red.red?.toLowerCase()] || null
                if (!Icon) return null
                return (
                  <a
                    key={red.red}
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/10 hover:bg-funac-orange transition-colors"
                    aria-label={red.red}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-300 text-sm">
            &copy; {new Date().getFullYear()} FUNAC. Todos los derechos reservados.
          </p>
          <p className="text-blue-300 text-sm flex items-center gap-1.5">
            Hecho con <Heart size={14} className="text-funac-orange" /> por la comunidad
          </p>
        </div>
      </div>
    </footer>
  )
}
