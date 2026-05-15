import { motion } from 'framer-motion'

const accentMap = {
  primary: 'from-primary/70 via-primary/40 to-background',
  secondary: 'from-secondary/70 via-secondary/30 to-background',
  accent: 'from-accent/70 via-accent/30 to-background',
}

const PageHero = ({ image, eyebrow, title, subtitle, accent = 'primary', children }) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-b ${accentMap[accent]}`} />
        <div className="absolute inset-0 bg-grid opacity-[0.07]" />
      </div>

      {/* Floating blobs */}
      <div className={`blob top-10 -left-20 h-72 w-72 animate-blob-float bg-${accent}/30`} />
      <div
        className={`blob bottom-10 right-0 h-80 w-80 animate-blob-float bg-${accent}/20`}
        style={{ animationDelay: '3s' }}
      />

      <div className="relative z-10 container mx-auto max-w-5xl px-6 py-32 md:py-40">
        {eyebrow && (
          <motion.p
            className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          className="text-5xl font-medium tracking-tight text-white drop-shadow-md md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default PageHero
