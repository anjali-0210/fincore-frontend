import React from 'react';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0c2340] border-t border-white/10 py-6 px-6 sm:px-12 mt-auto overflow-hidden">
      {/* Top subtle accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1d72b8] via-sky-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative z-10">
        
        {/* Left Side: Brand & Copyright with Light Text on Dark BG */}
        <div className="flex items-center gap-2.5 justify-center md:justify-start">
          <div className="flex gap-1">
            <span className="w-1.5 h-3 rounded-full bg-[#1d72b8]"></span>
            <span className="w-1.5 h-3 rounded-full bg-white/90"></span>
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            &copy; 2026 <span className="text-white font-bold">Fincapify</span>. All rights reserved.
          </p>
        </div>
        
        {/* Right Side: Design Credit with Heart Emoji */}
        <div className="text-slate-400 text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5 justify-center md:justify-end">
          <span>Designed with</span>
          <span className="text-rose-500 text-xs animate-pulse">❤️</span>
          <span>by</span>
          <span className="text-white hover:text-[#1d72b8] font-bold transition-colors duration-300 cursor-pointer">
            Webpex Technologies
          </span>
        </div>

      </div>
    </footer>
  );
}