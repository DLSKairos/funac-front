import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Users } from 'lucide-react'
import Button from '../ui/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-orange-50 to-blue-50 pt-16">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-[-5%] w-96 h-96 rounded-full bg-funac-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-5%] w-80 h-80 rounded-full bg-funac-navy/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-funac-green/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-funac-orange text-sm font-medium mb-6">
            <Heart size={14} className="fill-funac-orange" />
            Juntos hacemos la diferencia
          </span>
        </motion.div>

        <motion.h1
          custom={0.15}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
        >
          Construyendo un{' '}
          <span className="text-gradient">futuro mejor</span>
          <br />
          para nuestra comunidad
        </motion.h1>

        <motion.p
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          FUNAC es una fundacion comprometida con el desarrollo social, la educacion y el bienestar de las comunidades mas vulnerables de Colombia.
        </motion.p>

        <motion.div
          custom={0.45}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/donaciones">
            <Button size="lg" icon={Heart}>
              Donar Ahora
            </Button>
          </Link>
          <Link to="/voluntarios">
            <Button size="lg" variant="outline" icon={Users}>
              Ser Voluntario
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: '89+', label: 'Voluntarios' },
            { value: '1.240', label: 'Familias' },
            { value: '45', label: 'Proyectos' },
            { value: '156', label: 'Donaciones' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-funac-navy">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
