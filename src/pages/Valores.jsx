import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, Shield, Lightbulb, Users, Leaf } from 'lucide-react'
import adminService from '../services/adminService'
import Alert from '../components/ui/Alert'

const defaultValores = [
  { icon: Heart, title: 'Solidaridad', description: 'Actuamos con empatia y compromiso hacia quienes mas lo necesitan.', color: 'bg-red-100 text-red-600' },
  { icon: Shield, title: 'Integridad', description: 'Somos transparentes, honestos y responsables en todas nuestras acciones.', color: 'bg-blue-100 text-blue-600' },
  { icon: Lightbulb, title: 'Innovacion', description: 'Buscamos soluciones creativas para los desafios de nuestra comunidad.', color: 'bg-yellow-100 text-yellow-600' },
  { icon: Users, title: 'Participacion', description: 'Fomentamos la inclusion y la participacion activa de todos.', color: 'bg-green-100 text-green-600' },
  { icon: Star, title: 'Excelencia', description: 'Nos esforzamos por la calidad en cada proyecto y accion que emprendemos.', color: 'bg-purple-100 text-purple-600' },
  { icon: Leaf, title: 'Sostenibilidad', description: 'Desarrollamos proyectos que tienen impacto duradero y positivo.', color: 'bg-emerald-100 text-emerald-600' },
]

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  )
}

export default function Valores() {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getPageContent('valores')
      .then((data) => setPage(data))
      .catch(() => setError(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-funac-orange to-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            Nuestros Valores
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-orange-100 text-lg"
          >
            Los principios que guian cada una de nuestras acciones
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading && <PageSkeleton />}
        {error && <Alert type="error" message={error} />}

        {/* Dynamic content from API */}
        {page?.secciones?.length > 0 && (
          <div className="mb-12">
            {page.secciones.map((seccion, i) => (
              <div key={i} className="mb-8">
                {seccion.titulo && (
                  <h2 className="text-2xl font-bold text-funac-navy mb-3">{seccion.titulo}</h2>
                )}
                {seccion.contenido && (
                  <div
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: seccion.contenido }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Default valores grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultValores.map((valor, i) => (
            <motion.div
              key={valor.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-xl ${valor.color} mb-4`}>
                <valor.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{valor.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{valor.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
