import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Shield, Star, Users, Target, Eye, Lightbulb, Leaf,
  CheckCircle, Award, Globe, Home, Book, Briefcase, Building,
  Camera, Clock, Cloud, Code, Coffee, Compass, Database,
  Flag, Gift, HeartHandshake, Headphones, Info, Key,
  Layers, Link, Lock, Mail, Map, MessageCircle, Music,
  Phone, PieChart, Rocket, Search, Settings, Share2, Smile,
  Sun, ThumbsUp, TreePine, TrendingUp, Trophy, Truck,
  Umbrella, Zap, ArrowRight, Bell, Calendar, Cpu, Download,
} from 'lucide-react'
import adminService from '../services/adminService'
import Alert from '../components/ui/Alert'

const ICON_MAP = {
  Heart, Shield, Star, Users, Target, Eye, Lightbulb, Leaf,
  CheckCircle, Award, Globe, Home, Book, Briefcase, Building,
  Camera, Clock, Cloud, Code, Coffee, Compass, Database,
  Flag, Gift, HeartHandshake, Headphones, Info, Key,
  Layers, Link, Lock, Mail, Map, MessageCircle, Music,
  Phone, PieChart, Rocket, Search, Settings, Share2, Smile,
  Sun, ThumbsUp, TreePine, TrendingUp, Trophy, Truck,
  Umbrella, Zap, ArrowRight, Bell, Calendar, Cpu, Download,
}

function DynamicIcon({ name, size, DefaultIcon }) {
  const Icon = (name && ICON_MAP[name]) ? ICON_MAP[name] : DefaultIcon
  return <Icon size={size} />
}

function PageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-52 bg-gray-200 rounded-2xl" />
      <div className="h-40 bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
      </div>
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

  const objetivos = page?.secciones
    ?.filter((s) => s.seccion.startsWith('objetivo_') && s.seccion !== 'objetivo_social' && s.contenido)
    ?.sort((a, b) => a.orden - b.orden)
    ?.map((s) => s.contenido)
    || []

  const quienesSomosIcono = page?.secciones?.find((s) => s.seccion === 'quienes_somos')?.icono || null
  const objetivoSocialIcono = page?.secciones?.find((s) => s.seccion === 'objetivo_social')?.icono || null

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-funac-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {loading && <PageSkeleton />}
        {error && <Alert type="error" title="Error" message={error} />}

        {!loading && !error && (
          <>
            {/* Card grande: Quiénes Somos */}
            {page?.quienes_somos && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 border-l-4 border-l-funac-navy rounded-2xl p-8"
              >
                <div className="inline-flex p-3 bg-funac-navy/10 rounded-xl mb-5 text-funac-navy">
                  <DynamicIcon name={quienesSomosIcono} size={28} DefaultIcon={Users} />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Quienes Somos</h2>
                <p className="text-gray-600 leading-relaxed">{page.quienes_somos}</p>
              </motion.div>
            )}

            {/* Card: Objetivo Social */}
            {page?.objetivo_social && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 border-l-4 border-l-funac-orange rounded-2xl p-8"
              >
                <div className="inline-flex p-3 bg-funac-orange/10 rounded-xl mb-5 text-funac-orange">
                  <DynamicIcon name={objetivoSocialIcono} size={28} DefaultIcon={Target} />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Objetivo Social</h2>
                <p className="text-gray-600 leading-relaxed">{page.objetivo_social}</p>
              </motion.div>
            )}

            {/* Grid: Objetivos Específicos */}
            {objetivos.length > 0 && (
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-black text-funac-navy mb-6"
                >
                  Objetivos Específicos
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {objetivos.map((obj, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-3"
                    >
                      <div className="shrink-0 mt-0.5">
                        <CheckCircle size={18} className="text-funac-green" />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{obj}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Estado vacío */}
            {!page?.quienes_somos && !page?.objetivo_social && objetivos.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">Contenido en construccion. Vuelve pronto.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
