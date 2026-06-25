import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state

  // Sabhi menus ke paths aur unke names ki list (Clients Joda gaya)
  const menus = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Companies", path: "/admin/companies" },
    { name: "Clients", path: "/admin/clients" }, // <-- Clients Added Here
    { name: "Incomes", path: "/admin/incomes" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Settings", path: "/admin/settings" },
  ];

  // Ye check karne ke liye ki kaunsa menu active hai
  const isActive = (menuPath) => {
    if (menuPath === "/admin/dashboard") {
      return location.pathname === "/admin/dashboard";
    }
    return location.pathname.startsWith(menuPath);
  };

  return (
    <>
      {/* Mobile Toggle Button - Visible only on screens smaller than md */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Menu"
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-100 text-blue-600 shadow-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer flex items-center justify-center"
      >
        {isOpen ? (
          // Close Icon (X)
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger Icon
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Backdrop overlay (Closes sidebar when clicking outside on mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`
          fixed md:sticky
          top-0 md:top-4
          left-0
          h-full md:h-[calc(100vh-2rem)]
          w-72
          md:flex-shrink-0
          m-0 md:m-4
          rounded-r-[32px] md:rounded-[32px]
          bg-white md:bg-white/70
          backdrop-blur-none md:backdrop-blur-2xl
          border-r md:border
          border-blue-100
          shadow-2xl md:shadow-[20px_20px_60px_rgba(37,99,235,0.08),-20px_-20px_60px_rgba(255,255,255,0.9)]
          overflow-y-auto
          z-40 md:z-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Added padding at top on mobile view to avoid overlap with toggle button */}
        <div className="p-8 pt-20 md:pt-8 flex flex-col h-full min-h-[500px]">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
              F
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-800">
                Fincapify
              </h2>
            </div>
          </div>

          {/* Navigation Menu (Updated with Blue Theme Hover and Active State) */}
          <nav className="mt-10 space-y-3 flex-1">
            {menus.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false); // Auto-closes menu on mobile selection
                  }}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 font-semibold cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_15px_35px_rgba(37,99,235,0.25)]"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User Card (Updated with Blue Theme colors) */}
          <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold uppercase">
                {user?.name ? user.name.charAt(0) : "A"}
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 truncate max-w-[150px]">
                  {user?.name || "Admin User"}
                </h4>
                <p className="text-xs text-slate-500">
                  {user?.email || "Super Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}