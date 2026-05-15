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
}

export default newsModalService
