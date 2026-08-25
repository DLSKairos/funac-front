import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Heart } from 'lucide-react'
import Button from '../components/ui/Button'

export default function DonacionExito() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-hero px-4 py-20">
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="blob top-10 left-10 h-80 w-80 bg-accent/30 animate-blob-float" />
      <div
        className="blob bottom-10 right-10 h-72 w-72 bg-secondary/30 animate-blob-float"
        style={{ animationDelay: '4s' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md gradient-border p-8 text-center shadow-elevated md:p-10"
      >
        <div className="relative inline-block mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-accent shadow-glow-accent">
            <CheckCircle size={48} className="text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2 }}
            className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-secondary shadow-glow-secondary"
          >
            <Heart size={16} className="fill-white text-white" />
          </motion.div>
        </div>

        <p className="text-xs uppercase tracking-widest text-accent">Donación confirmada</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-foreground">
          ¡Gracias por tu donación!
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Tu generosidad hace posible que sigamos transformando vidas. Recibirás un comprobante en
          tu correo electrónico.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-left">
          <p className="text-sm text-muted-foreground">Tu donación contribuye a:</p>
          <ul className="mt-3 space-y-2 text-sm font-medium text-accent">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Programas educativos
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Atención a familias vulnerables
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Proyectos de construcción comunitaria
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/">
            <Button variant="primary">Volver al inicio</Button>
          </Link>
          <Link to="/voluntarios">
            <Button variant="outline">Ser voluntario</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
