import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { enviarLeadWebhook } from '../../utils/webhookService'

function normalizarWhatsApp(valor = '') {
  return valor.replace(/\D/g, '').slice(0, 11)
}

function montarPayload({ lead, respostas, resultado, whatsappNumero }) {
  return {
    lead: {
      nome: lead.nome,
      whatsapp: normalizarWhatsApp(lead.whatsapp),
      email: lead.email,
      timestamp: new Date().toISOString(),
      origem: 'calculadora-jianoti',
      whatsappAtendimento: whatsappNumero,
    },
    respostas: {
      dataInicio: respostas.dataInicio || null,
      dataSaida: respostas.aindaTrabalhando ? null : respostas.dataSaida || null,
      aindaTrabalhando: Boolean(respostas.aindaTrabalhando),
      temCarteira: Boolean(respostas.temCarteira),
      funcaoId: respostas.funcaoId || null,
      funcaoLabel: resultado.funcaoMeta?.label || null,
      salario: Number(respostas.salario || 0),
      motivoRescisao: respostas.motivoRescisao || null,
      cumpriuAviso: respostas.cumpriuAviso || null,
      registradoPrimeiroDia: respostas.registradoPrimeiroDia,
      salarioPorFora: Boolean(respostas.salarioPorFora),
      valorPorFora: Number(respostas.valorPorFora || 0) || null,
      beneficiosGoverno: respostas.beneficiosGoverno || [],
      fazHorasExtras: Boolean(respostas.fazHorasExtras),
      horasExtrasSemana: respostas.horasExtrasSemana || null,
      trabalhaNoturno: Boolean(respostas.trabalhaNoturno),
      horasNoturnas: respostas.horasNoturnas || null,
      trabalhaDomingo: Boolean(respostas.trabalhaDomingo),
    },
    resultado: {
      temCarteira: resultado.temCarteira,
      periodoFoiCortadoPorPrescricao: resultado.periodoFoiCortadoPorPrescricao,
      verbas: resultado.verbas.map((verba) => ({
        id: verba.id,
        descricao: verba.descricao,
        base: verba.base,
        valor: Number(verba.valor || 0),
        tipo: verba.tipo || 'credito',
      })),
      totalEstimado: Number(resultado.totalEstimado || 0),
      direitosIdentificados: resultado.direitosIdentificados || [],
      alertas: resultado.alertas || [],
    },
  }
}

function LeadForm({ respostas, resultado, whatsappNumero, onReveal, onWebhookError }) {
  const [enviando, setEnviando] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: '',
      whatsapp: '',
      email: '',
    },
  })

  const onSubmit = (dados) => {
    setEnviando(true)
    const payload = montarPayload({
      lead: dados,
      respostas,
      resultado,
      whatsappNumero,
    })

    onReveal(payload)

    enviarLeadWebhook(payload)
      .catch((error) => {
        onWebhookError(error, payload)
      })
      .finally(() => {
        setEnviando(false)
      })
  }

  return (
    <section className="card">
      <h3 className="font-sora text-lg font-bold text-midnight">Revelar resultado completo</h3>
      <p className="mt-1 text-sm text-slate-600">
        Preencha para receber no WhatsApp e no e-mail e liberar os detalhes na tela.
      </p>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome completo"
          placeholder="Seu nome"
          error={errors.nome?.message}
          {...register('nome', {
            required: 'Informe seu nome.',
            minLength: { value: 3, message: 'Informe nome e sobrenome.' },
          })}
        />

        <Input
          label="WhatsApp com DDD"
          placeholder="(41) 99999-9999"
          inputMode="numeric"
          error={errors.whatsapp?.message}
          {...register('whatsapp', {
            required: 'Informe seu WhatsApp.',
            validate: (value) =>
              normalizarWhatsApp(value).length === 11 || 'Informe um número com 11 dígitos (DDD + número).',
          })}
        />

        <Input
          label="E-mail"
          placeholder="voce@email.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Informe seu e-mail.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Informe um e-mail válido.',
            },
          })}
        />

        <Button type="submit" className="w-full" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Receber e revelar resultado'}
        </Button>
      </form>
    </section>
  )
}

export default LeadForm
