import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import homeService from '../../services/homeService'

export default function WhatsAppButton() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    homeService.getWhatsAppConfig()
      .then((data) => setConfig(data))
      .catch(() => {})
  }, [])

  if (!config || config.activo === false) return null

  const phone = `${config.codigo_pais || '57'}${config.numero || ''}`.replace(/\D/g, '')
  const message = encodeURIComponent(config.mensaje || 'Hola, me gustaria obtener mas informacion.')
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed bottom-20 right-6 z-50 flex items-center justify-center w-14 h-14 bg-funac-green rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
    >
      <MessageCircle size={26} className="text-white" />
    </motion.a>
  )
}
