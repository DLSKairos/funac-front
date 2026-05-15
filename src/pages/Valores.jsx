import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Shield, Lightbulb, Users, Star, Leaf,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import adminService from '../services/adminService'
import aboutHero from '@/assets/about-hero.jpg'

const ICON_MAP = {
  Heart, Shield, Lightbulb, Users, Star, Leaf,
}

const defaultValores = [
  {
    icon: 'Shield',
    title: 'Transparencia',
    desc: 'Cada peso recaudado es trazable. Publicamos informes trimestrales y abrimos nuestras puertas a auditorías externas.',
    color: 'primary',
  },
  {
    icon: 'Heart',
    title: 'Solidaridad',
    desc: 'Actuamos con empatía y compromiso hacia quienes más lo necesitan.',
    color: 'secondary',
  },
  {
    icon: 'Lightbulb',
    title: 'Innovación',
    desc: 'Buscamos soluciones creativas para los desafíos de nuestra comunidad.',
    color: 'accent',
  },
  {
    icon: 'Users',
    title: 'Participación',
    desc: 'Fomentamos la inclusión y la participación activa de todos los actores sociales.',
    color: 'primary',
  },
  {
    icon: 'Star',
    title: 'Excelencia',
    desc: 'Nos esforzamos por la calidad en cada proyecto y acción que emprendemos.',
    color: 'secondary',
  },
  {
    icon: 'Leaf',
    title: 'Sostenibilidad',
    desc: 'Desarrollamos proyectos que tienen impacto duradero y positivo en las comunidades.',
    color: 'accent',
  },
]

function DynamicIcon({ name, size }) {
  const Icon = (name && ICON_MAP[name]) ? ICON_MAP[name] : Star
  return <Icon size={size} />
}

export default function Valores() {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService
      .getPageContent('valores')
      .then((data) => setPage(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hasDbContent = page?.secciones?.length > 0

  const valoresItems = hasDbContent
    ? page.secciones.map((sec, i) => ({
        icon: sec.icono || null,
        title: sec.seccion,
        desc: sec.contenido,
        color: ['primary', 'secondary', 'accent'][i % 3],
        isHtml: true,
      }))
    : defaultValores.map((v) => ({ ...v, isHtml: false }))

  return (
    <>
      <PageHero
        image={aboutHero}
        eyebrow="Nuestros valores"
        title={
          <>
            Los principios que guían{' '}
            <span className="italic text-funac-yellow">cada acción</span>.
          </>
        }
        subtitle="Valores que no son solo palabras — son la brújula que orienta cada decisión, proyecto y relación que construimos."
        accent="secondary"
      />

      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {valoresItems.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 card-lift"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div
                    className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-${v.color}/10 blur-3xl transition-all group-hover:bg-${v.color}/30 group-hover:scale-125`}
                  />
                  <div
                    className={`relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-${v.color} text-white shadow-glow-${v.color}`}
                  >
                    <DynamicIcon name={v.icon} size={24} />
                  </div>
                  <h3 className="relative mt-6 text-2xl font-medium tracking-tight text-foreground">
                    {v.title}
                  </h3>
                  {v.isHtml ? (
                    <div
                      className="relative mt-3 text-sm leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: v.desc }}
                    />
                  ) : (
                    <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                      {v.desc}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
