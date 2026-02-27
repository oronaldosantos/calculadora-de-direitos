import Button from '../ui/Button'
import Select from '../ui/Select'
import Toggle from '../ui/Toggle'
import Tooltip from '../ui/Tooltip'
import { HORAS_EXTRAS_FAIXAS, HORAS_NOTURNAS_FAIXAS } from '../../constants/calcConstants'
import useWizardStore from '../../store/wizardStore'

function Step5Jornada({ onBack, onNext }) {
  const respostas = useWizardStore((state) => state.respostas)
  const setResposta = useWizardStore((state) => state.setResposta)

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="font-sora text-xl font-bold text-midnight">Jornada de trabalho</h2>
        <p className="mt-1 text-sm text-slate-600">
          Informe sua rotina para calcular horas extras e adicionais.
        </p>
      </div>

      <Toggle
        label="Você fazia horas extras?"
        value={respostas.fazHorasExtras}
        onChange={(valor) => {
          setResposta('fazHorasExtras', valor)
          if (!valor) setResposta('horasExtrasSemana', '')
        }}
      />

      {respostas.fazHorasExtras ? (
        <Select
          label="Quantas horas extras por semana, em média?"
          value={respostas.horasExtrasSemana || ''}
          onChange={(event) => setResposta('horasExtrasSemana', event.target.value)}
          options={[
            { value: '', label: 'Selecione uma faixa' },
            ...HORAS_EXTRAS_FAIXAS.map((item) => ({ value: item.id, label: item.label })),
          ]}
        />
      ) : null}

      <Toggle
        label="Você trabalhava no período da noite?"
        value={respostas.trabalhaNoturno}
        onChange={(valor) => {
          setResposta('trabalhaNoturno', valor)
          if (!valor) setResposta('horasNoturnas', '')
        }}
      />

      {respostas.trabalhaNoturno ? (
        <Select
          label="Quantas horas por noite, em média?"
          value={respostas.horasNoturnas || ''}
          onChange={(event) => setResposta('horasNoturnas', event.target.value)}
          options={[
            { value: '', label: 'Selecione uma faixa' },
            ...HORAS_NOTURNAS_FAIXAS.map((item) => ({ value: item.id, label: item.label })),
          ]}
          helper="Trabalho noturno entre 22h e 5h costuma gerar adicional de 20%."
        />
      ) : null}

      <Toggle
        label="Você trabalhava aos domingos ou feriados?"
        value={respostas.trabalhaDomingo}
        onChange={(valor) => setResposta('trabalhaDomingo', valor)}
      />

      <Tooltip content="Trabalhar no domingo ou feriado sem folga compensatória pode dar direito a pagamento em dobro.">
        <span className="text-xs text-neon-blue underline decoration-dashed">
          Entenda domingos e feriados
        </span>
      </Tooltip>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext}>Ver resultado</Button>
      </div>
    </section>
  )
}

export default Step5Jornada
