import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Megaphone, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import newsModalService from '../services/newsModalService'

const NewsModal = () => {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState(null)

  useEffect(() => {
    newsModalService
      .getConfig()
      .then((data) => {
        const modalData = data?.data ?? data
        if (modalData && modalData.activo !== false) {
          setConfig(modalData)
          const t = setTimeout(() => setOpen(true), 1200)
          return () => clearTimeout(t)
        }
      })
      .catch(() => {})
  }, [])

  const close = () => {
    setOpen(false)
  }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') close()
    }
    if (open) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open])

  if (!config) return null

  const isExternal =
    config.url_destino &&
    (config.url_destino.startsWith('http://') || config.url_destino.startsWith('https://'))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-modal-title"
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-elegant border border-border"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            {/* Decorative header */}
            <div className="relative h-40 bg-gradient-primary overflow-hidden">
              <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-secondary/40 blur-2xl animate-blob-float" />
              <div
                className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-accent/40 blur-2xl animate-blob-float"
                style={{ animationDelay: '3s' }}
              />
              <div className="absolute inset-0 bg-dots opacity-20" />

              <button
                onClick={close}
                aria-label="Cerrar"
                className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-card transition-all hover:bg-background hover:scale-110"
              >
                <X size={18} />
              </button>

              <div className="relative z-[1] flex h-full items-end p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                  <Megaphone size={12} />
                  {config.badge_texto || 'Noticia destacada'}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <h2
                id="news-modal-title"
                className="font-display text-3xl leading-tight text-foreground"
              >
                {config.titulo || 'Novedad importante'}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {config.subtitulo || ''}
              </p>

              {config.highlight_texto && (
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
                  <Sparkles size={14} className="text-funac-yellow flex-shrink-0" />
                  <span>{config.highlight_texto}</span>
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={close}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Más tarde
                </button>

                {isExternal ? (
                  <a
                    href={config.url_destino}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="btn-primary group"
                  >
                    {config.etiqueta_boton || 'Ver más'}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                ) : (
                  <Link
                    to={config.url_destino || '/donaciones'}
                    onClick={close}
                    className="btn-primary group"
                  >
                    {config.etiqueta_boton || 'Quiero ayudar'}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NewsModal
