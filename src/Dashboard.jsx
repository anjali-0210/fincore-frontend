import React from 'react';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import RevenueChart from "./components/RevenueChart";
import CompanyTable from "./components/CompanyTable";
import ActivityPanel from "./components/ActivityPanel";

// Yahan props accept karein: user aur handleLogout
export default function Dashboard({ user, handleLogout }) {
  return (
    // बैकग्राउंड ग्रेडीएंट को सॉफ्ट ब्लू/इंडिगो टोन में बदला गया है
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 flex">
      
      {/* Sidebar - Yahan props pass karein agar navigation link chahiye */}
      <Sidebar user={user} handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col">

        {/* Header - Iske andar hum user info aur logout button pass karenge */}
        <Header user={user} handleLogout={handleLogout} />

        <main className="p-6 lg:p-8 space-y-8">

          {/* Hero Banner - पिंक हटाकर Accent Blue (#2570C2) से Deep Navy (#11284E) ग्रेडीएंट किया गया है */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#2570C2] via-blue-600 to-[#11284E] p-8 shadow-[0_30px_60px_rgba(37,112,194,0.25)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <span className="inline-flex px-4 py-2 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider">
                PREMIUM DASHBOARD
              </span>
              
              {/* Login hue user ka naam dikhane ke liye */}
              <h1 className="mt-4 text-4xl font-black text-white">
                Welcome, {user?.name || 'Workspace'}
              </h1>

              {/* टेक्स्ट कलर को text-pink-100 से बदलकर text-blue-100 किया गया है */}
              <p className="mt-3 text-blue-100 max-w-2xl">
                Monitor your finances, companies, revenue streams and
                organizational performance from one beautiful dashboard.
              </p>
            </div>
          </div>

          <StatsCards />

          <div className="grid xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <RevenueChart />
            </div>
            <ActivityPanel />
          </div>

          <CompanyTable />

        </main>
      </div>
    </div>
  );
}