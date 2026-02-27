import { useEffect, useMemo, useRef, useState } from 'react'
import AlertBanner from '../ui/AlertBanner'
import Button from '../ui/Button'
import LeadForm from './LeadForm'
import ResultBlurred from './ResultBlurred'
import Rightslist from './Rightslist'
import CalcTable from './CalcTable'
import useWizardStore from '../../store/wizardStore'
import { calcularDireitos } from '../../utils/calcEngine'
import { gerarLinkWhatsApp, MENSAGENS_WHATSAPP } from '../../utils/whatsappService'

function ResultContainer({ onBack }) {
  const respostas = useWizardStore((state) => state.respostas)
  const leadRevelado = useWizardStore((state) => state.leadRevelado)
  const leadMensagem = useWizardStore((state) => state.leadMensagem)
  const leadErro = useWizardStore((state) => state.leadErro)
  const ultimoPayload = useWizardStore((state) => state.ultimoPayload)
  const whatsappNumero = useWizardStore((state) => state.whatsappNumero)
  const setResultado = useWizardStore((state) => state.setResultado)
  const revelarResultado = useWizardStore((state) => state.revelarResultado)
  const setErroWebhook = useWizardStore((state) => state.setErroWebhook)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const tabelaRef = useRef(null)

  const resultado = useMemo(() => calcularDireitos(respostas), [respostas])

  useEffect(() => {
    setResultado(resultado)
  }, [resultado, setResultado])

  useEffect(() => {
    if (leadRevelado && tabelaRef.current) {
      tabelaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [leadRevelado])

  const ctaWhatsapp = gerarLinkWhatsApp(whatsappNumero, MENSAGENS_WHATSAPP.resultado)

  const onReveal = (payload) => {
    revelarResultado(
      '✅ Pronto! Enviamos seu resultado completo para o WhatsApp e e-mail informados. Agora confira tudo abaixo:',
      payload,
    )
  }

  const onWebhookError = (_error, payload) => {
    setErroWebhook('Houve um problema ao enviar. Salve seu resultado agora.', payload)
  }

  const copiarPayload = async () => {
    if (!ultimoPayload) return
    await navigator.clipboard.writeText(JSON.stringify(ultimoPayload, null, 2))
  }

  return (
    <section className="space-y-4">
      {!resultado.temCarteira ? (
        <AlertBanner variant="info" title="🔵 Mesmo sem carteira assinada, a lei garante todos esses direitos para você.">
          Tudo abaixo pode ser reivindicado na Justiça do Trabalho, incluindo registro retroativo, INSS do
          período e possível seguro-desemprego.
        </AlertBanner>
      ) : null}

      {!leadRevelado ? (
        <>
          <ResultBlurred
            totalEstimado={resultado.totalEstimado}
            direitosCount={resultado.direitosIdentificados.length}
            onRevealClick={() => setMostrarFormulario(true)}
          />
          {mostrarFormulario ? (
            <LeadForm
              respostas={respostas}
              resultado={resultado}
              whatsappNumero={whatsappNumero}
              onReveal={onReveal}
              onWebhookError={onWebhookError}
            />
          ) : null}
          <div className="flex justify-start">
            <Button variant="secondary" onClick={onBack}>
              Voltar e ajustar respostas
            </Button>
          </div>
        </>
      ) : (
        <>
          {leadMensagem ? <AlertBanner variant="info">{leadMensagem}</AlertBanner> : null}

          {leadErro ? (
            <div className="space-y-2">
              <AlertBanner variant="warning">{leadErro}</AlertBanner>
              <Button variant="secondary" onClick={copiarPayload}>
                Copiar payload enviado
              </Button>
            </div>
          ) : null}

          {resultado.alertas.map((alerta, index) => (
            <AlertBanner
              key={`${alerta}-${index}`}
              variant="warning"
            >
              ⚠️ {alerta}
            </AlertBanner>
          ))}

          <Rightslist direitos={resultado.direitosIdentificados} />

          <div ref={tabelaRef}>
            <CalcTable
              verbas={resultado.verbas}
              totalEstimado={resultado.totalEstimado}
              badge={resultado.badgeGlobal}
            />
          </div>

          {resultado.informativos.length ? (
            <section className="card space-y-2">
              <h3 className="font-sora text-base font-bold text-midnight">Outros direitos importantes</h3>
              {resultado.informativos.map((info) => (
                <p key={info} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  {info}
                </p>
              ))}
            </section>
          ) : null}

          {resultado.notas.length ? (
            <section className="card space-y-2">
              <h3 className="font-sora text-base font-bold text-midnight">Notas da estimativa</h3>
              {resultado.notas.map((nota) => (
                <p key={nota} className="text-sm text-slate-600">
                  • {nota}
                </p>
              ))}
            </section>
          ) : null}

          <section className="card">
            <h3 className="font-sora text-lg font-bold text-midnight">Quer receber o que é seu por direito?</h3>
            <p className="mt-1 text-sm text-slate-600">
              Atendimento gratuito, sem compromisso. Mais de 3.000 trabalhadores atendidos.
            </p>
            <a href={ctaWhatsapp} target="_blank" rel="noreferrer" className="mt-4 inline-flex">
              <Button>💬 Falar com advogado no WhatsApp</Button>
            </a>
          </section>
        </>
      )}
    </section>
  )
}

export default ResultContainer
