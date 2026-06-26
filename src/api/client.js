import axios from 'axios'

// If VITE_API_BASE_URL is set, use it; otherwise rely on the Vite dev proxy ('/api').
const baseURL = (import.meta.env.VITE_API_BASE_URL || '') + '/api/v1'

const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
})

// Attach bearer token from memory/localStorage on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fincap_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, clear token and bounce to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('fincap_token')
      localStorage.removeItem('fincap_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

export default api
