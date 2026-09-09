import { useEffect, useState } from 'react'
import api from '../api/client'

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })

function Stat({ label, value, accent }) {
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
  // By default Current Month (YYYY-MM format)
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))
  
  const [dashboardRaw, setDashboardRaw] = useState(null)
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/companies', { params: { per_page: 100 } })
      .then(({ data }) => setCompanies(data.data || []))
      .catch(() => {})
  }, [])

  // Incomes aur Expenses fetch karenge month filtering ke liye
  useEffect(() => {
    setLoading(true)

    const p1 = api.get('/dashboard', { params: companyId ? { company_id: companyId } : {} })
    const p2 = api.get('/incomes', { params: { per_page: 5000, ...(companyId ? { company_id: companyId } : {}) } }).catch(() => ({ data: [] }))
    const p3 = api.get('/expenses', { params: { per_page: 5000, ...(companyId ? { company_id: companyId } : {}) } }).catch(() => ({ data: [] }))

    Promise.all([p1, p2, p3])
      .then(([dashRes, incRes, expRes]) => {
        setDashboardRaw(dashRes.data?.data || dashRes.data)
        setIncomes(incRes.data?.data || incRes.data || [])
        setExpenses(expRes.data?.data || expRes.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [companyId])

  // Helper date extractor (kisi bhi column me date ho usko YYYY-MM match karega)
  const isRowInMonth = (row, monthStr) => {
    const d = row.date || row.received_date || row.expense_date || row.created_at
    if (!d) return false
    return String(d).startsWith(monthStr)
  }

  // Current selected month ke basis pe calculate karna
  const filteredIncomes = incomes.filter(item => isRowInMonth(item, selectedMonth))
  const filteredExpenses = expenses.filter(item => isRowInMonth(item, selectedMonth))

  const totalIncome = filteredIncomes.reduce((sum, item) => sum + Number(item.received_amount || item.amount || 0), 0)
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const profitLoss = totalIncome - totalExpenses

  // Selected month ke hisab se company wise calculation
  const companySummary = (companies || [])
    .filter(c => !companyId || String(c.id) === String(companyId))
    .map(c => {
      const cIncomes = filteredIncomes.filter(i => String(i.company_id) === String(c.id))
      const cExpenses = filteredExpenses.filter(e => String(e.company_id) === String(c.id))

      const cInc = cIncomes.reduce((sum, i) => sum + Number(i.received_amount || i.amount || 0), 0)
      const cExp = cExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)

      return {
        company_id: c.id,
        company: c.name,
        income: cInc,
        expense: cExp,
        profit: cInc - cExp
      }
    })

  if (loading && !dashboardRaw) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="animate-spin rounded-full h-9 w-9 border-4 border-[#1a5fb4] border-t-transparent"></div>
        <div className="text-sm font-medium text-slate-500">Loading dashboard...</div>
      </div>
    )
  }
  
  if (!dashboardRaw) {
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
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Filter */}
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a5fb4]/20 focus:border-[#1a5fb4] transition-all duration-200 shadow-sm cursor-pointer"
          />

          {/* Company Filter */}
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a5fb4]/20 focus:border-[#1a5fb4] transition-all duration-200 shadow-sm sm:w-56"
          >
            <option value="">All companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid for stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Total Income" value={inr(totalIncome)} accent="text-emerald-600" />
        <Stat label="Total Expenses" value={inr(totalExpenses)} accent="text-rose-600" />
        <Stat label="Profit / Loss" value={inr(profitLoss)}
          accent={profitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
        <Stat label="Pending Receivables" value={inr(dashboardRaw.pending_receivables)} accent="text-amber-600" />
        <Stat label="Pending Payables" value={inr(dashboardRaw.pending_payables)} accent="text-amber-600" />
        <Stat label="Companies" value={companySummary.length} />
      </div>

      {/* Lists Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-[#0c2340]">Today's Due Payments</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-50 text-rose-600 rounded">Today</span>
          </div>
          <DueList rows={dashboardRaw.today_due_payments} />
        </div>
        
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-[#0c2340]">Upcoming Due Payments (7 days)</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#1a5fb4]/5 text-[#1a5fb4] rounded">7 Days</span>
          </div>
          <DueList rows={dashboardRaw.upcoming_due_payments} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-[#0c2340]">Company-wise Summary</h2>
          <span className="text-[11px] font-semibold text-slate-400">Total: {companySummary.length} items</span>
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
              {companySummary.map((c) => (
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