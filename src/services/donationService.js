import api from './api'

const donationService = {
  async initDonation(data) {
    const response = await api.post('/donations/init', data)
    return response.data
  },

  async getStatus(referencia) {
    const response = await api.get(`/donations/${referencia}/status`)
    return response.data
  },
}

export default donationService
