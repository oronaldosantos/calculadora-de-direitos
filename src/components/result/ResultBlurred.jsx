import Button from '../ui/Button'
import { formatCurrency } from '../../utils/calcEngine'

function ResultBlurred({ totalEstimado, direitosCount, onRevealClick }) {
  return (
    <div className="card space-y-4">
      <div>
        <p className="text-sm font-semibold text-emerald-700">✅ Calculamos seus direitos!</p>
        <h2 className="mt-1 font-sora text-xl font-bold text-midnight">
          Identificamos {direitosCount} direito(s) trabalhista(s) para você.
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">Valor estimado a receber:</p>
        <p className="mt-2 font-sora text-3xl font-extrabold text-midnight valor-embacado">
          {formatCurrency(totalEstimado)}
        </p>
      </div>

      <Button className="w-full" onClick={onRevealClick}>
        🔓 REVELAR MEUS DIREITOS E VALORES
      </Button>

      <p className="text-sm text-slate-600">
        Informe seus dados e receba o cálculo completo no seu WhatsApp e e-mail.
      </p>
    </div>
  )
}

export default ResultBlurred
