import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import funacLogo from '@/assets/funac-logo.png'

const schema = yup.object({
  username: yup.string().required('Usuario requerido'),
  password: yup.string().required('Contrasena requerida').min(4, 'Minimo 4 caracteres'),
})

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = async ({ username, password }) => {
    try {
      await login(username, password)
      toast.success('Bienvenido al panel de administracion')
      navigate('/admin', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.error || 'Credenciales incorrectas'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground via-primary to-primary-glow flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-funac-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-funac-green/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={funacLogo} alt="FUNAC" className="h-20 w-auto object-contain mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Panel de Administracion</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Usuario"
              icon={User}
              autoComplete="username"
              error={errors.username?.message}
              {...register('username')}
            />
            <Input
              label="Contrasena"
              type="password"
              icon={Lock}
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Iniciar sesion
            </Button>
          </form>
        </div>

        <p className="text-center text-white/60 text-sm mt-6">
          FUNAC &copy; {new Date().getFullYear()} — Panel Administrativo
        </p>
      </motion.div>
    </div>
  )
}
