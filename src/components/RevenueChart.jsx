export default function RevenueChart() {
  return (
    <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-pink-100 p-8 shadow-[15px_15px_35px_rgba(236,72,153,0.08),-10px_-10px_30px_rgba(255,255,255,0.9)]">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800">
            Revenue Analytics
          </h3>

          <p className="text-slate-500 text-sm">
            Revenue growth over time
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-pink-50 text-pink-600 font-bold text-sm">
          +24%
        </div>
      </div>

      <div className="h-80">
        <svg
          viewBox="0 0 800 300"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="pinkGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0 240 C100 180 180 200 260 130 C340 80 420 120 500 70 C580 30 650 100 800 40"
            fill="none"
            stroke="#ec4899"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <path
            d="M0 240 C100 180 180 200 260 130 C340 80 420 120 500 70 C580 30 650 100 800 40 L800 300 L0 300 Z"
            fill="url(#pinkGradient)"
          />
        </svg>
      </div>
    </div>
  );
}