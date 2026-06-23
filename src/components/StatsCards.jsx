const stats = [
  {
    title: "Total Revenue",
    value: "₹4,52,318",
    change: "+12.5%",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Expenses",
    value: "₹2,10,450",
    change: "+4.2%",
    color: "from-orange-400 to-pink-500",
  },
  {
    title: "Net Profit",
    value: "₹2,41,868",
    change: "+18.3%",
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    title: "Receivables",
    value: "₹85,400",
    change: "+8.9%",
    color: "from-rose-400 to-red-500",
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((card, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-[30px] bg-white/70 backdrop-blur-xl border border-pink-100 p-6 shadow-[15px_15px_35px_rgba(236,72,153,0.08),-10px_-10px_30px_rgba(255,255,255,0.9)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300"
        >
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
              <span className="text-emerald-600 font-bold">
                {card.change}
              </span>

              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.color}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}