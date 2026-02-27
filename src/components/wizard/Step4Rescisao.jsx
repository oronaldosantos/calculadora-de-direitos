import Button from '../ui/Button'
import Select from '../ui/Select'
import Tooltip from '../ui/Tooltip'
import { AVISO_PREVIO_OPTIONS, MOTIVOS_RESCISAO } from '../../constants/calcConstants'
import useWizardStore from '../../store/wizardStore'

function Step4Rescisao({ onBack, onNext }) {
  const respostas = useWizardStore((state) => state.respostas)
  const setResposta = useWizardStore((state) => state.setResposta)

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="font-sora text-xl font-bold text-midnight">Rescisão do contrato</h2>
        <p className="mt-1 text-sm text-slate-600">Esses dados ajudam a definir quais verbas se aplicam.</p>
      </div>

      <Select
        label="Motivo da saída"
        value={respostas.motivoRescisao || ''}
        onChange={(event) => setResposta('motivoRescisao', event.target.value)}
        options={[
          { value: '', label: 'Selecione uma opção' },
          ...MOTIVOS_RESCISAO.map((item) => ({ value: item.id, label: item.label })),
        ]}
      />

      <Select
        label="Você cumpriu/trabalhou o aviso prévio?"
        value={respostas.cumpriuAviso || ''}
        onChange={(event) => setResposta('cumpriuAviso', event.target.value)}
        options={[
          { value: '', label: 'Selecione uma opção' },
          ...AVISO_PREVIO_OPTIONS.map((item) => ({ value: item.id, label: item.label })),
        ]}
        helper="Aviso prévio é o período em que você continua trabalhando antes do desligamento final."
      />

      <Tooltip content="Aviso prévio é o período de 30 dias (ou mais) para a empresa se organizar após a saída.">
        <span className="text-xs text-neon-blue underline decoration-dashed">O que é aviso prévio?</span>
      </Tooltip>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext} disabled={!respostas.motivoRescisao || !respostas.cumpriuAviso}>
          Continuar
        </Button>
      </div>
    </section>
  )
}

export default Step4Rescisao
