import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Heart, RefreshCw, ExternalLink } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import donationService from '../services/donationService'
import { formatCurrency } from '../utils/formatters'

const MONTOS = [10000, 20000, 50000, 100000]

const schema = yup.object({
  nombre_completo: yup.string().required('Nombre requerido').min(3),
  email: yup.string().required('Email requerido').email('Email invalido'),
  telefono: yup.string().optional(),
  cedula: yup.string().required('Cedula requerida'),
})

export default function Donaciones() {
  const [monto, setMonto] = useState(20000)
  const [montoCustom, setMontoCustom] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [recurrente, setRecurrente] = useState(false)
  const [mostrarEnMuro, setMostrarEnMuro] = useState(true)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const montoFinal = useCustom ? Number(montoCustom) : monto

  const onSubmit = async (data) => {
    if (!montoFinal || montoFinal < 1000) {
      toast.error('El monto minimo es de $1.000')
      return
    }
    setLoading(true)
    try {
      const result = await donationService.initDonation({
        ...data,
        monto: montoFinal,
        recurrente,
        mostrar_en_muro: mostrarEnMuro,
      })
      if (result?.checkout_url) {
        window.location.href = result.checkout_url
      } else {
        toast('Integracion de pagos en configuracion. Tu donacion sera procesada pronto.', {
          icon: 'ℹ️',
          duration: 6000,
        })
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al procesar la donacion. Intenta nuevamente.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-funac-orange to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            Haz una Donacion
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-orange-100 text-lg"
          >
            Tu aporte transforma vidas. Cada peso cuenta.
          </motion.p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Monto */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Selecciona el monto</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {MONTOS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMonto(m); setUseCustom(false); setMontoCustom('') }}
                  className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                    !useCustom && monto === m
                      ? 'border-funac-orange bg-funac-orange text-white'
                      : 'border-gray-200 text-gray-700 hover:border-funac-orange'
                  }`}
                >
                  {formatCurrency(m)}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Otro valor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">$</span>
                <input
                  type="number"
                  min="1000"
                  placeholder="Ingresa el monto"
                  value={montoCustom}
                  onChange={(e) => {
                    setMontoCustom(e.target.value)
                    setUseCustom(true)
                  }}
                  className={`w-full pl-8 pr-4 py-2.5 rounded-xl border-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-funac-orange ${
                    useCustom ? 'border-funac-orange' : 'border-gray-200'
                  }`}
                />
              </div>
            </div>

            {/* Recurrente toggle */}
            <button
              type="button"
              onClick={() => setRecurrente(!recurrente)}
              className={`mt-4 flex items-center gap-3 w-full p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                recurrente ? 'border-funac-navy bg-funac-navy text-white' : 'border-gray-200 text-gray-600'
              }`}
            >
              <RefreshCw size={16} />
              Donacion recurrente mensual
              {recurrente && <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Activa</span>}
            </button>
          </div>

          {/* Datos personales */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tus datos</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre completo"
                  error={errors.nombre_completo?.message}
                  {...register('nombre_completo')}
                />
                <Input
                  label="Cedula"
                  error={errors.cedula?.message}
                  {...register('cedula')}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Telefono (opcional)"
                  type="tel"
                  {...register('telefono')}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarEnMuro}
                  onChange={(e) => setMostrarEnMuro(e.target.checked)}
                  className="w-4 h-4 text-funac-orange rounded focus:ring-funac-orange"
                />
                <span className="text-sm text-gray-600">Aparecer en el muro de donantes</span>
              </label>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-orange-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total a donar</p>
              <p className="text-2xl font-black text-funac-orange">
                {montoFinal ? formatCurrency(montoFinal) : '$ 0'}
              </p>
              {recurrente && <p className="text-xs text-gray-500">Se cobrara mensualmente</p>}
            </div>
            <Heart size={32} className="text-funac-orange fill-funac-orange opacity-30" />
          </div>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            icon={ExternalLink}
            className="w-full"
          >
            Donar Ahora
          </Button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Pago seguro procesado por ePayco. Tu informacion esta protegida.
          </p>
        </form>
      </section>
    </div>
  )
}
