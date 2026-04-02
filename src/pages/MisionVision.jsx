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

  const misionIcono = page?.secciones?.find((s) => s.seccion === 'mision')?.icono || null
  const visionIcono = page?.secciones?.find((s) => s.seccion === 'vision')?.icono || null

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-funac-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Misión y Visión
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-blue-200 text-lg"
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
              className="bg-white border border-gray-200 border-l-4 border-l-funac-navy rounded-2xl p-8"
            >
              <div className="inline-flex p-3 bg-funac-navy/10 rounded-xl mb-6 text-funac-navy">
                <DynamicIcon name={misionIcono} size={28} DefaultIcon={Target} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Nuestra Misión</h2>
              <p className="text-gray-600 leading-relaxed">
                {page?.mision || DEFAULT_MISION}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white border border-gray-200 border-l-4 border-l-funac-orange rounded-2xl p-8"
            >
              <div className="inline-flex p-3 bg-funac-orange/10 rounded-xl mb-6 text-funac-orange">
                <DynamicIcon name={visionIcono} size={28} DefaultIcon={Eye} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Nuestra Visión</h2>
              <p className="text-gray-600 leading-relaxed">
                {page?.vision || DEFAULT_VISION}
              </p>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  )
}
