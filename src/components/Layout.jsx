import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊', end: true },
  { to: '/companies', label: 'Companies', icon: '🏢' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/vendors', label: 'Vendors', icon: '🚚' },
  { to: '/expense-categories', label: 'Categories', icon: '🏷️' },
  { to: '/incomes', label: 'Income', icon: '💰' },
  { to: '/expenses', label: 'Expenses', icon: '🧾' },
  { to: '/receivables', label: 'Receivables', icon: '📥' },
  { to: '/payables', label: 'Payables', icon: '📤' },
  { to: '/recurring-expenses', label: 'Recurring', icon: '🔁' },
  { to: '/reminders', label: 'Reminders', icon: '⏰' },
  { to: '/reports', label: 'Reports', icon: '📈' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-x-hidden">
      {/* Custom scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a1a1aa;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }
      `}</style>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Card */}
      <aside 
        className={`w-64 bg-white flex flex-col fixed h-[calc(100vh-2rem)] my-4 ml-4 rounded-[2.5rem] shadow-lg md:shadow-sm border border-slate-100/80 overflow-hidden z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'} 
          md:translate-x-0`}
      >
        {/* Brand logo section with close button for mobile */}
        <div className="px-8 pt-8 pb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="Fincapify Logo" 
              className="h-9 w-auto object-contain" 
            />
            <span className="text-xl font-bold text-[#0c2340] tracking-tight">
              Fincapify
            </span>
          </div>
          
          {/* Close button (visible only on mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)} // Auto-closes sidebar on mobile when navigating
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-4 text-[15px] font-medium transition-all duration-200 rounded-[1.25rem] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1d61b4] to-[#122b52] text-white shadow-md shadow-blue-900/10'
                    : 'text-slate-600 hover:bg-[#edf2fa] hover:text-[#1a5fb4]'
                }`
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 text-xs text-slate-400">
          v1.0 • Business Finance
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-w-0 transition-all duration-300">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle Button (visible only on mobile) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none md:hidden transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="font-semibold text-slate-700">Admin Dashboard</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-800">{user?.name}</div>
              <div className="text-xs text-slate-500 capitalize">
                {user?.role?.replace('_', ' ')}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}