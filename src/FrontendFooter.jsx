import React from 'react';

export default function FrontendFooter() {
    return (
        <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
                    
                    {/* 1. Left Section: Copyright Statement */}
                    <div className="text-slate-400 font-medium text-center sm:text-left">
                        © {new Date().getFullYear()} Fincapify. All rights reserved.
                    </div>

                    {/* 2. Right Section: Credit with Pulsing Heart Icon */}
                    <div className="flex items-center gap-1 text-slate-400 font-medium text-center sm:text-right">
                        <span>Designed with</span>
                        <span className="text-rose-500 animate-pulse text-sm">❤️</span>
                        <span>by</span>
                        <a 
                            href="" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-white hover:text-rose-400 font-bold transition-colors duration-200 ml-0.5"
                        >
                            Webplex Technologies
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}