import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, RefreshCw } from 'lucide-react'
import Button from '../components/ui/Button'

export default function DonacionError() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-hero px-4 py-20">
      <div className="absolute inset-0 bg-dots opacity-10" />
      <div className="blob top-10 left-10 h-80 w-80 bg-destructive/20 animate-blob-float" />
      <div
        className="blob bottom-10 right-10 h-72 w-72 bg-secondary/20 animate-blob-float"
        style={{ animationDelay: '4s' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md gradient-border p-8 text-center shadow-elevated md:p-10"
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <XCircle size={48} className="text-destructive" />
        </div>

        <p className="text-xs uppercase tracking-widest text-destructive">Pago no completado</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-foreground">
          La donación no se procesó
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Hubo un problema al procesar tu pago. No se realizó ningún cargo. Por favor intenta
          nuevamente o contáctanos si el problema persiste.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/donaciones">
            <Button variant="primary" icon={RefreshCw}>
              Intentar de nuevo
            </Button>
          </Link>
          <Link to="/contacto">
            <Button variant="outline">Contactar soporte</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
