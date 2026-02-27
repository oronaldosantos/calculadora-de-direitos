import { useEffect, useMemo, useState } from 'react'
import useWizardStore from '../../store/wizardStore'
import { gerarLinkWhatsApp, MENSAGENS_WHATSAPP } from '../../utils/whatsappService'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#25D366"
        d="M16 3.2A12.73 12.73 0 0 0 5.17 22.08L3 29l7.08-2.06A12.73 12.73 0 1 0 16 3.2Zm0 23.13a10.26 10.26 0 0 1-5.23-1.43l-.37-.22-4.2 1.22 1.25-4.1-.24-.42A10.3 10.3 0 1 1 16 26.33Zm5.67-7.7c-.3-.15-1.76-.86-2.04-.96-.27-.1-.47-.15-.67.15-.2.3-.76.95-.93 1.14-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.37-1.47-.87-.78-1.46-1.75-1.63-2.05-.17-.3-.02-.47.13-.62.14-.14.3-.37.44-.56.15-.2.2-.33.3-.55.1-.22.05-.42-.02-.57-.08-.15-.67-1.62-.91-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.03 1-1.03 2.42s1.05 2.8 1.2 3c.14.2 2.05 3.13 4.97 4.38.69.3 1.23.48 1.65.62.7.22 1.33.19 1.84.12.56-.08 1.76-.72 2.01-1.42.25-.7.25-1.31.18-1.43-.06-.12-.27-.2-.57-.35Z"
      />
    </svg>
  )
}

function WhatsAppBadge() {
  const numero = useWizardStore((state) => state.whatsappNumero)
  const advogada = useWizardStore((state) => state.advogadaAtual)
  const [erroImagem, setErroImagem] = useState(false)
  const [isTiny, setIsTiny] = useState(false)
  const [expandido, setExpandido] = useState(false)

  useEffect(() => {
    const sync = () => setIsTiny(window.innerWidth < 380)
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const link = useMemo(
    () => gerarLinkWhatsApp(numero, MENSAGENS_WHATSAPP.badge),
    [numero],
  )

  const iniciais = useMemo(() => {
    const nome = advogada?.nome || 'Jianoti'
    return nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase()
  }, [advogada])

  const handleClick = (event) => {
    if (isTiny && !expandido) {
      event.preventDefault()
      setExpandido(true)
    }
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      aria-label="Fale com um advogado agora pelo WhatsApp"
      className="fixed bottom-24 right-4 z-[1000] animate-slideUp rounded-full bg-white px-2 py-1.5 shadow-badge sm:bottom-6 sm:px-3"
    >
      <span className="flex items-center gap-2">
        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full">
          <span className="absolute inset-0 rounded-full bg-neon-blue/30 animate-pulseRing" />
          {!erroImagem && advogada?.url ? (
            <img
              src={advogada.url}
              alt={advogada?.nome || 'Advogada'}
              title={advogada?.nome || 'Equipe Jianoti'}
              className="relative h-12 w-12 rounded-full border-2 border-white object-cover"
              onError={() => setErroImagem(true)}
            />
          ) : (
            <span
              title={advogada?.nome || 'Equipe Jianoti'}
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-neon-blue font-sora text-sm font-bold text-white"
            >
              {iniciais || 'JJ'}
            </span>
          )}
        </span>

        <span className={`${isTiny && !expandido ? 'hidden' : 'block'} pr-1`}>
          <span className="block font-sora text-sm font-bold text-midnight">Fale com um advogado agora</span>
          <span className="block text-xs text-neon-blue">pelo WhatsApp</span>
        </span>
        <WhatsAppIcon />
      </span>
    </a>
  )
}

export default WhatsAppBadge
