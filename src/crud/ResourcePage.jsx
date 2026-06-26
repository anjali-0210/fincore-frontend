import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'
import { useOptions } from './useOptions'
import Field from './Field'

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })

const badgeColor = (s) => ({
  paid: 'bg-emerald-100 text-emerald-700',
  partial: 'bg-amber-100 text-amber-700',
  pending: 'bg-slate-100 text-slate-600',
  overdue: 'bg-rose-100 text-rose-700',
  sent: 'bg-emerald-100 text-emerald-700',
  dismissed: 'bg-slate-100 text-slate-500',
}[s] || 'bg-slate-100 text-slate-600')

function renderCell(col, row) {
  const [key, , kind] = col
  let val = typeof kind === 'function' ? kind(row) : row[key]
  if (typeof col[2] === 'function') val = col[2](row)
  if (kind === 'money') return inr(row[key])
  if (kind === 'badge') {
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor(row[key])}`}>{row[key]}</span>
  }
  return val ?? '—'
}

export default function ResourcePage({ config }) {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [companyFilter, setCompanyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [payFor, setPayFor] = useState(null)

  const companies = useOptions('/companies', true)

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, per_page: 15 }
    if (companyFilter) params.company_id = companyFilter
    if (statusFilter) params.status = statusFilter
    api.get(config.endpoint, { params })
      .then(({ data }) => { setRows(data.data || []); setMeta(data.meta || null) })
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [config.endpoint, page, companyFilter, statusFilter])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    const init = {}
    config.fields.forEach((f) => { if (f.default) init[f.name] = f.default })
    setForm(init); setEditing(null); setError(''); setModalOpen(true)
  }

  const openEdit = (row) => {
    const init = {}
    config.fields.forEach((f) => {
      if (f.type === 'file') return
      init[f.name] = row[f.name] ?? ''
    })
    setForm(init); setEditing(row); setError(''); setModalOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      let body = form
      let headers = {}
      if (config.multipart) {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => {
          if (v !== null && v !== undefined && v !== '') fd.append(k, v)
        })
        if (editing) fd.append('_method', 'PUT')
        body = fd
        headers['Content-Type'] = 'multipart/form-data'
      }
      if (editing) {
        if (config.multipart) {
          await api.post(`${config.endpoint}/${editing.id}`, body, { headers })
        } else {
          await api.put(`${config.endpoint}/${editing.id}`, body)
        }
      } else {
        await api.post(config.endpoint, body, { headers })
      }
      setModalOpen(false); load()
    } catch (err) {
      const e = err.response?.data
      setError(e?.message ? `${e.message}` : 'Save failed.')
    } finally { setSaving(false) }
  }

  const remove = async (row) => {
    if (!confirm('Delete this record?')) return
    try { await api.delete(`${config.endpoint}/${row.id}`); load() }
    catch { alert('Delete failed (you may not have permission).') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">{config.title}</h1>
        <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded">
          + New
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select value={companyFilter} onChange={(e) => { setPage(1); setCompanyFilter(e.target.value) }}
          className="border rounded px-3 py-1.5 text-sm bg-white">
          <option value="">All companies</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {config.statusFilter && (
          <select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value) }}
            className="border rounded px-3 py-1.5 text-sm bg-white">
            <option value="">All statuses</option>
            {config.statusFilter.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b bg-slate-50">
              {config.columns.map((c) => (
                <th key={c[0]} className={`py-2.5 px-4 ${c[2] === 'money' ? 'text-right' : ''}`}>{c[1]}</th>
              ))}
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={config.columns.length + 1} className="py-8 text-center text-slate-400">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={config.columns.length + 1} className="py-8 text-center text-slate-400">No records.</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0 hover:bg-slate-50">
                {config.columns.map((c) => (
                  <td key={c[0]} className={`py-2.5 px-4 ${c[2] === 'money' ? 'text-right' : ''}`}>{renderCell(c, row)}</td>
                ))}
                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                  {config.addPayment && (
                    <button onClick={() => setPayFor(row)} className="text-emerald-600 hover:underline mr-3">Pay</button>
                  )}
                  <button onClick={() => openEdit(row)} className="text-indigo-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => remove(row)} className="text-rose-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-slate-500">Page {meta.current_page} of {meta.last_page} • {meta.total} total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded border bg-white disabled:opacity-50">Prev</button>
            <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded border bg-white disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-6 z-20 overflow-y-auto">
          <form onSubmit={save} className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 my-8">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'New'} {config.title.replace(/s$/, '')}</h2>
            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 rounded p-2">{error}</div>}
            <div className="grid grid-cols-2 gap-3">
              {config.fields.map((f) => (
                <div key={f.name} className={f.type === 'textarea' ? 'col-span-2' : ''}>
                  <Field field={f} value={form[f.name]} onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded border">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded bg-indigo-600 text-white disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add-payment modal (income only) */}
      {payFor && <PaymentModal income={payFor} onClose={() => setPayFor(null)} onSaved={() => { setPayFor(null); load() }} />}
    </div>
  )
}

function PaymentModal({ income, onClose, onSaved }) {
  const [form, setForm] = useState({ amount: '', paid_on: new Date().toISOString().slice(0, 10), payment_mode: '', reference: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      await api.post(`/incomes/${income.id}/payments`, form)
      onSaved()
    } catch (err) { setError(err.response?.data?.message || 'Failed.') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-30">
      <form onSubmit={save} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-1">Record Payment</h2>
        <p className="text-sm text-slate-500 mb-4">Invoice {income.invoice_no || `#${income.id}`} • Pending {inr(income.pending_amount)}</p>
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 rounded p-2">{error}</div>}
        <label className="block text-sm font-medium mb-1">Amount *</label>
        <input type="number" step="any" required className="w-full border rounded px-3 py-2 mb-3 text-sm"
          value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} />
        <label className="block text-sm font-medium mb-1">Paid On *</label>
        <input type="date" required className="w-full border rounded px-3 py-2 mb-3 text-sm"
          value={form.paid_on} onChange={(e) => setForm((s) => ({ ...s, paid_on: e.target.value }))} />
        <label className="block text-sm font-medium mb-1">Mode</label>
        <select className="w-full border rounded px-3 py-2 mb-3 text-sm"
          value={form.payment_mode} onChange={(e) => setForm((s) => ({ ...s, payment_mode: e.target.value }))}>
          <option value="">—</option>
          {['cash','bank_transfer','upi','cheque','card','other'].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded border">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded bg-emerald-600 text-white disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Payment'}
          </button>
        </div>
      </form>
    </div>
  )
}
