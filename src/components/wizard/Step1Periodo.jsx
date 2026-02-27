import { useMemo, useState } from 'react'
import AlertBanner from '../ui/AlertBanner'
import Button from '../ui/Button'
import Input from '../ui/Input'
import MonthYearPicker from '../ui/MonthYearPicker'
import Select from '../ui/Select'
import { FUNCOES } from '../../constants/calcConstants'
import useWizardStore from '../../store/wizardStore'
import { verificarPrescricao } from '../../utils/dateUtils'

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

function Step1Periodo({ onNext, onIrPrescricao }) {
  const respostas = useWizardStore((state) => state.respostas)
  const setResposta = useWizardStore((state) => state.setResposta)
  const setPrescricao = useWizardStore((state) => state.setPrescricao)
  const [erro, setErro] = useState('')

  const gruposFuncoes = useMemo(
    () =>
      FUNCOES.map((grupo) => ({
        label: grupo.grupo,
        options: grupo.funcoes.map((funcao) => ({
          value: funcao.id,
          label: funcao.label,
        })),
      })),
    [],
  )

  const prescricaoInfo = useMemo(() => {
    if (respostas.aindaTrabalhando || !respostas.dataSaida) {
      return { status: 'ok', mesesDesdeSaida: 0 }
    }
    return verificarPrescricao(respostas.dataSaida)
  }, [respostas.aindaTrabalhando, respostas.dataSaida])

  const handleContinuar = () => {
    const salarioNumero = Number(normalizarMoeda(String(respostas.salario || '')))
    if (!respostas.dataInicio || (!respostas.aindaTrabalhando && !respostas.dataSaida) || !respostas.funcaoId || !salarioNumero) {
      setErro('Preencha início, função, salário e data de saída (ou marque que ainda trabalha).')
      return
    }

    if (!respostas.aindaTrabalhando && prescricaoInfo.status === 'prescrito') {
      setPrescricao('prescrito', prescricaoInfo.mesesDesdeSaida)
      onIrPrescricao()
      return
    }

    setPrescricao(prescricaoInfo.status, prescricaoInfo.mesesDesdeSaida)
    setErro('')
    onNext()
  }

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="font-sora text-xl font-bold text-midnight">Período de trabalho</h2>
        <p className="mt-1 text-sm text-slate-600">
          Preencha os dados básicos do emprego para calcular seus direitos.
        </p>
      </div>

      <MonthYearPicker
        label="Mês e ano de início"
        value={respostas.dataInicio}
        onChange={(valor) => setResposta('dataInicio', valor)}
      />

      <div className="rounded-xl border border-slate-300 bg-slate-50 p-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(respostas.aindaTrabalhando)}
            onChange={(event) => {
              const ativo = event.target.checked
              setResposta('aindaTrabalhando', ativo)
              if (ativo) {
                setResposta('dataSaida', '')
                setPrescricao('ok', 0)
              }
            }}
          />
          Ainda estou trabalhando nesse emprego
        </label>
      </div>

      {!respostas.aindaTrabalhando ? (
        <MonthYearPicker
          label="Mês e ano de saída"
          value={respostas.dataSaida}
          onChange={(valor) => {
            setResposta('dataSaida', valor)
            const info = verificarPrescricao(valor)
            setPrescricao(info.status, info.mesesDesdeSaida)
          }}
        />
      ) : null}

      {prescricaoInfo.status === 'alerta' ? (
        <AlertBanner variant="warning" title="Atenção: seu prazo está acabando">
          Você tem até 2 anos após sair do emprego para entrar com ação na Justiça do Trabalho.
        </AlertBanner>
      ) : null}

      <Select
        label="Função / profissão"
        value={respostas.funcaoId || ''}
        onChange={(event) => setResposta('funcaoId', event.target.value)}
        options={[{ value: '', label: 'Selecione sua função' }]}
        groups={gruposFuncoes}
      />

      <Input
        label="Salário mensal (R$)"
        inputMode="decimal"
        placeholder="Ex: 2.500,00"
        value={respostas.salario || ''}
        onChange={(event) => setResposta('salario', normalizarMoeda(event.target.value))}
        helper="Aceita vírgula ou ponto."
      />

      {erro ? <AlertBanner variant="danger">{erro}</AlertBanner> : null}

      <div className="flex justify-end">
        <Button onClick={handleContinuar}>Continuar</Button>
      </div>
    </section>
  )
}

export default Step1Periodo
