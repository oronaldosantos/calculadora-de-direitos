import Button from '../ui/Button'
import useWizardStore from '../../store/wizardStore'
import { gerarLinkWhatsApp, MENSAGENS_WHATSAPP } from '../../utils/whatsappService'

function StepPrescricao() {
  const whatsappNumero = useWizardStore((state) => state.whatsappNumero)
  const resetWizard = useWizardStore((state) => state.resetWizard)

  return (
    <section className="rounded-2xl bg-midnight p-6 text-white">
      <h2 className="font-sora text-2xl font-bold">Seu prazo para essa ação pode ter passado</h2>
      <p className="mt-4 text-sm leading-relaxed text-slate-200">
        A lei trabalhista dá 2 anos depois que você sai de um emprego para entrar com uma ação na Justiça
        do Trabalho. Pelo que você informou, esse tempo pode ter passado para esse vínculo.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">
        Mas não desista sem falar com um advogado: em alguns casos especiais esse prazo pode ser
        diferente. Nossa equipe pode analisar sua situação gratuitamente.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          className="inline-flex"
          href={gerarLinkWhatsApp(whatsappNumero, MENSAGENS_WHATSAPP.prescricao)}
          target="_blank"
          rel="noreferrer"
        >
          <Button className="w-full">Falar com um advogado agora</Button>
        </a>
        <Button variant="secondary" className="w-full" onClick={resetWizard}>
          Calcular outro emprego
        </Button>
      </div>
    </section>
  )
}

export default StepPrescricao
