import { useEffect, useState } from 'react'
import api from '../api/client'

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })

function Stat({ label, value, accent }) {
  // Color code dynamically maps based on the accent prop
  let iconBg = "bg-slate-50"
  let iconColor = "text-slate-500"
  
  if (accent?.includes("emerald")) {
    iconBg = "bg-emerald-50"
    iconColor = "text-emerald-600"
  } else if (accent?.includes("rose")) {
    iconBg = "bg-rose-50"
    iconColor = "text-rose-600"
  } else if (accent?.includes("amber")) {
    iconBg = "bg-amber-50"
    iconColor = "text-amber-600"
  } else {
    iconBg = "bg-blue-50"
    iconColor = "text-[#1a5fb4]"
  }

  // Icons derived from labels
  const getIcon = () => {
    if (label.includes("Income")) return "📥"
    if (label.includes("Expenses")) return "📤"
    if (label.includes("Profit")) return "📈"
    if (label.includes("Receivables")) return "💵"
    if (label.includes("Payables")) return "💸"
    return "🏢"
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
        <div className={`text-2xl font-bold ${accent || 'text-[#0c2340]'}`}>{value}</div>
      </div>
      <div className={`p-3.5 rounded-xl ${iconBg} ${iconColor} text-xl leading-none`}>
        {getIcon()}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [companies, setCompanies] = useState([])
  const [companyId, setCompanyId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/companies', { params: { per_page: 100 } })
      .then(({ data }) => setCompanies(data.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get('/dashboard', { params: companyId ? { company_id: companyId } : {} })
      .then(({ data }) => setData(data.data || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [companyId])

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="animate-spin rounded-full h-9 w-9 border-4 border-[#1a5fb4] border-t-transparent"></div>
        <div className="text-sm font-medium text-slate-500">Loading dashboard...</div>
      </div>
    )
  }
  
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-2">📂</span>
        <div className="text-base font-semibold text-[#0c2340]">No data.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Head & Select container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0c2340]">Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time business financial metrics</p>
        </div>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a5fb4]/20 focus:border-[#1a5fb4] transition-all duration-200 shadow-sm sm:w-60"
        >
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Grid for stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Total Income" value={inr(data.total_income)} accent="text-emerald-600" />
        <Stat label="Total Expenses" value={inr(data.total_expenses)} accent="text-rose-600" />
        <Stat label="Profit / Loss" value={inr(data.profit_loss)}
          accent={data.profit_loss >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
        <Stat label="Pending Receivables" value={inr(data.pending_receivables)} accent="text-amber-600" />
        <Stat label="Pending Payables" value={inr(data.pending_payables)} accent="text-amber-600" />
        <Stat label="Companies" value={(data.company_wise_summary || []).length} />
      </div>

      {/* Lists Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-[#0c2340]">Today's Due Payments</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-50 text-rose-600 rounded">Today</span>
          </div>
          <DueList rows={data.today_due_payments} />
        </div>
        
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-[#0c2340]">Upcoming Due Payments (7 days)</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#1a5fb4]/5 text-[#1a5fb4] rounded">7 Days</span>
          </div>
          <DueList rows={data.upcoming_due_payments} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-[#0c2340]">Company-wise Summary</h2>
          <span className="text-[11px] font-semibold text-slate-400">Total: {(data.company_wise_summary || []).length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-2">Company</th>
                <th className="py-3 px-2 text-right">Income</th>
                <th className="py-3 px-2 text-right">Expense</th>
                <th className="py-3 px-2 text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {(data.company_wise_summary || []).map((c) => (
                <tr key={c.company_id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3 px-2 font-semibold text-slate-700 group-hover:text-[#1a5fb4] transition-colors">{c.company}</td>
                  <td className="py-3 px-2 text-right text-emerald-600 font-medium">{inr(c.income)}</td>
                  <td className="py-3 px-2 text-right text-rose-600 font-medium">{inr(c.expense)}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      c.profit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {inr(c.profit)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DueList({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="text-sm text-slate-400 py-8 text-center border border-dashed border-slate-100 rounded-2xl">
        🎉 Nothing due.
      </div>
    )
  }
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center transition-colors">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-[#1a5fb4]/10 text-[#1a5fb4] rounded-lg text-xs font-bold">
              PAY
            </span>
            <span className="font-medium text-slate-700 text-sm">{r.title}</span>
          </div>
          <span className="font-bold text-[#0c2340] bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm text-xs">
            {inr((r.amount || 0) - (r.paid_amount || 0))}
          </span>
        </li>
      ))}
    </ul>
  )
}