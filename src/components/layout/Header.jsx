function Header() {
  return (
    <header className="bg-midnight text-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="font-sora text-lg font-bold tracking-tight">Jianoti Advocacia Trabalhista</p>
          <p className="text-xs text-slate-300 sm:text-sm">Calculadora de Direitos Trabalhistas</p>
        </div>
        <span className="rounded-full bg-neon-blue px-3 py-1 text-xs font-semibold">Grátis</span>
      </div>
    </header>
  )
}

export default Header
