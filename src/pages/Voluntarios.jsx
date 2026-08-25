import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import {
  Upload,
  FileCheck,
  ArrowRight,
  User,
  CreditCard,
  Phone,
  Mail,
  Check,
} from 'lucide-react'
import volunteerService from '../services/volunteerService'
import volunteersHero from '@/assets/volunteers-hero.jpg'

const schema = yup.object({
  nombre_completo: yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  cedula: yup.string().required('La cédula es requerida'),
  email: yup.string().required('El email es requerido').email('Email inválido'),
  telefono: yup.string().required('El teléfono es requerido'),
})

const fields = [
  { name: 'nombre_completo', label: 'Nombre completo', icon: User, type: 'text', placeholder: 'Juan Pérez' },
  { name: 'cedula', label: 'Cédula', icon: CreditCard, type: 'text', placeholder: '1.000.000.000' },
  { name: 'email', label: 'Correo electrónico', icon: Mail, type: 'email', placeholder: 'correo@ejemplo.com' },
  { name: 'telefono', label: 'Contacto', icon: Phone, type: 'tel', placeholder: '+57 300 000 0000' },
]

export default function Voluntarios() {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) })

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) {
      setFile(f)
    } else {
      toast.error('Solo se aceptan archivos PDF')
    }
  }, [])

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
      setFile(f)
    } else {
      toast.error('Solo se aceptan archivos PDF')
    }
  }

  const onSubmit = async (data) => {
    if (!file) {
      toast.error('Por favor adjunte su hoja de vida en PDF')
      return
    }
    try {
      const result = await volunteerService.register({
        ...data,
        areas_interes: [],
      })
      const volunteerId = result?.id || result?.voluntario?.id
      if (file && volunteerId) {
        try {
          await volunteerService.uploadCV(volunteerId, file)
        } catch (cvErr) {
          // El registro principal sí fue exitoso, pero la hoja de vida no se pudo subir.
          // Se lo informamos honestamente al usuario en vez de mostrar éxito total.
          const cvMsg =
            cvErr?.response?.data?.message ||
            'Tu postulación se guardó, pero no pudimos subir tu hoja de vida. Intenta subirla de nuevo o escríbenos.'
          toast.error(cvMsg, { duration: 6000 })
          reset()
          setFile(null)
          return
        }
      }
      setSuccess(true)
      reset()
      setFile(null)
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Error al registrar la postulación. Intente nuevamente.'
      toast.error(msg)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-accent text-white shadow-glow-accent mx-auto mb-6">
            <Check size={36} />
          </div>
          <h2 className="font-display text-4xl text-foreground mb-4">¡Registro exitoso!</h2>
          <p className="text-muted-foreground mb-8">
            Gracias por querer ser parte de FUNAC. Revisaremos su solicitud y nos pondremos en
            contacto pronto.
          </p>
          <button onClick={() => setSuccess(false)} className="btn-primary">
            Volver al formulario
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Split hero */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[70vh]">
          <div className="lg:col-span-3 relative overflow-hidden">
            <img
              src={volunteersHero}
              alt="Voluntarios FUNAC"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 via-transparent to-secondary/30" />
          </div>
          <div className="lg:col-span-2 relative bg-gradient-secondary flex items-center px-6 py-16 lg:px-12 overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="blob bottom-0 right-0 h-72 w-72 bg-funac-yellow/40 animate-blob-float" />
            <div className="relative z-10 text-white">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-medium uppercase tracking-widest">
                Únase al cambio
              </p>
              <h1 className="mt-6 text-5xl font-medium tracking-tight md:text-6xl">
                Sea <span className="italic">voluntario</span>.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-white/90">
                Transforme vidas mientras transforma la suya. Postúlese hoy y forme parte de
                nuestro equipo de cambio social.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto max-w-2xl">
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6 gradient-border p-8 md:p-10 shadow-elevated"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-secondary">Postulación</p>
              <h2 className="mt-2 text-3xl font-medium text-foreground">Cuéntenos quién es</h2>
            </div>

            {fields.map((f) => (
              <div key={f.name}>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {f.label}
                </label>
                <div className="relative">
                  <f.icon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    {...register(f.name)}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border-2 border-border bg-card pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 transition-all"
                  />
                </div>
                {errors[f.name] && (
                  <p className="mt-1 text-xs text-destructive">{errors[f.name].message}</p>
                )}
              </div>
            ))}

            {/* Dropzone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Hoja de vida (PDF)
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('cv-upload')?.click()}
                className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all overflow-hidden ${
                  dragOver
                    ? 'border-secondary bg-secondary/10 scale-[1.01]'
                    : file
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-secondary/60 hover:bg-secondary/5'
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    file
                      ? 'bg-gradient-accent shadow-glow-accent'
                      : 'bg-gradient-secondary shadow-glow-secondary'
                  } text-white transition-transform group-hover:scale-110`}
                >
                  {file ? <FileCheck size={24} /> : <Upload size={22} />}
                </div>
                {file ? (
                  <>
                    <p className="mt-4 text-sm font-semibold text-foreground">{file.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Archivo cargado · clic para cambiar
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-sm font-medium text-foreground">
                      Arrastre su CV aquí
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      o haga clic para seleccionar · PDF
                    </p>
                  </>
                )}
              </div>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-secondary group w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar postulación'}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </motion.form>
        </div>
      </section>
    </>
  )
}
