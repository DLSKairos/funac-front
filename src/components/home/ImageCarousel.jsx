import { useState, useEffect } from 'react'
import homeService from '../../services/homeService'
import carousel1 from '@/assets/carousel-1.jpg'
import carousel2 from '@/assets/carousel-2.jpg'
import carousel3 from '@/assets/carousel-3.jpg'
import carousel4 from '@/assets/carousel-4.jpg'

const fallbackImages = [
  { src: carousel1, alt: 'Voluntarios en banco de alimentos' },
  { src: carousel2, alt: 'Programa educativo comunitario' },
  { src: carousel3, alt: 'Asistencia médica rural' },
  { src: carousel4, alt: 'Construcción de viviendas' },
]

const ImageCarousel = () => {
  const [images, setImages] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    homeService
      .getCarouselImages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(
            data.map((img) => ({
              src: img.url_imagen || img.url,
              alt: img.titulo || img.alt_text || 'Imagen FUNAC',
            }))
          )
        } else {
          setImages(fallbackImages)
        }
      })
      .catch(() => setImages(fallbackImages))
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded || images.length === 0) return null

  const doubled = [...images, ...images]

  return (
    <div className="overflow-hidden py-8">
      <div className="flex animate-scroll-x gap-6" style={{ width: 'max-content' }}>
        {doubled.map((img, i) => (
          <div
            key={i}
            className="group relative h-72 w-[28rem] flex-shrink-0 overflow-hidden rounded-2xl shadow-elevated"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 text-sm font-medium text-white drop-shadow-lg">
              {img.alt}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
