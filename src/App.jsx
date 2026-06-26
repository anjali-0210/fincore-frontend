import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import ResourcePage from './crud/ResourcePage'
import { resources } from './crud/resources'

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
  <Route path="/admin/login" element={<Login />} />
      <Route path="/" element={<Shell><Dashboard /></Shell>} />
      <Route path="/reports" element={<Shell><Reports /></Shell>} />
      {Object.entries(resources).map(([key, cfg]) => (
        <Route
          key={key}
          path={`/${cfg.path}`}
          element={<Shell><ResourcePage config={cfg} /></Shell>}
        />
      ))}
      <Route path="*" element={<Shell><div className="text-slate-500">Page not found.</div></Shell>} />
    </Routes>
  )
}
