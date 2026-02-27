function Rightslist({ direitos = [] }) {
  return (
    <section className="card">
      <h3 className="font-sora text-lg font-bold text-midnight">Direitos identificados</h3>
      <div className="mt-4 grid gap-3">
        {direitos.length ? (
          direitos.map((direito) => (
            <div key={direito} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
              <p className="font-semibold text-emerald-800">✅ {direito}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">
            Não identificamos verbas monetárias com os dados informados, mas pode haver direitos
            específicos que dependem de documentos.
          </p>
        )}
      </div>
    </section>
  )
}

export default Rightslist
