import React from 'react';
// Header और Footer को इम्पोर्ट किया गया
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-700 font-sans flex flex-col justify-between">
      
      {/* 1. Header Component */}
      <Header />

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden py-20 px-6 sm:px-12 lg:px-24 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Tagline */}
            <span className="inline-block bg-blue-50 text-[#1e61c3] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              Multi-Company Expense Management
            </span>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f223f] tracking-tight leading-none mb-6">
              Control Expenses Across <br />
              <span className="text-[#1e61c3]">All Your Businesses</span>
            </h1>
            
            {/* Sub-description */}
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Track, categorize, and analyze expenses across multiple companies from a single dashboard. Eliminate manual errors, manage multi-entity cash outflows, and maintain complete financial control.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#dashboard" 
                className="px-8 py-4 text-white font-bold text-sm tracking-wider uppercase rounded-full shadow-lg shadow-blue-900/15 hover:shadow-xl hover:shadow-blue-900/25 active:scale-[0.98] transition-all bg-gradient-to-r from-[#1e61c3] to-[#132c5d]"
              >
                Track Expenses Free
              </a>
              <a 
                href="#features" 
                className="px-8 py-4 border border-slate-200 bg-white text-[#132c5d] hover:bg-slate-50 font-bold text-sm tracking-wider uppercase rounded-full active:scale-[0.98] transition-all"
              >
                View Features
              </a>
            </div>
          </div>
          
          {/* Decorative subtle light circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        </section>

        {/* 3. Core Features */}
        <section id="features" className="py-20 px-6 sm:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-[#0f223f] mb-3">Everything you need, in one place</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">We connect key financial entities to keep your business operating securely and transparently.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Feature 1: Powerful Dashboard */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-xl hover:scale-[1.02] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 text-2xl">
                    📊
                  </div>
                  <h3 className="text-lg font-bold text-[#0f223f] mb-2">Central Dashboard</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Consolidated financial records, real-time insights, metrics, and actionable analytics directly on your centralized command center.
                  </p>
                </div>
              </div>

              {/* Feature 2: Companies Profiles */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-xl hover:scale-[1.02] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 text-2xl">
                    🏢
                  </div>
                  <h3 className="text-lg font-bold text-[#0f223f] mb-2">Company Registry</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Manage multiple business entities, track individual performance metrics, subsidiary operations, and tax entities under a single unified portal.
                  </p>
                </div>
              </div>

              {/* Feature 3: Clients Management */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-xl hover:scale-[1.02] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 text-2xl">
                    👥
                  </div>
                  <h3 className="text-lg font-bold text-[#0f223f] mb-2">Client Invoicing</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Track client payments, automate reminders, record transactional history, and optimize cash receivables safely and efficiently.
                  </p>
                </div>
              </div>

              {/* Feature 4: Vendors Portal */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-xl hover:scale-[1.02] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 text-2xl">
                    🚚
                  </div>
                  <h3 className="text-lg font-bold text-[#0f223f] mb-2">Vendor Payments</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Organize outgoing payables, check invoice histories, track procurement details, and maintain secure relationships with your supply partners.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. CTA Action Banner */}
        <section className="py-16 px-6 sm:px-12">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1e61c3] to-[#132c5d] text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Start Simplifying Your Corporate Finances</h2>
              <p className="text-blue-100 text-sm max-w-lg mx-auto mb-8">
                Join thousands of structured businesses managing their portfolios, client cycles, and vendor disbursements under Fincapify.
              </p>
              <button className="px-8 py-4 bg-white text-[#132c5d] hover:bg-slate-50 font-bold text-xs tracking-wider uppercase rounded-full shadow-md active:scale-[0.98] transition-all">
                Launch Fincapify App
              </button>
            </div>
            
            {/* Subtle decorative graphic circle */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 rounded-full"></div>
          </div>
        </section>
      </main>

      {/* 5. Footer Component */}
      <Footer />

    </div>
  );
}