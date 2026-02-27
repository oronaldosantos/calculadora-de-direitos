function ProgressBar({ current = 1, total = 1 }) {
  const progresso = Math.min(100, Math.max(0, (current / total) * 100))

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
        <span>
          Etapa {current} de {total}
        </span>
        <span>{Math.round(progresso)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-neon-blue transition-all duration-300 ease-out"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
