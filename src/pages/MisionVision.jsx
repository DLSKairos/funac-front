import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Eye } from 'lucide-react'
import adminService from '../services/adminService'
import Alert from '../components/ui/Alert'

function PageSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-2xl" />
      <div className="h-64 bg-gray-200 rounded-2xl" />
    </div>
  )
}

const DEFAULT_MISION = 'Promover el desarrollo integral de las comunidades mas vulnerables mediante programas de educacion, salud, vivienda y fortalecimiento social, con la participacion activa de voluntarios comprometidos con el cambio social.'
const DEFAULT_VISION = 'Ser la fundacion de mayor impacto social en Colombia, reconocida por transformar vidas y comunidades a traves de la solidaridad, la innovacion y el trabajo colectivo hacia un futuro mas justo e igualitario.'

export default function MisionVision() {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getPageContent('mision-vision')
      .then((data) => setPage(data))
      .catch(() => setError('No se pudo cargar el contenido. Intenta nuevamente.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-funac-green to-emerald-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            Mision y Vision
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-emerald-100 text-lg"
          >
            Hacia donde vamos y por que lo hacemos
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading && <PageSkeleton />}
        {error && <Alert type="error" title="Error" message={error} />}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-funac-navy to-blue-800 rounded-2xl p-8 text-white"
            >
              <div className="inline-flex p-3 bg-white/20 rounded-xl mb-6">
                <Target size={28} />
              </div>
              <h2 className="text-2xl font-black mb-4">Nuestra Mision</h2>
              <p className="text-blue-100 leading-relaxed">
                {page?.mision || DEFAULT_MISION}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-gradient-to-br from-funac-orange to-orange-600 rounded-2xl p-8 text-white"
            >
              <div className="inline-flex p-3 bg-white/20 rounded-xl mb-6">
                <Eye size={28} />
              </div>
              <h2 className="text-2xl font-black mb-4">Nuestra Vision</h2>
              <p className="text-orange-100 leading-relaxed">
                {page?.vision || DEFAULT_VISION}
              </p>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  )
}
