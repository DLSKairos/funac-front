import { useEffect, useState } from 'react'
import sectionImagesService from '../services/sectionImagesService'

let cache = null

function loadSectionImages() {
  if (!cache) {
    cache = sectionImagesService.getAll().catch(() => [])
  }
  return cache
}

export function useSectionImages() {
  const [images, setImages] = useState([])

  useEffect(() => {
    let active = true
    loadSectionImages().then((data) => {
      if (active) setImages(data)
    })
    return () => {
      active = false
    }
  }, [])

  const get = (pagina, clave) => {
    const found = images.find((i) => i.pagina === pagina && i.clave === clave)
    return found?.url_imagen || null
  }

  return { get }
}
