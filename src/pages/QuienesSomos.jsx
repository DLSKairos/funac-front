import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import adminService from '../services/adminService'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-12 bg-gray-200 rounded-xl w-3/4 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
      <div className="h-48 bg-gray-200 rounded-2xl" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  )
}

export default function QuienesSomos() {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getPageContent('quienes-somos')
      .then((data) => setPage(data))
      .catch(() => setError('No se pudo cargar el contenido. Intenta nuevamente.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-20">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-funac-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            Quienes Somos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-blue-200 text-lg"
          >
            Conoce nuestra historia, equipo y compromiso con la comunidad
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading && <PageSkeleton />}
        {error && <Alert type="error" title="Error" message={error} />}
        {page && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            {page.secciones?.map((seccion, i) => (
              <div key={i} className="mb-12">
                {seccion.titulo && (
                  <h2 className="text-2xl font-bold text-funac-navy mb-4">{seccion.titulo}</h2>
                )}
                {seccion.contenido && (
                  <div
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: seccion.contenido }}
                  />
                )}
                {seccion.imagen_url && (
                  <img
                    src={seccion.imagen_url}
                    alt={seccion.titulo || 'Imagen'}
                    className="w-full rounded-2xl shadow-md mt-6 object-cover max-h-80"
                  />
                )}
              </div>
            ))}
            {!page.secciones && page.contenido && (
              <div
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: page.contenido }}
              />
            )}
            {!page.secciones && !page.contenido && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">Contenido en construccion. Vuelve pronto.</p>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  )
}
