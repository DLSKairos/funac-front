import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, RefreshCw } from 'lucide-react'
import Button from '../components/ui/Button'

export default function DonacionError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-red-50 to-orange-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} className="text-funac-red" />
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-4">La donacion no se proceso</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Hubo un problema al procesar tu pago. No se realizo ningun cargo. Por favor intenta nuevamente o contactanos si el problema persiste.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/donaciones">
            <Button variant="primary" icon={RefreshCw}>Intentar de nuevo</Button>
          </Link>
          <Link to="/contacto">
            <Button variant="outline">Contactar soporte</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
