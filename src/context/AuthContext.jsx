import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('fincap_user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const payload = data.data || data
    localStorage.setItem('fincap_token', payload.token)
    localStorage.setItem('fincap_user', JSON.stringify(payload.user))
    setUser(payload.user)
    return payload.user
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch (e) { /* ignore */ }
    localStorage.removeItem('fincap_token')
    localStorage.removeItem('fincap_user')
    setUser(null)
  }

  // Refresh the current user on mount if a token exists.
  useEffect(() => {
    const token = localStorage.getItem('fincap_token')
    if (token && !user) {
      setLoading(true)
      api.get('/auth/me')
        .then(({ data }) => {
          const u = data.data || data
          setUser(u)
          localStorage.setItem('fincap_user', JSON.stringify(u))
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isRole = (...roles) => user && roles.includes(user.role)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
