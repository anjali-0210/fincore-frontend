import { useOptions } from './useOptions'

const inputCls = 'w-full border rounded px-3 py-2 text-sm'

export default function Field({ field, value, onChange }) {
  const remoteOptions = useOptions(field.endpoint, field.type === 'remote')

  const label = (
    <label className="block text-sm font-medium mb-1">
      {field.label}{field.required && <span className="text-rose-500"> *</span>}
    </label>
  )

  if (field.type === 'textarea') {
    return (
      <div>
        {label}
        <textarea className={inputCls} rows={2} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div>
        {label}
        <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">— select —</option>
          {field.options.map((o) => (
            <option key={o} value={o}>{String(o).replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'remote') {
    return (
      <div>
        {label}
        <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">— select —</option>
          {remoteOptions.map((o) => (
            <option key={o.id} value={o.id}>{o[field.optionLabel] || `#${o.id}`}</option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'file') {
    return (
      <div>
        {label}
        <input type="file" className={inputCls} accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onChange(e.target.files[0] || null)} />
      </div>
    )
  }

  return (
    <div>
      {label}
      <input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        step={field.type === 'number' ? 'any' : undefined}
        className={inputCls}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
