import React from 'react';

const activities = [
  {
    title: "Invoice Paid",
    amount: "₹15,000",
    color: "bg-emerald-500",
  },
  {
    title: "New Company Added",
    amount: "Today",
    color: "bg-blue-500", // bg-pink-500 से बदलकर bg-blue-500 किया गया है
  },
  {
    title: "Salary Processed",
    amount: "₹75,000",
    color: "bg-purple-500",
  },
  {
    title: "Vendor Payment",
    amount: "₹28,000",
    color: "bg-orange-500",
  },
];

export default function ActivityPanel() {
  return (
    <div className="space-y-6">

      {/* Recent Activity Card */}
      <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-blue-100 p-6 shadow-[15px_15px_35px_rgba(37,112,194,0.05)]">

        <h3 className="text-xl font-black text-slate-800">
          Recent Activity
        </h3>

        <div className="mt-6 space-y-4">

          {activities.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50" // bg-pink-50 से बदलकर सॉफ्ट ब्लू किया गया है
            >
              <div
                className={`h-4 w-4 rounded-full ${item.color}`}
              />

              <div className="flex-1">
                <p className="font-semibold text-slate-700">
                  {item.title}
                </p>
              </div>

              {/* टेक्स्ट कलर को थीम ब्लू में बदला गया है */}
              <span className="font-bold text-[#2570C2]">
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Donut Widget */}
      <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-blue-100 p-8 shadow-[15px_15px_35px_rgba(37,112,194,0.05)]">

        <h3 className="font-black text-slate-800 mb-6">
          Budget Utilization
        </h3>

        <div className="relative flex justify-center">

          <svg className="w-44 h-44 -rotate-90">
            {/* बैकग्राउंड डोनट ट्रैक (लाइट ब्लू) */}
            <circle
              cx="88"
              cy="88"
              r="70"
              stroke="#dbeafe" // सॉफ्ट ब्लू ट्रैक
              strokeWidth="16"
              fill="none"
            />

            {/* डोनट प्रोग्रेस स्ट्रोक (थीम ब्लू) */}
            <circle
              cx="88"
              cy="88"
              r="70"
              stroke="#2570C2" // प्रोग्रेस का रंग बदला गया है
              strokeWidth="16"
              fill="none"
              strokeDasharray="440"
              strokeDashoffset="180"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* प्रतिशत टेक्स्ट का रंग */}
            <h2 className="text-4xl font-black text-[#2570C2]">
              68%
            </h2>

            <span className="text-sm text-slate-500">
              Utilized
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}