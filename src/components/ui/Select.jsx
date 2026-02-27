function Select({ label, error, helper, options = [], groups = [], className = '', ...props }) {
  return (
    <label className="block">
      {label ? <span className="label">{label}</span> : null}
      <select
        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-neon-blue/30 ${
          error ? 'border-raspberry' : 'border-slate-300'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-raspberry">{error}</p> : null}
      {!error && helper ? <p className="helper">{helper}</p> : null}
    </label>
  )
}

export default Select
