import api from './api'

const homeService = {
  async getCarouselImages() {
    const response = await api.get('/home/images')
    return response.data?.data || []
  },

  async getPDFs() {
    const response = await api.get('/home/pdfs')
    return response.data
  },

  async getSocialMedia() {
    const response = await api.get('/settings/social')
    return response.data
  },

  async getWhatsAppConfig() {
    const response = await api.get('/settings/whatsapp')
    return response.data
  },
}

export default homeService
