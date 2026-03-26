import api from './api'

const adminService = {
  // Dashboard
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
  },

  async getDonationsChart(months = 6) {
    const response = await api.get('/admin/dashboard/donations-chart', { params: { months } })
    return response.data
  },

  // Carousel
  async getCarouselImages() {
    const response = await api.get('/home/images')
    return response.data
  },

  async uploadCarouselImages(formData) {
    const response = await api.post('/admin/carousel/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async reorderCarousel(orden) {
    const response = await api.put('/admin/carousel/images/reorder', { orden })
    return response.data
  },

  async deleteCarouselImage(id) {
    const response = await api.delete(`/admin/carousel/images/${id}`)
    return response.data
  },

  // PDFs
  async getPDFs() {
    const response = await api.get('/home/pdfs')
    return response.data
  },

  async uploadPDF(formData) {
    const response = await api.post('/admin/pdfs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async deletePDF(id) {
    const response = await api.delete(`/admin/pdfs/${id}`)
    return response.data
  },

  // Settings
  async getSocialMedia() {
    const response = await api.get('/settings/social')
    return response.data
  },

  async updateSocialMedia(data) {
    const response = await api.put('/admin/settings/social', data)
    return response.data
  },

  async getWhatsApp() {
    const response = await api.get('/settings/whatsapp')
    return response.data
  },

  async updateWhatsApp(data) {
    const response = await api.put('/admin/settings/whatsapp', data)
    return response.data
  },

  // Volunteers
  async getVolunteers(params) {
    const response = await api.get('/admin/volunteers', { params })
    return response.data
  },

  async getVolunteer(id) {
    const response = await api.get(`/admin/volunteers/${id}`)
    return response.data
  },

  async updateVolunteerStatus(id, data) {
    const response = await api.put(`/admin/volunteers/${id}/status`, data)
    return response.data
  },

  async deleteVolunteer(id) {
    const response = await api.delete(`/admin/volunteers/${id}`)
    return response.data
  },

  // Donations
  async getDonations(params) {
    const response = await api.get('/admin/donations', { params })
    return response.data
  },

  async getDonation(id) {
    const response = await api.get(`/admin/donations/${id}`)
    return response.data
  },

  async resendReceipt(id) {
    const response = await api.post(`/admin/donations/${id}/resend-receipt`)
    return response.data
  },

  async exportDonations(params) {
    const response = await api.get('/admin/donations/export', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  // Pages
  async getPages() {
    const response = await api.get('/admin/pages')
    return response.data
  },

  async getPageContent(pagina) {
    const response = await api.get(`/pages/${pagina}`)
    return response.data
  },

  async updatePage(pagina, data) {
    const response = await api.put(`/admin/pages/${pagina}`, data)
    return response.data
  },

  // Config
  async changePassword(data) {
    const response = await api.put('/admin/config/password', data)
    return response.data
  },

  async getLogs(params) {
    const response = await api.get('/admin/logs', { params })
    return response.data
  },
}

export default adminService
