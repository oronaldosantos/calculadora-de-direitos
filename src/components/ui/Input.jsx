import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, helper, className = '', ...props },
  ref,
) {
  return (
    <label className="block">
      {label ? <span className="label">{label}</span> : null}
      <input
        ref={ref}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-neon-blue/30 ${
          error ? 'border-raspberry' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-raspberry">{error}</p> : null}
      {!error && helper ? <p className="helper">{helper}</p> : null}
    </label>
  )
})

export default Input
