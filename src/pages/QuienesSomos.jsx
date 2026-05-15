import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, HeartHandshake, Target, Quote, Users, CheckCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import adminService from '../services/adminService'
import aboutHero from '@/assets/about-hero.jpg'
import testimonial1 from '@/assets/testimonial-1.jpg'
import testimonial2 from '@/assets/testimonial-2.jpg'
import testimonial3 from '@/assets/testimonial-3.jpg'

const testimonials = [
  {
    name: 'María González',
    role: 'Beneficiaria',
    image: testimonial1,
    quote:
      'Gracias a FUNAC, mis tres hijos pudieron acceder a educación de calidad. La transparencia con la que manejan cada peso nos da confianza absoluta.',
  },
  {
    name: 'Carlos Ramírez',
    role: 'Voluntario desde 2023',
    image: testimonial2,
    quote:
      'Ser voluntario aquí me cambió la perspectiva. Es una organización seria, donde cada acción tiene un propósito claro y medible.',
  },
  {
    name: 'Roberto Méndez',
    role: 'Donante recurrente',
    image: testimonial3,
    quote:
      'Llevo dos años donando porque puedo verificar exactamente cómo se usan mis aportes. Eso no lo encuentras en cualquier fundación.',
  },
]

const staticValues = [
  {
    icon: ShieldCheck,
    title: 'Transparencia',
    desc: 'Cada peso recaudado es trazable. Publicamos informes trimestrales y abrimos nuestras puertas a auditorías externas.',
    color: 'primary',
  },
  {
    icon: HeartHandshake,
    title: 'Compromiso',
    desc: 'Vamos más allá de la obligación. Cada miembro del equipo vive la misión como un propósito personal.',
    color: 'secondary',
  },
  {
    icon: Target,
    title: 'Impacto Medible',
    desc: 'No hablamos de intenciones, mostramos resultados. Cada programa tiene indicadores claros de éxito.',
    color: 'accent',
  },
]

export default function QuienesSomos() {
  const [page, setPage] = useState(null)

  useEffect(() => {
    adminService.getPageContent('quienes-somos').then(setPage).catch(() => {})
  }, [])

  const objetivos = page?.secciones
    ?.filter(
      (s) => s.seccion.startsWith('objetivo_') && s.seccion !== 'objetivo_social' && s.contenido
    )
    ?.sort((a, b) => a.orden - b.orden)
    ?.map((s) => s.contenido) || []

  return (
    <>
      <PageHero
        image={aboutHero}
        eyebrow="Quiénes somos"
        title={
          <>
            Una historia construida por{' '}
            <span className="italic text-funac-yellow">manos solidarias</span>.
          </>
        }
        subtitle="Desde 2018 trabajamos por comunidades que merecen un mejor futuro. Lo hacemos con transparencia total y resultados medibles."
        accent="primary"
      />

      {/* Quiénes somos / Objetivo social del backend */}
      {(page?.quienes_somos || page?.objetivo_social) && (
        <section className="section-padding bg-gradient-hero">
          <div className="container mx-auto max-w-5xl">
            <div className="grid gap-16 md:grid-cols-2">
              {page?.quienes_somos && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-glow-primary mb-6">
                    <Users size={22} />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-primary">Quiénes Somos</p>
                  <h2 className="mt-2 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                    Nuestra identidad
                  </h2>
                  <div className="mt-4 h-1 w-16 rounded-full bg-gradient-primary" />
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    {page.quienes_somos}
                  </p>
                </motion.div>
              )}
              {page?.objetivo_social && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-secondary text-white shadow-glow-secondary mb-6">
                    <Target size={22} />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-secondary">Objetivo Social</p>
                  <h2 className="mt-2 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                    Por qué existimos
                  </h2>
                  <div className="mt-4 h-1 w-16 rounded-full bg-gradient-secondary" />
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    {page.objetivo_social}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Misión + Visión */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2">
            {[
              {
                kind: 'Misión',
                title: 'Por qué existimos',
                text:
                  page?.mision ||
                  'Promover el desarrollo integral de comunidades vulnerables a través de programas de educación, salud y vivienda, garantizando la transparencia en cada proceso.',
              },
              {
                kind: 'Visión',
                title: 'Hacia dónde vamos',
                text:
                  page?.vision ||
                  'Ser referente nacional en gestión social transparente para 2030, impactando a más de 50,000 familias con un modelo replicable de intervención comunitaria.',
              },
            ].map((m, i) => (
              <motion.div
                key={m.kind}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              >
                <p className="text-xs uppercase tracking-widest text-primary">{m.kind}</p>
                <h2 className="mt-2 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                  {m.title}
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-gradient-primary" />
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Objetivos específicos */}
      {objetivos.length > 0 && (
        <section className="section-padding bg-gradient-hero">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-primary">Detalle</p>
              <h2 className="mt-2 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                Objetivos Específicos
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {objetivos.map((obj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card p-5 card-lift flex gap-3"
                >
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{obj}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Valores */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-secondary">Lo que nos define</p>
            <h2 className="mt-2 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
              Nuestros valores
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {staticValues.map((v, i) => (
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
                  <v.icon size={24} />
                </div>
                <h3 className="relative mt-6 text-2xl font-medium tracking-tight text-foreground">
                  {v.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="section-padding bg-foreground text-background relative overflow-hidden">
        <div className="blob top-10 left-10 h-80 w-80 bg-accent/20 animate-blob-float" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-background/60">Voces reales</p>
              <h2 className="mt-2 text-4xl font-medium tracking-tight md:text-5xl">Testimonios</h2>
            </div>
            <Quote size={48} className="text-funac-yellow opacity-60" />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass-dark rounded-2xl p-8 card-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Quote size={28} className="text-funac-yellow" />
                <p className="mt-4 font-display text-xl italic leading-relaxed text-background">
                  "{t.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-funac-yellow/40"
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-background/60">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
