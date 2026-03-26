import api from './api'

const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // If logout fails on the server, we still clear locally
    }
  },
}

export default authService
