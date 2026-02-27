import { useMemo, useState } from 'react'
import AlertBanner from '../ui/AlertBanner'
import Button from '../ui/Button'
import Input from '../ui/Input'
import MonthYearPicker from '../ui/MonthYearPicker'
import Toggle from '../ui/Toggle'
import { BENEFICIOS_GOVERNO } from '../../constants/calcConstants'
import useWizardStore from '../../store/wizardStore'

function normalizarMoeda(valor) {
  if (typeof valor !== 'string') return ''
  const limpo = valor.replace(/[^\d,.-]/g, '')
  if (!limpo) return ''

  const ultimoSeparador = Math.max(limpo.lastIndexOf(','), limpo.lastIndexOf('.'))
  if (ultimoSeparador === -1) {
    return limpo.replace(/\D/g, '')
  }

  const inteiro = limpo.slice(0, ultimoSeparador).replace(/[^\d-]/g, '')
  const decimal = limpo.slice(ultimoSeparador + 1).replace(/\D/g, '')
  return `${inteiro}.${decimal}`
}

function Step3Detalhes({ onBack, onNext }) {
  const respostas = useWizardStore((state) => state.respostas)
  const setResposta = useWizardStore((state) => state.setResposta)
  const toggleBeneficio = useWizardStore((state) => state.toggleBeneficio)
  const [erro, setErro] = useState('')

  const beneficios = useMemo(() => BENEFICIOS_GOVERNO, [])
  const temCarteira = respostas.temCarteira === true

  const handleContinuar = () => {
    if (temCarteira && respostas.registradoPrimeiroDia === false && !respostas.dataRegistro) {
      setErro('Informe o mês/ano de registro na carteira.')
      return
    }
    if (temCarteira && respostas.salarioPorFora && !Number(normalizarMoeda(String(respostas.valorPorFora || '')))) {
      setErro('Informe o valor recebido por fora.')
      return
    }
    setErro('')
    onNext()
  }

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="font-sora text-xl font-bold text-midnight">Detalhes do vínculo</h2>
        <p className="mt-1 text-sm text-slate-600">
          {temCarteira
            ? 'Vamos ajustar informações de registro e salário.'
            : 'Marque se você recebia algum benefício do governo nesse período.'}
        </p>
      </div>

      {temCarteira ? (
        <div className="space-y-4">
          <Toggle
            label="Você foi registrado desde o primeiro dia de trabalho?"
            value={respostas.registradoPrimeiroDia}
            onChange={(valor) => {
              setResposta('registradoPrimeiroDia', valor)
              if (valor) setResposta('dataRegistro', '')
            }}
          />

          {respostas.registradoPrimeiroDia === false ? (
            <MonthYearPicker
              label="Em que mês e ano foi registrado?"
              value={respostas.dataRegistro}
              onChange={(valor) => setResposta('dataRegistro', valor)}
              helper="Use o mês em que a carteira foi assinada."
            />
          ) : null}

          <Toggle
            label="Você recebia valor em dinheiro fora do contracheque?"
            value={respostas.salarioPorFora}
            onChange={(valor) => {
              setResposta('salarioPorFora', valor)
              if (!valor) setResposta('valorPorFora', '')
            }}
          />

          <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            Às vezes chamado de “pagamento por fora” ou “caixa dois”: quando parte do salário é paga em
            espécie e não aparece no recibo.
          </p>

          {respostas.salarioPorFora ? (
            <Input
              label="Quanto recebia por fora por mês? (R$)"
              inputMode="decimal"
              value={respostas.valorPorFora || ''}
              onChange={(event) => setResposta('valorPorFora', normalizarMoeda(event.target.value))}
            />
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          {beneficios.map((beneficio) => (
            <label
              key={beneficio.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-300 bg-white p-3"
            >
              <input
                type="checkbox"
                checked={respostas.beneficiosGoverno?.includes(beneficio.id)}
                onChange={() => toggleBeneficio(beneficio.id)}
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-semibold text-midnight">{beneficio.label}</span>
                {beneficio.explicacao ? (
                  <span className="mt-0.5 block text-xs text-slate-600">{beneficio.explicacao}</span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      )}

      {erro ? <AlertBanner variant="danger">{erro}</AlertBanner> : null}

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={handleContinuar}>Continuar</Button>
      </div>
    </section>
  )
}

export default Step3Detalhes
