import React from 'react';

const stats = [
  {
    title: "Total Revenue",
    value: "₹4,52,318",
    change: "+12.5%",
    color: "from-[#2570C2] to-indigo-600", // Fincapify थीम ब्लू
  },
  {
    title: "Expenses",
    value: "₹2,10,450",
    change: "+4.2%",
    color: "from-slate-600 to-[#11284E]", // डीप कॉर्पोरेट नेवी ब्लू
  },
  {
    title: "Net Profit",
    value: "₹2,41,868",
    change: "+18.3%",
    color: "from-emerald-400 to-[#2570C2]", // हेल्दी ग्रोथ दिखाने के लिए एमराल्ड टू ब्लू
  },
  {
    title: "Receivables",
    value: "₹85,400",
    change: "+8.9%",
    color: "from-cyan-500 to-[#2570C2]", // सियान टू थीम ब्लू
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((card, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-[30px] bg-white/70 backdrop-blur-xl border border-blue-100 p-6 shadow-[15px_15px_35px_rgba(37,112,194,0.05),-10px_-10px_30px_rgba(255,255,255,0.9)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300"
        >
          {/* बैकग्राउंड में धीमा चमकता हुआ ब्लर इफ़ेक्ट */}
          <div
            className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-3xl`}
          />

          <div className="relative z-10">
            <p className="text-sm text-slate-500 font-medium">
              {card.title}
            </p>

            <h3 className="mt-4 text-3xl font-black text-slate-800">
              {card.value}
            </h3>

            <div className="mt-4 flex items-center justify-between">
              {/* प्रतिशत वृद्धि के लिए बैज डिज़ाइन */}
              <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-lg">
                {card.change}
              </span>

              {/* होवर इफ़ेक्ट के साथ घुमावदार रंगीन बॉक्स */}
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.color} shadow-md group-hover:rotate-12 transition-transform duration-300`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}