import { useState, useEffect } from 'react'
import homeService from '../../services/homeService'

export default function ImageCarousel() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    homeService.getCarouselImages()
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading || !images.length) return null

  const doubled = [...images, ...images]

  return (
    <section className="py-8 overflow-hidden">
      <div
        className={`flex gap-4 animate-scroll-x ${paused ? '[animation-play-state:paused]' : ''}`}
        style={{ width: 'max-content' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="h-52 w-80 flex-shrink-0 rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={img.url_imagen || img.url}
              alt={img.titulo || `Imagen ${i + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
