import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import Button from '../ui/Button'
import ImageCarousel from './ImageCarousel'

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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-funac-navy/30 text-funac-navy text-xs font-medium mb-6 tracking-widest uppercase rounded">
            Fundación sin ánimo de lucro · Colombia
          </span>
        </motion.div>

        <motion.h1
          custom={0.15}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
        >
          Construyendo un{' '}
          <span className="text-gradient">futuro mejor</span>
          <br />
          para nuestra comunidad
        </motion.h1>

        <motion.div custom={0.3} initial="hidden" animate="visible" variants={fadeUp}>
          <ImageCarousel />
        </motion.div>

        <motion.p
          custom={0.45}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          FUNAC es una fundación comprometida con el desarrollo social, la educación y el bienestar de las comunidades más vulnerables de Colombia.
        </motion.p>

        <motion.div
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/donaciones">
            <Button size="lg">
              Donar Ahora
            </Button>
          </Link>
          <Link to="/voluntarios">
            <Button size="lg" variant="outline" icon={Users}>
              Ser Voluntario
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
