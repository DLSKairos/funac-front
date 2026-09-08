import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  Sparkles,
  ArrowRight,
  Heart,
  Users,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/formatters'
import ImageCarousel from '../components/home/ImageCarousel'
import NewsModal from '../components/NewsModal'
import Modal from '../components/ui/Modal'
import homeService from '../services/homeService'
import { useSectionImages } from '../hooks/useSectionImages'
import homeHero from '@/assets/home-hero.jpg'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Home() {
  const [pdfs, setPdfs] = useState([])
  const [preview, setPreview] = useState(null)
  const sectionImages = useSectionImages()

  useEffect(() => {
    homeService
      .getPDFs()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPdfs(data)
        }
      })
      .catch(() => {})
  }, [])

  const licitaciones = pdfs.map((p) => ({
    id: p.id,
    title: p.titulo || p.nombre_archivo || 'Documento',
    desc: p.descripcion || '',
    date: p.subido_en || '',
  }))

  return (
    <>
      <NewsModal />

      {/* HERO with image background */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0">
          <img src={sectionImages.get('inicio', 'hero') || homeHero} alt="Niño beneficiario" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        {/* Animated blobs */}
        <div className="blob top-20 left-10 h-96 w-96 bg-secondary/40 animate-blob-float" />
        <div
          className="blob bottom-10 right-10 h-80 w-80 bg-accent/40 animate-blob-float"
          style={{ animationDelay: '4s' }}
        />

        <div className="relative z-10 container mx-auto max-w-6xl px-6 py-20">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2 text-xs font-medium uppercase tracking-widest text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={14} className="text-funac-yellow" />
            Fundación Ayudando a Construir
          </motion.div>

          <motion.h1
            className="mt-6 max-w-3xl text-5xl font-medium leading-[1.05] text-white drop-shadow-lg md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Construyendo{' '}
            <span className="italic text-funac-yellow">esperanza</span>, transformando
            vidas.
          </motion.h1>

        

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link to="/donaciones" className="btn-secondary group">
              <Heart size={18} className="transition-transform group-hover:scale-110" />
              Realizar una donación
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/voluntarios"
              className="btn-ghost glass text-white border-white/30 hover:border-white/60"
            >
              Ser voluntario
            </Link>
          </motion.div>
        </div>

        <div className="scroll-indicator hidden md:block" />
      </section>

      {/* Carousel */}
      <section className="relative py-12 surface-alt overflow-hidden">
        <div className="container mx-auto max-w-6xl px-6 mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Nuestro trabajo en el terreno
          </p>
        </div>
        <ImageCarousel />
      </section>

      {/* Misión y Visión */}
      <section className="section-padding bg-gradient-mesh relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              className="card-gradient-green rounded-2xl border border-border p-10 card-lift"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-primary mb-6">
                <ShieldCheck size={22} />
              </div>
              <p className="text-xs uppercase tracking-widest text-primary">Misión</p>
              <h2 className="mt-2 text-4xl font-medium tracking-tight text-foreground">
                Construir oportunidades reales.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Promover el desarrollo integral de comunidades vulnerables a través de programas
                de educación, salud y vivienda, garantizando la transparencia en cada proceso y
                el uso eficiente de los recursos recibidos.
              </p>
            </motion.div>

            <motion.div
              className="card-gradient-orange rounded-2xl border border-border p-10 card-lift md:mt-16"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-secondary text-secondary-foreground shadow-glow-secondary mb-6">
                <Sparkles size={22} />
              </div>
              <p className="text-xs uppercase tracking-widest text-secondary">Visión</p>
              <h2 className="mt-2 text-4xl font-medium tracking-tight text-foreground">
                Referente nacional al 2030.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Ser referente nacional en gestión social transparente para el año 2030, impactando
                positivamente a más de 50,000 familias y consolidando un modelo replicable de
                intervención comunitaria.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impacto — bold dark stats */}
      <section className="relative section-padding overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 bg-dots opacity-10" />
        <div className="blob top-0 left-1/4 h-96 w-96 bg-primary/40 animate-blob-float" />
        <div
          className="blob bottom-0 right-1/4 h-80 w-80 bg-secondary/30 animate-blob-float"
          style={{ animationDelay: '5s' }}
        />

        <div className="relative container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-background/60">
              Resultados verificables
            </p>
            <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
              Nuestro impacto en números
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: '1,240', label: 'Vidas impactadas este mes', color: 'text-funac-yellow' },
              { value: '350+', label: 'Voluntarios activos', color: 'text-accent-glow' },
              { value: '$120M', label: 'Fondos recaudados', color: 'text-secondary-glow' },
              { value: '28', label: 'Comunidades beneficiadas', color: 'text-primary-glow' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-dark rounded-2xl p-6 text-center card-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className={`font-mono-nums text-4xl font-semibold md:text-5xl ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="mt-3 text-xs uppercase tracking-wider text-background/70">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Licitaciones */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Transparencia</p>
              <h2 className="mt-2 text-4xl font-medium tracking-tight text-foreground">
                Licitaciones y documentos
              </h2>
            </div>
            <Users size={28} className="text-muted-foreground" />
          </div>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            Documentos públicos disponibles para consulta y descarga.
          </p>
          {licitaciones.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              No existen licitaciones o documentos disponibles por el momento.
            </p>
          ) : (
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {licitaciones.map((doc, i) => (
              <motion.div
                key={doc.id || doc.title}
                className={`group relative flex items-start gap-4 rounded-2xl border border-border p-6 card-lift overflow-hidden ${['card-gradient-orange','card-gradient-green','card-gradient-lime'][i%3]}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-secondary/10 blur-2xl group-hover:bg-secondary/30 transition-colors" />
                <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-secondary text-white shadow-glow-secondary">
                  <FileText size={20} />
                </div>
                <button
                  type="button"
                  disabled={!doc.id}
                  onClick={() => setPreview(doc)}
                  className="relative flex-1 text-left disabled:cursor-default"
                >
                  <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{doc.desc}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground/70">
                    {doc.id ? formatDate(doc.date) : doc.date}
                  </p>
                </button>
                {doc.id ? (
                  <a
                    href={`${API_BASE}/home/pdfs/${doc.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Descargar ${doc.title}`}
                    className="relative flex-shrink-0 rounded-xl p-3 text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Download size={18} />
                  </a>
                ) : (
                  <button
                    disabled
                    aria-label="Sin enlace de descarga"
                    className="relative flex-shrink-0 rounded-xl p-3 text-muted-foreground/40"
                  >
                    <Download size={18} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title}
        size="xl"
      >
        {preview && (
          <iframe
            src={`${API_BASE}/home/pdfs/${preview.id}/view`}
            title={preview.title || 'Vista previa del documento'}
            className="w-full h-[75vh]"
          />
        )}
      </Modal>
    </>
  )
}
