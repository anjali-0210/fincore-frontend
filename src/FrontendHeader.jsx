import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FrontendHeader() {
    const navigate = useNavigate();

    return (
        <header className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/80 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4.5">
                    
                    {/* 1. Left Section: Premium Logo & Brand */}
                    <div 
                        className="flex items-center gap-3 group cursor-pointer" 
                        onClick={() => navigate('/')}
                    >
                        <img 
    src="/logo.svg" 
    alt="Fincapify Logo" 
    className="h-11 w-auto object-contain" 
  />
  <span className="font-black text-xl text-[#11284E] tracking-tight">
    Fincapify
  </span>
                    </div>

                    {/* 2. Middle Section: Premium Modern Nav Links */}
                    

                    {/* 3. Right Section: Premium CTA Button */}
                    <div className="flex items-center">
                        
                    </div>

                </div>
            </div>
        </header>
    );
}