import { formatCurrency } from '../../utils/calcEngine'

function CalcTable({ verbas = [], totalEstimado = 0, badge = '' }) {
  return (
    <section className="card overflow-hidden">
      <h3 className="font-sora text-lg font-bold text-midnight">Tabela de cálculo</h3>
      {badge ? (
        <p className="mt-2 inline-flex rounded-full bg-neon-blue/10 px-3 py-1 text-xs font-semibold text-neon-blue">
          {badge}
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="py-2 pr-3 font-semibold">O que você tem direito</th>
              <th className="py-2 pr-3 font-semibold">Como calculamos</th>
              <th className="py-2 text-right font-semibold">Valor estimado</th>
            </tr>
          </thead>
          <tbody>
            {verbas.map((verba) => (
              <tr key={verba.id} className="border-b border-slate-100 align-top">
                <td className="py-3 pr-3 font-medium text-midnight">{verba.descricao}</td>
                <td className="py-3 pr-3 text-slate-600">{verba.base}</td>
                <td
                  className={`py-3 text-right font-semibold ${
                    verba.tipo === 'debito' ? 'text-clay' : 'text-midnight'
                  }`}
                >
                  {formatCurrency(verba.valor)}
                </td>
              </tr>
            ))}
            <tr className="bg-neon-blue/10">
              <td className="py-3 pr-3 font-sora text-base font-bold text-midnight">Total estimado</td>
              <td className="py-3 pr-3" />
              <td className="py-3 text-right font-sora text-lg font-extrabold text-neon-blue">
                {formatCurrency(totalEstimado)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-600">
        Esses valores são estimativas com base nos dados que você forneceu. O valor real pode variar
        conforme documentos e detalhes do caso.
      </p>
    </section>
  )
}

export default CalcTable
