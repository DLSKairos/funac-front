import { useState, useEffect } from 'react'
import { FileText, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import homeService from '../../services/homeService'
import Button from '../ui/Button'

function PDFSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-xl mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="h-9 bg-gray-200 rounded-lg" />
    </div>
  )
}

export default function PDFSection() {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    homeService.getPDFs()
      .then((data) => {
        const docs = Array.isArray(data) ? data : []
        setPdfs(docs)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && !pdfs.length) return null

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Licitaciones y Documentos de interés
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Estos son nuestros Documentos públicos disponibles para consulta y descarga.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <PDFSkeleton key={i} />)
            : pdfs.map((pdf, i) => (
                <motion.div
                  key={pdf.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex p-2.5 bg-orange-100 rounded-xl mb-4">
                    <FileText size={22} className="text-funac-orange" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{pdf.titulo || pdf.nombre}</h3>
                  {pdf.descripcion && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pdf.descripcion}</p>
                  )}
                  <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/home/pdfs/${pdf.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-funac-orange text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    <Download size={15} />
                    Descargar
                  </a>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  )
}
