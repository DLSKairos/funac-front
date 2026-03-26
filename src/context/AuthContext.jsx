import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenExpired(decoded) {
  if (!decoded || !decoded.exp) return true
  return decoded.exp * 1000 < Date.now()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('funac_token')
    if (storedToken) {
      const decoded = decodeToken(storedToken)
      if (decoded && !isTokenExpired(decoded)) {
        setToken(storedToken)
        setUser(decoded)
      } else {
        localStorage.removeItem('funac_token')
        localStorage.removeItem('funac_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password)
    const { token: newToken } = data.data
    const decoded = decodeToken(newToken)
    localStorage.setItem('funac_token', newToken)
    if (decoded) {
      localStorage.setItem('funac_user', JSON.stringify(decoded))
    }
    setToken(newToken)
    setUser(decoded)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // proceed with local cleanup regardless
    }
    localStorage.removeItem('funac_token')
    localStorage.removeItem('funac_user')
    setToken(null)
    setUser(null)
    navigate('/')
  }, [navigate])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
