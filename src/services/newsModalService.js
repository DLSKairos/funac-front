import api from './api'

const newsModalService = {
  async getConfig() {
    const response = await api.get('/noticias-modal')
    return response.data
  },
  async getAdminConfig() {
    const response = await api.get('/admin/noticias-modal')
    return response.data
  },
  async updateConfig(data) {
    const response = await api.put('/admin/noticias-modal', data)
    return response.data
  },
  async uploadImage(formData) {
    const response = await api.post('/admin/noticias-modal/imagen', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  async deleteImage() {
    const response = await api.delete('/admin/noticias-modal/imagen')
    return response.data
  },
}

export default newsModalService
