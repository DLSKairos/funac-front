import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import contactService from '../services/contactService'

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido').min(3, 'Minimo 3 caracteres'),
  email: yup.string().required('El email es requerido').email('Email invalido'),
  telefono: yup.string().optional(),
  asunto: yup.string().required('El asunto es requerido'),
  mensaje: yup.string().required('El mensaje es requerido').min(20, 'Minimo 20 caracteres'),
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
      toast.success('Mensaje enviado correctamente. Te responderemos pronto.')
      reset()
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo enviar el mensaje. Intenta nuevamente.'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-funac-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Contactanos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-blue-200 text-lg"
          >
            Estamos aqui para responder tus preguntas y recibir tus sugerencias
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informacion de contacto</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'info@funac.org' },
                  { icon: Phone, label: 'Telefono', value: '+57 300 000 0000' },
                  { icon: MapPin, label: 'Direccion', value: 'Colombia' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                      <item.icon size={16} className="text-funac-orange" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                      <p className="text-sm text-gray-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-funac-navy to-blue-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">Horario de atencion</h3>
              <p className="text-blue-200 text-sm">Lunes a Viernes</p>
              <p className="text-white font-semibold">8:00 AM - 5:00 PM</p>
              <p className="text-blue-200 text-sm mt-2">Sabados</p>
              <p className="text-white font-semibold">9:00 AM - 1:00 PM</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Enviar mensaje</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Nombre completo"
                    error={errors.nombre?.message}
                    {...register('nombre')}
                  />
                  <Input
                    label="Email"
                    type="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Telefono (opcional)"
                    type="tel"
                    error={errors.telefono?.message}
                    {...register('telefono')}
                  />
                  <Input
                    label="Asunto"
                    error={errors.asunto?.message}
                    {...register('asunto')}
                  />
                </div>
                <Textarea
                  label="Mensaje"
                  rows={5}
                  error={errors.mensaje?.message}
                  {...register('mensaje')}
                />
                <Button
                  type="submit"
                  loading={isSubmitting}
                  icon={Send}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Enviar mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
