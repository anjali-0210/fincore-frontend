import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const token = localStorage.getItem('fincap_token')

  if (!user && !token) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
