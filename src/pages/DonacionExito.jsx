import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Heart } from 'lucide-react'
import Button from '../components/ui/Button'

export default function DonacionExito() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-funac-green" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2 }}
            className="absolute -top-1 -right-1 w-8 h-8 bg-funac-orange rounded-full flex items-center justify-center"
          >
            <Heart size={16} className="text-white fill-white" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-4">Gracias por tu donacion!</h1>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Tu generosidad hace posible que sigamos transformando vidas. Recibiras un comprobante en tu correo electronico.
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4 mb-8">
          <p className="text-sm text-gray-600">Tu donacion contribuye a:</p>
          <ul className="mt-2 space-y-1 text-sm text-funac-green font-medium">
            <li>Programas educativos</li>
            <li>Atencion a familias vulnerables</li>
            <li>Proyectos de construccion comunitaria</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary">Volver al inicio</Button>
          </Link>
          <Link to="/voluntarios">
            <Button variant="outline">Ser voluntario</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
