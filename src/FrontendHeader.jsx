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
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-all duration-300">
                            F
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tight group-hover:text-rose-500 transition-colors duration-300">
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