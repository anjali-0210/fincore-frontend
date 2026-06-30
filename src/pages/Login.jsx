import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@fincap.test')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={submit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
       <div className="flex justify-center items-center gap-3 mb-1">
  <img 
    src="/logo.svg" 
    alt="Fincapify Logo" 
    className="h-10 w-auto object-contain" 
  />
  <span className="text-xl font-bold text-[#0c2340] tracking-tight">
    Fincapify
  </span>
</div>
      

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 rounded p-2">{error}</div>}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4" required
        />
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6" required
        />
        <button
          type="submit" disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2.5 font-medium disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
       
      </form>
    </div>
  )
}
