import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Facebook, Instagram, Twitter, Youtube, Linkedin, UserCog } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import homeService from '../../services/homeService'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/quienes-somos', label: 'Quienes Somos' },
  { to: '/valores', label: 'Valores' },
  { to: '/mision-vision', label: 'Mision y Vision' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/voluntarios', label: 'Voluntarios' },
]

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [socialLinks, setSocialLinks] = useState([])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    homeService.getSocialMedia()
      .then((data) => {
        const links = Array.isArray(data) ? data : (data?.redes || [])
        setSocialLinks(links.filter((r) => r.activo && r.url))
      })
      .catch(() => {})
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-funac-orange to-funac-navy flex items-center justify-center">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="font-black text-xl">
              <span className="text-funac-orange">FUN</span>
              <span className="text-funac-navy">AC</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-funac-orange bg-orange-50'
                      : 'text-gray-600 hover:text-funac-navy hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Social icons */}
            <div className="flex items-center gap-1.5">
              {socialLinks.slice(0, 4).map((red) => {
                const Icon = socialIcons[red.red?.toLowerCase()] || null
                if (!Icon) return null
                return (
                  <a
                    key={red.red}
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-funac-navy transition-colors rounded-lg hover:bg-gray-50"
                    aria-label={red.red}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
            <Link to="/donaciones">
              <Button size="sm">Donar Ahora</Button>
            </Link>
            <Link
              to="/admin"
              className="p-2 text-gray-400 hover:text-funac-navy transition-colors rounded-lg hover:bg-gray-50"
              title="Panel Administrador"
            >
              <UserCog size={18} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-funac-orange bg-orange-50'
                        : 'text-gray-600 hover:text-funac-navy hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 pb-1 space-y-2">
                <Link to="/donaciones" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">Donar Ahora</Button>
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-funac-navy hover:bg-gray-50 transition-colors"
                >
                  <UserCog size={16} />
                  Panel Administrador
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
