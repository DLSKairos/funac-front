import api from './api'

const sectionImagesService = {
  async getAll() {
    const response = await api.get('/secciones-imagenes')
    return response.data?.data || []
  },
}

export default sectionImagesService
