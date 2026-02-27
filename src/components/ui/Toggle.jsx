function Toggle({ label, value, onChange, trueLabel = 'Sim', falseLabel = 'Não' }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            value === true
              ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
              : 'border-slate-300 bg-white text-midnight hover:bg-slate-100'
          }`}
        >
          {trueLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            value === false
              ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
              : 'border-slate-300 bg-white text-midnight hover:bg-slate-100'
          }`}
        >
          {falseLabel}
        </button>
      </div>
    </div>
  )
}

export default Toggle
