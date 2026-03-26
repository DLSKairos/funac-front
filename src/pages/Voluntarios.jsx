import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Check, Upload, User, Briefcase, Heart, ChevronRight } from 'lucide-react'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import volunteerService from '../services/volunteerService'

const step1Schema = yup.object({
  nombre_completo: yup.string().required('Nombre requerido').min(3, 'Minimo 3 caracteres'),
  cedula: yup.string().required('Cedula requerida'),
  email: yup.string().required('Email requerido').email('Email invalido'),
  telefono: yup.string().required('Telefono requerido'),
  ciudad: yup.string().required('Ciudad requerida'),
  direccion: yup.string().optional(),
  fecha_nacimiento: yup.string().optional(),
})

const step2Schema = yup.object({
  nivel_estudios: yup.string().required('Nivel de estudios requerido'),
  profesion_ocupacion: yup.string().optional(),
  habilidades_especiales: yup.string().optional(),
  disponibilidad_horaria: yup.string().required('Disponibilidad requerida'),
  motivacion: yup.string().required('La motivacion es requerida').min(30, 'Cuéntanos mas (minimo 30 caracteres)'),
})

const areasOptions = [
  { value: 'construccion', label: 'Construccion' },
  { value: 'educacion', label: 'Educacion' },
  { value: 'salud', label: 'Salud' },
  { value: 'recaudacion', label: 'Recaudacion' },
  { value: 'capacitacion', label: 'Capacitacion' },
  { value: 'comunicaciones', label: 'Comunicaciones' },
  { value: 'juridico', label: 'Juridico' },
  { value: 'administrativo', label: 'Administrativo' },
]

const nivelEstudios = [
  { value: 'bachiller', label: 'Bachiller' },
  { value: 'tecnico', label: 'Tecnico' },
  { value: 'tecnologo', label: 'Tecnologo' },
  { value: 'profesional', label: 'Profesional' },
  { value: 'especializacion', label: 'Especializacion' },
  { value: 'maestria', label: 'Maestria' },
  { value: 'doctorado', label: 'Doctorado' },
]

const disponibilidad = [
  { value: 'fines_semana', label: 'Fines de semana' },
  { value: 'entre_semana', label: 'Entre semana' },
  { value: 'tiempo_completo', label: 'Tiempo completo' },
  { value: 'por_horas', label: 'Por horas' },
]

const steps = [
  { label: 'Datos Personales', icon: User },
  { label: 'Info Profesional', icon: Briefcase },
  { label: 'Areas de Interes', icon: Heart },
]

export default function Voluntarios() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [selectedAreas, setSelectedAreas] = useState([])
  const [cvFile, setCvFile] = useState(null)
  const [cvError, setCvError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const schemas = [step1Schema, step2Schema]
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: currentStep < 2 ? yupResolver(schemas[currentStep]) : undefined,
    defaultValues: formData,
  })

  const handleNext = handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep((s) => s + 1)
  })

  const handleBack = () => setCurrentStep((s) => s - 1)

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const handleCvChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      setCvError('Solo se permiten archivos PDF, DOC o DOCX')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError('El archivo no puede superar 5MB')
      return
    }
    setCvError('')
    setCvFile(file)
  }

  const handleFinalSubmit = async () => {
    if (selectedAreas.length === 0) {
      toast.error('Selecciona al menos un area de interes')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        areas_interes: selectedAreas,
      }
      const result = await volunteerService.register(payload)
      const volunteerId = result?.id || result?.voluntario?.id
      if (cvFile && volunteerId) {
        try {
          await volunteerService.uploadCV(volunteerId, cvFile)
        } catch {
          // CV upload failed but registration succeeded
        }
      }
      setSuccess(true)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al registrar. Intenta nuevamente.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-funac-green" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Registro exitoso!</h2>
          <p className="text-gray-600 mb-8">
            Gracias por querer ser parte de FUNAC. Revisaremos tu solicitud y nos pondremos en contacto contigo pronto.
          </p>
          <Button onClick={() => window.location.href = '/'}>Volver al inicio</Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-funac-green to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            Se Voluntario
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-emerald-100 text-lg"
          >
            Completa el formulario y sé parte del cambio social
          </motion.p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    i < currentStep
                      ? 'bg-funac-green text-white'
                      : i === currentStep
                      ? 'bg-funac-navy text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < currentStep ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-xs mt-1 font-medium hidden sm:block ${i === currentStep ? 'text-funac-navy' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-14px] sm:mt-[-20px] transition-colors ${i < currentStep ? 'bg-funac-green' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Datos Personales */}
              {currentStep === 0 && (
                <form onSubmit={handleNext} noValidate>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Datos Personales</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Nombre completo" error={errors.nombre_completo?.message} {...register('nombre_completo')} />
                      <Input label="Cedula de ciudadania" error={errors.cedula?.message} {...register('cedula')} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
                      <Input label="Telefono" type="tel" error={errors.telefono?.message} {...register('telefono')} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Ciudad" error={errors.ciudad?.message} {...register('ciudad')} />
                      <Input label="Fecha de nacimiento (opcional)" type="date" {...register('fecha_nacimiento')} />
                    </div>
                    <Input label="Direccion (opcional)" {...register('direccion')} />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button type="submit" icon={ChevronRight}>Siguiente</Button>
                  </div>
                </form>
              )}

              {/* Step 2: Info Profesional */}
              {currentStep === 1 && (
                <form onSubmit={handleNext} noValidate>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Informacion Profesional</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Select
                        label="Nivel de estudios"
                        options={nivelEstudios}
                        placeholder="Selecciona..."
                        error={errors.nivel_estudios?.message}
                        {...register('nivel_estudios')}
                      />
                      <Select
                        label="Disponibilidad horaria"
                        options={disponibilidad}
                        placeholder="Selecciona..."
                        error={errors.disponibilidad_horaria?.message}
                        {...register('disponibilidad_horaria')}
                      />
                    </div>
                    <Input label="Profesion u ocupacion (opcional)" {...register('profesion_ocupacion')} />
                    <Textarea
                      label="Habilidades especiales (opcional)"
                      rows={3}
                      placeholder="Cuéntanos tus habilidades relevantes..."
                      {...register('habilidades_especiales')}
                    />
                    <Textarea
                      label="Motivacion para ser voluntario"
                      rows={4}
                      placeholder="Por qué deseas ser voluntario de FUNAC?"
                      error={errors.motivacion?.message}
                      {...register('motivacion')}
                    />
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button type="button" variant="outline" onClick={handleBack}>Atras</Button>
                    <Button type="submit" icon={ChevronRight}>Siguiente</Button>
                  </div>
                </form>
              )}

              {/* Step 3: Areas + CV */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Areas de Interes y CV</h2>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Selecciona las areas en las que deseas colaborar <span className="text-funac-red">*</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {areasOptions.map((area) => (
                        <button
                          key={area.value}
                          type="button"
                          onClick={() => toggleArea(area.value)}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all text-center ${
                            selectedAreas.includes(area.value)
                              ? 'border-funac-navy bg-funac-navy text-white'
                              : 'border-gray-200 text-gray-600 hover:border-funac-navy'
                          }`}
                        >
                          {area.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Curriculum Vitae (opcional)</p>
                    <label
                      htmlFor="cv-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-funac-orange hover:bg-orange-50 transition-colors"
                    >
                      <Upload size={24} className="text-gray-400 mb-2" />
                      {cvFile ? (
                        <span className="text-sm text-funac-green font-medium">{cvFile.name}</span>
                      ) : (
                        <>
                          <span className="text-sm text-gray-600">Haz clic para subir tu CV</span>
                          <span className="text-xs text-gray-400 mt-1">PDF, DOC o DOCX — max 5MB</span>
                        </>
                      )}
                    </label>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleCvChange}
                    />
                    {cvError && <p className="mt-1 text-xs text-funac-red">{cvError}</p>}
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleBack}>Atras</Button>
                    <Button
                      type="button"
                      onClick={handleFinalSubmit}
                      loading={submitting}
                      icon={Check}
                    >
                      Registrarme
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
