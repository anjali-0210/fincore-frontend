const activities = [
  {
    title: "Invoice Paid",
    amount: "₹15,000",
    color: "bg-emerald-500",
  },
  {
    title: "New Company Added",
    amount: "Today",
    color: "bg-pink-500",
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

      <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-pink-100 p-6 shadow-[15px_15px_35px_rgba(236,72,153,0.08)]">

        <h3 className="text-xl font-black text-slate-800">
          Recent Activity
        </h3>

        <div className="mt-6 space-y-4">

          {activities.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl bg-pink-50"
            >
              <div
                className={`h-4 w-4 rounded-full ${item.color}`}
              />

              <div className="flex-1">
                <p className="font-semibold text-slate-700">
                  {item.title}
                </p>
              </div>

              <span className="font-bold text-pink-600">
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Donut Widget */}

      <div className="rounded-[32px] bg-white/70 backdrop-blur-xl border border-pink-100 p-8 shadow-[15px_15px_35px_rgba(236,72,153,0.08)]">

        <h3 className="font-black text-slate-800 mb-6">
          Budget Utilization
        </h3>

        <div className="relative flex justify-center">

          <svg className="w-44 h-44 -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="70"
              stroke="#fce7f3"
              strokeWidth="16"
              fill="none"
            />

            <circle
              cx="88"
              cy="88"
              r="70"
              stroke="#ec4899"
              strokeWidth="16"
              fill="none"
              strokeDasharray="440"
              strokeDashoffset="180"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-black text-pink-600">
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