function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue/70 disabled:cursor-not-allowed disabled:opacity-60'

  const styles = {
    primary: 'bg-neon-blue text-white hover:bg-violet',
    secondary: 'bg-white text-midnight border border-slate-300 hover:bg-slate-100',
    ghost: 'bg-transparent text-neon-blue hover:bg-neon-blue/10',
    danger: 'bg-raspberry text-white hover:opacity-90',
  }

  return (
    <button
      type={type}
      className={`${base} ${styles[variant] || styles.primary} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
