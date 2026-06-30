import { Routes, Route, Navigate } from 'react-router-dom' 
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import ResourcePage from './crud/ResourcePage'
import { resources } from './crud/resources'
import Home from './Home' // 1. Home कंपोनेंट को यहाँ इम्पोर्ट करें

function Shell({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <Routes>
      {/* 2. मुख्य पब्लिक होमपेज रूट यहाँ जोड़ें ताकि / पर Home.jsx लोड हो */}
      <Route path="/" element={<Home />} />

      {/* Agar koi /login par aaye, toh use /admin/login par redirect karein */}
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Shell><Dashboard /></Shell>} />
      <Route path="/reports" element={<Shell><Reports /></Shell>} />
      
      {Object.entries(resources).map(([key, cfg]) => (
        <Route
          key={key}
          path={`/${cfg.path}`}
          element={<Shell><ResourcePage config={cfg} /></Shell>}
        />
      ))}
      
      {/* यह केवल तभी दिखेगा जब कोई गलत URL डालेगा */}
      <Route path="*" element={<Shell><div className="text-slate-500">Page not found.</div></Shell>} />
    </Routes>
  )
}