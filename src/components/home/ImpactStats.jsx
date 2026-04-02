import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Briefcase, HeartHandshake } from 'lucide-react'

const stats = [
  { icon: Users, value: 89, label: 'Voluntarios activos', suffix: '+', color: 'text-white' },
  { icon: Heart, value: 1240, label: 'Familias beneficiadas', suffix: '', color: 'text-white' },
  { icon: Briefcase, value: 45, label: 'Proyectos ejecutados', suffix: '', color: 'text-white' },
  { icon: HeartHandshake, value: 156, label: 'Donaciones recibidas', suffix: '', color: 'text-white' },
]

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])

  return count
}

function StatCard({ stat, inView }) {
  const count = useCountUp(stat.value, 2000, inView)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className={`inline-flex p-3 rounded-2xl bg-white/10 mb-4`}>
        <stat.icon size={28} className={stat.color} />
      </div>
      <div className="text-4xl sm:text-5xl font-black text-white mb-2">
        {count.toLocaleString('es-CO')}{stat.suffix}
      </div>
      <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
    </motion.div>
  )
}

export default function ImpactStats() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="bg-gradient-to-br from-funac-navy to-blue-900 py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Nuestro impacto en números
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto">
            Cada cifra representa una vida transformada, una familia apoyada y un sueño hecho realidad.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
