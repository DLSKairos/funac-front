import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import {
  Heart,
  CreditCard,
  Building2,
  Banknote,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import donationService from '../services/donationService'
import { formatCurrency } from '../utils/formatters'
import donationsHero from '@/assets/donations-hero.jpg'

const AMOUNTS = [50000, 100000, 200000, 500000]

const schema = yup.object({
  nombre_completo: yup.string().required('Nombre requerido').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().required('Email requerido').email('Email inválido'),
  telefono: yup.string().optional(),
  cedula: yup.string().required('Cédula requerida'),
})

export default function Donaciones() {
  const [selected, setSelected] = useState(100000)
  const [custom, setCustom] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [recurrente, setRecurrente] = useState(false)
  const [mostrarEnMuro, setMostrarEnMuro] = useState(true)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const montoFinal = useCustom ? Number(custom) : selected

  // Cargar script de ePayco
  useEffect(() => {
    if (document.getElementById('epayco-script')) return
    const script = document.createElement('script')
    script.id = 'epayco-script'
    script.src = 'https://checkout.epayco.co/checkout.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  const onSubmit = async (data) => {
    if (!montoFinal || montoFinal < 1000) {
      toast.error('El monto mínimo es de $1.000')
      return
    }
    if (!window.ePayco) {
      toast.error('El portal de pagos aún está cargando. Intente en un momento.')
      return
    }

    setLoading(true)
    try {
      const result = await donationService.initDonation({
        ...data,
        monto: montoFinal,
        es_recurrente: recurrente,
        aparecer_muro_donantes: mostrarEnMuro,
      })

      const referencia = result.data?.referencia_epayco
      if (!referencia) throw new Error('No se recibió referencia del servidor')

      const handler = window.ePayco.checkout.configure({
        key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
        test: import.meta.env.VITE_EPAYCO_TEST_MODE === 'true',
      })

      handler.open({
        name: 'FUNAC - Donación',
        description: 'Donación a FUNAC',
        invoice: referencia,
        currency: 'cop',
        amount: String(montoFinal),
        tax_base: '0',
        tax: '0',
        country: 'co',
        lang: 'es',
        external: 'false',
        response: `${window.location.origin}/donacion/exito`,
        confirmation: `${import.meta.env.VITE_API_URL}/donations/webhook`,
        name_billing: data.nombre_completo,
        email_billing: data.email,
        type_doc_billing: 'cc',
        number_doc_billing: data.cedula,
        mobilephone_billing: data.telefono || '',
        extra1: referencia,
      })
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Error al procesar la donación. Intente nuevamente.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* HERO split with image */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          <div className="relative bg-gradient-accent flex items-center px-6 py-20 lg:px-16 overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="blob top-10 -left-20 h-80 w-80 bg-funac-yellow/40 animate-blob-float" />
            <div className="relative z-10 max-w-xl text-white">
              <motion.p
                className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-medium uppercase tracking-widest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles size={14} />
                Su aporte cambia vidas
              </motion.p>
              <motion.h1
                className="mt-6 text-5xl font-medium tracking-tight md:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Done. <span className="italic">Transforme.</span>
              </motion.h1>
              <motion.p
                className="mt-6 text-lg text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Cada aporte se administra con total transparencia y se traduce en oportunidades
                reales para quienes más lo necesitan.
              </motion.p>
            </div>
          </div>

          <div className="relative overflow-hidden min-h-[40vh]">
            <img
              src={donationsHero}
              alt="Semilla en manos"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-accent/20" />
          </div>
        </div>
      </section>

      {/* Donation form */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto max-w-3xl">
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="relative gradient-border p-8 md:p-10 shadow-elevated space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Monto */}
            <div>
              <p className="text-xs uppercase tracking-widest text-accent">Paso 1</p>
              <h2 className="mt-2 text-3xl font-medium text-foreground">Seleccione un monto</h2>

              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setSelected(a)
                      setUseCustom(false)
                      setCustom('')
                    }}
                    className={`relative overflow-hidden rounded-xl border-2 px-4 py-4 text-sm font-semibold transition-all ${
                      !useCustom && selected === a
                        ? 'border-accent bg-gradient-accent text-white shadow-glow-accent scale-[1.03]'
                        : 'border-border bg-card text-foreground hover:border-accent/50 hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="font-mono-nums">{formatCurrency(a)}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <input
                  type="number"
                  min="1000"
                  placeholder="Otro monto (COP)"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value)
                    setUseCustom(true)
                  }}
                  className="w-full rounded-xl border-2 border-border bg-card px-5 py-4 font-mono-nums text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                />
              </div>

              {/* Recurrente */}
              <button
                type="button"
                onClick={() => setRecurrente(!recurrente)}
                className={`mt-4 flex items-center gap-3 w-full p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  recurrente
                    ? 'border-accent bg-accent text-white'
                    : 'border-border text-muted-foreground hover:border-accent/50'
                }`}
              >
                <RefreshCw size={16} />
                Donación recurrente mensual
                {recurrente && (
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    Activa
                  </span>
                )}
              </button>
            </div>

            {/* Datos personales */}
            <div>
              <p className="text-xs uppercase tracking-widest text-accent">Paso 2</p>
              <h2 className="mt-2 text-3xl font-medium text-foreground">Sus datos</h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Nombre completo
                  </label>
                  <input
                    {...register('nombre_completo')}
                    type="text"
                    placeholder="Juan Pérez"
                    className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                  />
                  {errors.nombre_completo && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.nombre_completo.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Cédula</label>
                  <input
                    {...register('cedula')}
                    type="text"
                    placeholder="1.000.000.000"
                    className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                  />
                  {errors.cedula && (
                    <p className="mt-1 text-xs text-destructive">{errors.cedula.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Correo electrónico
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Teléfono (opcional)
                  </label>
                  <input
                    {...register('telefono')}
                    type="tel"
                    placeholder="+57 300 000 0000"
                    className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                  />
                </div>
              </div>

              <label className="mt-4 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarEnMuro}
                  onChange={(e) => setMostrarEnMuro(e.target.checked)}
                  className="w-4 h-4 rounded accent-accent"
                />
                <span className="text-sm text-muted-foreground">
                  Aparecer en el muro de donantes
                </span>
              </label>
            </div>

            {/* Resumen + CTA */}
            <div>
              <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-muted/60 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Total a donar
                  </p>
                  <p className="font-mono-nums text-2xl font-semibold text-accent">
                    {montoFinal ? formatCurrency(montoFinal) : '$ 0'}
                  </p>
                  {recurrente && (
                    <p className="text-xs text-muted-foreground mt-0.5">Se cobrará mensualmente</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-accent group w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Heart
                  size={20}
                  className="transition-transform group-hover:scale-110"
                />
                {loading ? 'Procesando...' : 'Donar ahora'}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Transacción 100% segura · Procesado por ePayco · Recibo deducible disponible
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Otros métodos */}
      <section className="section-padding bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-10" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-background/60">Más maneras</p>
            <h2 className="mt-2 text-4xl font-medium tracking-tight md:text-5xl">
              Otros métodos de donación
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: CreditCard,
                title: 'Transferencia Bancaria',
                desc: 'Banco Nacional\nCuenta: 1234-5678-90\nNIT: 900.123.456-7',
                color: 'primary',
              },
              {
                icon: Building2,
                title: 'Presencial',
                desc: 'Calle 72 #10-25, Of. 301\nBogotá D.C.\nLun–Vie 8am–5pm',
                color: 'secondary',
              },
              {
                icon: Banknote,
                title: 'Efectivo',
                desc: 'Puntos autorizados de\nrecaudo en las principales\nciudades del país',
                color: 'accent',
              },
            ].map((m, i) => (
              <motion.div
                key={m.title}
                className="glass-dark rounded-2xl p-8 card-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-${m.color} shadow-glow-${m.color}`}
                >
                  <m.icon size={22} className="text-white" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-background/70">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
