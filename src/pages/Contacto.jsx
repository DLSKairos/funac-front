import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Music2, Send } from 'lucide-react'
import PageHero from '../components/PageHero'
import contactService from '../services/contactService'
import contactHero from '@/assets/contact-hero.jpg'

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().required('El email es requerido').email('Email inválido'),
  telefono: yup.string().optional(),
  asunto: yup.string().required('El asunto es requerido'),
  mensaje: yup
    .string()
    .required('El mensaje es requerido')
    .min(20, 'Mínimo 20 caracteres'),
})

export default function Contacto() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await contactService.sendMessage(data)
      toast.success('Mensaje enviado correctamente. Le responderemos pronto.')
      reset()
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'No se pudo enviar el mensaje. Intente nuevamente.'
      toast.error(msg)
    }
  }

  return (
    <>
      <PageHero
        image={contactHero}
        eyebrow="Hablemos"
        title={
          <>
            Estamos para <span className="italic text-funac-yellow">servirle</span>.
          </>
        }
        subtitle="Comuníquese con nosotros por cualquiera de nuestros canales. Le respondemos en menos de 24 horas."
        accent="secondary"
      />

      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto max-w-6xl">
          {/* Contact cards */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                icon: Phone,
                title: 'Teléfonos',
                lines: ['+57 (1) 234 5678', '+57 300 123 4567', '+57 310 987 6543'],
                color: 'primary',
              },
              {
                icon: Mail,
                title: 'Correos',
                lines: ['contacto@funac.org', 'donaciones@funac.org', 'voluntariado@funac.org'],
                color: 'secondary',
              },
              {
                icon: MapPin,
                title: 'Dirección',
                lines: ['Calle 72 #10-25, Of. 301', 'Bogotá D.C., Colombia'],
                color: 'accent',
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 card-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div
                  className={`absolute -top-10 -right-10 h-40 w-40 rounded-full bg-${c.color}/10 blur-2xl group-hover:bg-${c.color}/30 transition-colors`}
                />
                <div
                  className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-${c.color} text-white shadow-glow-${c.color}`}
                >
                  <c.icon size={20} />
                </div>
                <h3 className="relative mt-5 text-lg font-semibold text-foreground">{c.title}</h3>
                <div className="relative mt-3 space-y-1">
                  {c.lines.map((l) => (
                    <p key={l} className="text-sm text-muted-foreground">
                      {l}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map + Socials */}
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <motion.div
              className="lg:col-span-2 overflow-hidden rounded-2xl border border-border shadow-elevated"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.852835925809!2d-74.0530!3d4.6486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzgnNTUuMCJOIDc0wrAwMycxMS4wIlc!5e0!3m2!1ses!2sco!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación FUNAC"
              />
            </motion.div>

            <motion.div
              className="rounded-2xl bg-foreground p-8 text-background relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="blob top-0 right-0 h-48 w-48 bg-secondary/40 animate-blob-float" />
              <div className="relative">
                <p className="text-xs uppercase tracking-widest text-background/60">Síganos</p>
                <h3 className="mt-2 text-2xl font-medium">Redes sociales</h3>
                <div className="mt-6 flex flex-col gap-3">
                  {[
                    { Icon: Instagram, label: '@funac_fundacion', href: 'https://instagram.com' },
                    { Icon: Music2, label: '@funac_oficial', href: 'https://tiktok.com' },
                    { Icon: Twitter, label: '@FunacOrg', href: 'https://twitter.com' },
                    { Icon: Facebook, label: 'Fundación FUNAC', href: 'https://facebook.com' },
                  ].map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl glass-dark p-3 transition-all hover:bg-funac-yellow hover:text-foreground hover:translate-x-1"
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.div
            className="mt-12 gradient-border p-8 md:p-12 shadow-elevated"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-widest text-secondary">Formulario</p>
            <h2 className="mt-2 text-3xl font-medium text-foreground">Envíenos un mensaje</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete el formulario y le responderemos a la brevedad.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Nombre completo
                </label>
                <input
                  {...register('nombre')}
                  type="text"
                  placeholder="Juan Pérez"
                  className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 transition-all"
                />
                {errors.nombre && (
                  <p className="mt-1 text-xs text-destructive">{errors.nombre.message}</p>
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
                  className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 transition-all"
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
                  className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Asunto</label>
                <input
                  {...register('asunto')}
                  type="text"
                  placeholder="¿En qué le podemos ayudar?"
                  className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 transition-all"
                />
                {errors.asunto && (
                  <p className="mt-1 text-xs text-destructive">{errors.asunto.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-foreground">Mensaje</label>
                <textarea
                  {...register('mensaje')}
                  rows={5}
                  placeholder="Escriba su mensaje aquí..."
                  className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 transition-all resize-none"
                />
                {errors.mensaje && (
                  <p className="mt-1 text-xs text-destructive">{errors.mensaje.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-secondary group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send size={16} className="transition-transform group-hover:-translate-y-0.5" />
                  {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}
