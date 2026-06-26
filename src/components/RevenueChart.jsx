import React from 'react';

export default function RevenueChart() {
  return (
    // बॉक्स के किनारों और शैडो को नए नीले रंग की थीम में बदला गया है
    <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-blue-100 p-8 shadow-[15px_15px_35px_rgba(37,112,194,0.05),-10px_-10px_30px_rgba(255,255,255,0.9)]">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800">
            Revenue Analytics
          </h3>

          <p className="text-slate-500 text-sm">
            Revenue growth over time
          </p>
        </div>

        {/* आकर्षक पल्सिंग इफ़ेक्ट के साथ ग्रोथ इंडिकेटर */}
        <div className="px-4 py-2 rounded-xl bg-[#2570C2]/10 text-[#2570C2] font-bold text-sm flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2570C2] animate-pulse"></span>
          +24%
        </div>
      </div>

      <div className="h-80 w-full">
        {/* रिस्पॉन्सिव SVG चार्ट */}
        <svg
          viewBox="0 0 800 300"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* नया सुपीरियर ब्लू ग्रेडिएंट */}
            <linearGradient
              id="blueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#2570C2" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2570C2" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* आकर्षक यूआई के लिए ग्रिड लाइन्स */}
          <line x1="0" y1="60" x2="800" y2="60" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="6,6" />
          <line x1="0" y1="140" x2="800" y2="140" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="6,6" />
          <line x1="0" y1="220" x2="800" y2="220" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="6,6" />

          {/* चार्ट का नीला एरिया फील */}
          <path
            d="M0 240 C100 180 180 200 260 130 C340 80 420 120 500 70 C580 30 650 100 800 40 L800 300 L0 300 Z"
            fill="url(#blueGradient)"
          />

          {/* मुख्य चार्ट लाइन (स्ट्रोक) */}
          <path
            d="M0 240 C100 180 180 200 260 130 C340 80 420 120 500 70 C580 30 650 100 800 40"
            fill="none"
            stroke="#2570C2"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* अंतिम नोड पर एक सुंदर मार्कर डॉट */}
          <circle 
            cx="800" 
            cy="40" 
            r="6" 
            fill="#11284E" 
            stroke="#ffffff" 
            strokeWidth="2" 
          />
        </svg>
      </div>
    </div>
  );
}