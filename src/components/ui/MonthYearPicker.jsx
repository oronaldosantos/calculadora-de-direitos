function MonthYearPicker({ label, value, onChange, disabled = false, min, max, helper }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        type="month"
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-neon-blue/30"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        min={min}
        max={max}
      />
      {helper ? <p className="helper">{helper}</p> : null}
    </label>
  )
}

export default MonthYearPicker
