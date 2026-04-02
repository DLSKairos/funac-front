import { motion } from 'framer-motion'

export default function Card({ children, hover = false, className = '', ...props }) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-xl shadow-md p-6 ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}
