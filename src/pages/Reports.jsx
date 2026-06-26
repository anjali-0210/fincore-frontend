import { useEffect, useState } from 'react'
import api from '../api/client'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts'

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Reports() {
  const [companies, setCompanies] = useState([])
  const [companyId, setCompanyId] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [monthly, setMonthly] = useState([])
  const [byCategory, setByCategory] = useState([])
  const [clientWise, setClientWise] = useState([])
  const [cashFlow, setCashFlow] = useState(null)

  useEffect(() => {
    api.get('/companies', { params: { per_page: 100 } })
      .then(({ data }) => setCompanies(data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const p = companyId ? { company_id: companyId } : {}
    api.get('/reports/monthly', { params: { ...p, year } })
      .then(({ data }) => {
        const rows = (data.data || data).rows || []
        setMonthly(rows.map((r) => ({ ...r, name: months[r.month - 1] })))
      }).catch(() => {})
    api.get('/reports/expense-by-category', { params: p })
      .then(({ data }) => setByCategory((data.data || data).rows || [])).catch(() => {})
    api.get('/reports/client-wise', { params: p })
      .then(({ data }) => setClientWise((data.data || data).rows || [])).catch(() => {})
    api.get('/reports/cash-flow', { params: p })
      .then(({ data }) => setCashFlow(data.data || data)).catch(() => {})
  }, [companyId, year])

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold">Reports</h1>
        <div className="flex gap-2">
          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm bg-white">
            <option value="">All companies</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded px-3 py-1.5 text-sm bg-white">
            {[0,1,2,3].map((d) => {
              const y = new Date().getFullYear() - d
              return <option key={y} value={y}>{y}</option>
            })}
          </select>
        </div>
      </div>

      {cashFlow && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-sm text-slate-500">Cash In</div>
            <div className="text-xl font-bold text-emerald-600">{inr(cashFlow.cash_in)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-sm text-slate-500">Cash Out</div>
            <div className="text-xl font-bold text-rose-600">{inr(cashFlow.cash_out)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-sm text-slate-500">Net Cash Flow</div>
            <div className={`text-xl font-bold ${cashFlow.net_cash_flow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {inr(cashFlow.net_cash_flow)}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h2 className="font-semibold mb-3">Income vs Expense — {year}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => inr(v)} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expense" fill="#f43f5e" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-3">Expense by Category</h2>
          <SimpleTable rows={byCategory} cols={[['category','Category'],['total','Total','money']]} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold mb-3">Outstanding by Client</h2>
          <SimpleTable rows={clientWise} cols={[['client','Client'],['outstanding','Outstanding','money']]} />
        </div>
      </div>
    </div>
  )
}

function SimpleTable({ rows, cols }) {
  if (!rows || rows.length === 0) return <div className="text-sm text-slate-400">No data.</div>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-slate-500 border-b">
          {cols.map((c) => <th key={c[0]} className={`py-2 ${c[2] === 'money' ? 'text-right' : ''}`}>{c[1]}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b last:border-0">
            {cols.map((c) => (
              <td key={c[0]} className={`py-2 ${c[2] === 'money' ? 'text-right font-medium' : ''}`}>
                {c[2] === 'money' ? inr(r[c[0]]) : (r[c[0]] ?? '—')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
