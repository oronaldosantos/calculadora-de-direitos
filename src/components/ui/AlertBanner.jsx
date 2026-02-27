const styles = {
  info: 'border-neon-blue/30 bg-neon-blue/10 text-midnight',
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
  danger: 'border-raspberry/30 bg-raspberry/10 text-raspberry',
}

function AlertBanner({ variant = 'info', title, children }) {
  return (
    <div className={`rounded-2xl border p-4 text-sm ${styles[variant] || styles.info}`}>
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}

export default AlertBanner
