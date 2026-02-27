import AlertBanner from '../ui/AlertBanner'
import Button from '../ui/Button'
import useWizardStore from '../../store/wizardStore'

function CardOpcao({ ativo, onClick, titulo, descricao }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        ativo
          ? 'border-neon-blue bg-neon-blue/10 ring-2 ring-neon-blue/20'
          : 'border-slate-300 bg-white hover:border-neon-blue/40'
      }`}
    >
      <p className="font-semibold text-midnight">{titulo}</p>
      <p className="mt-1 text-sm text-slate-600">{descricao}</p>
    </button>
  )
}

function Step2Vinculo({ onBack, onNext }) {
  const temCarteira = useWizardStore((state) => state.respostas.temCarteira)
  const setResposta = useWizardStore((state) => state.setResposta)

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="font-sora text-xl font-bold text-midnight">Vínculo empregatício</h2>
        <p className="mt-1 text-sm text-slate-600">Você tinha carteira assinada nesse emprego?</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <CardOpcao
          ativo={temCarteira === true}
          onClick={() => setResposta('temCarteira', true)}
          titulo="✅ Sim, tinha carteira assinada"
          descricao="Seguir com o cálculo de verbas com vínculo formal."
        />
        <CardOpcao
          ativo={temCarteira === false}
          onClick={() => setResposta('temCarteira', false)}
          titulo="📋 Não, trabalhava sem carteira"
          descricao="Você também pode calcular todos os direitos."
        />
      </div>

      {temCarteira === false ? (
        <AlertBanner variant="info" title="🔵 Mesmo sem carteira, você tem os mesmos direitos!">
          A lei brasileira garante FGTS, férias, 13º, horas extras e muito mais, mesmo sem registro. Na
          Justiça do Trabalho, você pode pedir tudo isso junto com o reconhecimento do vínculo.
        </AlertBanner>
      ) : null}

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext} disabled={temCarteira === null}>
          Continuar
        </Button>
      </div>
    </section>
  )
}

export default Step2Vinculo
