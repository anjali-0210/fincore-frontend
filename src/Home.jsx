import React from 'react';
import FrontendHeader from './FrontendHeader'; 
import FrontendFooter from './FrontendFooter'; 

export default function Home() {
    return (
        // बाहरी बैकग्राउंड को Fincapify थीम के अनुकूल सॉफ्ट ब्लू टोन में बदला गया है
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 flex flex-col justify-between items-center w-full m-0 p-0 box-border text-slate-800">
            
            {/* 1. Header (Pushes to the top edges perfectly) */}
            <FrontendHeader />

            {/* 2. Responsive Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 gap-6 sm:gap-8 box-border">
                
                {/* Small Pill Tag - थीम नीले रंग में परिवर्तित */}
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-[#2570C2]/10 text-[#2570C2] border border-[#2570C2]/15 tracking-wider uppercase">
                    Enterprise ERP Solution
                </span>

                {/* Responsive Main Heading - "Management System" का ग्रेडिएंट रंग बदला गया */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.15] tracking-tight m-0">
                    Finance & Expense <br />
                    <span className="bg-gradient-to-r from-[#2570C2] to-[#11284E] bg-clip-text text-transparent">
                        Management System
                    </span>
                </h1>

                {/* Responsive Description Text */}
                <p className="text-sm sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto m-0">
                    A secure and modern financial ERP platform. Seamlessly track, audit, and manage your business invoices, income records, payments, and pending dues in one centralized dashboard.
                </p>

                {/* Fully Responsive Static Feature Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-12 sm:mt-16">
                    
                    {/* Feature Card 1 (Accent Blue Icon) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.01)] text-left flex flex-col gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-[#2570C2]/10 text-[#2570C2]">
                            📊
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 m-0">
                            Income Tracking
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed m-0">
                            Efficiently record invoice numbers, received amounts, and payment statuses in real-time.
                        </p>
                    </div>

                    {/* Feature Card 2 (Navy Blue Icon) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.01)] text-left flex flex-col gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-[#11284E]/10 text-[#11284E]">
                            📁
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 m-0">
                            Audit & Ledgers
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed m-0">
                            Monitor company-wide and client-wise financial transactions with detailed audit trails.
                        </p>
                    </div>

                    {/* Feature Card 3 (Cyan Icon) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.01)] text-left flex flex-col gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-cyan-500/10 text-cyan-600">
                            💳
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 m-0">
                            Secure Access
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed m-0">
                            Protect sensitive financial assets with secure token-based authorization and role protection.
                        </p>
                    </div>

                </section>
            </main>

            {/* 3. Footer (Pushes to the bottom edges perfectly) */}
            <FrontendFooter />
        </div>
    );
}