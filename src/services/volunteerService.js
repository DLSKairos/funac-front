import api from './api'

const volunteerService = {
  async register(data) {
    const response = await api.post('/volunteers', data)
    return response.data
  },

  async uploadCV(volunteerId, file) {
    const formData = new FormData()
    formData.append('cv', file)
    const response = await api.post(`/volunteers/${volunteerId}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

export default volunteerService
