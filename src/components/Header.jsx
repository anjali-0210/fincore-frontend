import React from 'react';

// Props स्वीकार किए गए: user और handleLogout
export default function Header({ user, handleLogout }) {
  return (
    // बॉर्डर और शैडो को थीम के अनुसार अपडेट किया गया है
    <header className="m-4 mb-0 rounded-[28px] bg-white/70 backdrop-blur-xl border border-blue-100 px-8 py-5 flex items-center justify-between shadow-[0_10px_30px_rgba(37,112,194,0.03)]">

      <div>
        {/* लॉगिन यूजर का नाम प्रदर्शित करने के लिए */}
        <h2 className="font-black text-2xl text-slate-800">
          Welcome Back, {user?.name || 'Admin'} 👋
        </h2>

        <p className="text-slate-500 text-sm">
          Here's what's happening today.
        </p>
      </div>

      <div className="flex items-center gap-4">

        {/* सर्च इनपुट की बॉर्डर और फोकस रिंग को ब्लू थीम में बदला गया है */}
        <input
          placeholder="Search..."
          className="px-5 py-3 rounded-2xl border border-blue-100 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2570C2] text-sm text-slate-700 transition-all"
        />

        {/* डायनामिक प्रोफाइल अवतार (Fincapify Gradient के साथ) */}
        <div 
          className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2570C2] to-[#11284E] flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/10 cursor-pointer"
          title={user?.name || 'User Profile'}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>

        {/* लॉगआउट बटन (यदि handleLogout प्रोप उपलब्ध है) */}
        {handleLogout && (
          <button
            onClick={handleLogout}
            className="h-12 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200 hover:border-rose-100 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Logout Account"
          >
            Logout
          </button>
        )}

      </div>

    </header>
  );
}