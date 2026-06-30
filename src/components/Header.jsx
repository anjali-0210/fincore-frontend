import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-100 py-4 px-6 sm:px-12 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* logo */}
        <a href="/" className="flex items-center gap-2">
         
          <img 
              src="/logo.svg" 
              alt="Fincapify Logo" 
              className="h-9 w-auto object-contain" 
            />
            <span className="text-xl font-bold text-[#0c2340] tracking-tight">
              Fincapify
            </span>
          
          <div className="hidden items-center gap-2" id="logo-fallback">
            <svg className="h-9 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 32V12C8 12 16 8 26 4M26 4L22 8M26 4L29 12" stroke="#1e61c3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 30V19H20" stroke="#132c5d" strokeWidth="3" strokeLinecap="round"/>
              <rect x="14" y="21" width="4" height="9" fill="#1e61c3" rx="1" />
              <rect x="20" y="15" width="4" height="15" fill="#132c5d" rx="1" />
            </svg>
            <span className="text-xl font-bold text-[#0e2240] tracking-tight">Fincapify</span>
          </div>
        </a>
      </div>
    </header>
  );
}