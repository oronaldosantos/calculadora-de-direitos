import { create } from 'zustand'
import { FOTOS_ADVOGADOS } from '../constants/calcConstants'
import { sortearNumero } from '../utils/whatsappService'

export const RESPOSTAS_INICIAIS = {
  dataInicio: '',
  dataSaida: '',
  aindaTrabalhando: false,
  temCarteira: null,
  funcaoId: '',
  salario: '',
  motivoRescisao: '',
  cumpriuAviso: '',
  registradoPrimeiroDia: null,
  dataRegistro: '',
  salarioPorFora: false,
  valorPorFora: '',
  beneficiosGoverno: [],
  fazHorasExtras: false,
  horasExtrasSemana: '',
  trabalhaNoturno: false,
  horasNoturnas: '',
  trabalhaDomingo: false,
}

const escolherAdvogada = () => {
  if (!FOTOS_ADVOGADOS.length) {
    return { nome: 'Equipe Jianoti', url: '' }
  }
  return FOTOS_ADVOGADOS[Math.floor(Math.random() * FOTOS_ADVOGADOS.length)]
}

const useWizardStore = create((set) => ({
  currentStep: 0,
  prescricaoStatus: 'ok',
  prescricaoMeses: 0,
  leadRevelado: false,
  leadMensagem: '',
  leadErro: '',
  ultimoPayload: null,
  resultado: null,
  respostas: { ...RESPOSTAS_INICIAIS },

  whatsappNumero: sortearNumero(),
  advogadaAtual: escolherAdvogada(),

  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
    })),

  setResposta: (campo, valor) =>
    set((state) => ({
      respostas: {
        ...state.respostas,
        [campo]: valor,
      },
    })),

  setRespostas: (dados) =>
    set((state) => ({
      respostas: {
        ...state.respostas,
        ...dados,
      },
    })),

  toggleBeneficio: (beneficioId) =>
    set((state) => {
      const atual = state.respostas.beneficiosGoverno || []

      if (beneficioId === 'nenhum') {
        return {
          respostas: {
            ...state.respostas,
            beneficiosGoverno: atual.includes('nenhum') ? [] : ['nenhum'],
          },
        }
      }

      const semNenhum = atual.filter((item) => item !== 'nenhum')
      const jaTem = semNenhum.includes(beneficioId)
      const novo = jaTem ? semNenhum.filter((item) => item !== beneficioId) : [...semNenhum, beneficioId]
      return {
        respostas: {
          ...state.respostas,
          beneficiosGoverno: novo,
        },
      }
    }),

  setPrescricao: (status, meses) =>
    set({
      prescricaoStatus: status,
      prescricaoMeses: meses ?? 0,
    }),

  setResultado: (resultado) => set({ resultado }),

  revelarResultado: (mensagem, payload) =>
    set({
      leadRevelado: true,
      leadMensagem: mensagem || '',
      leadErro: '',
      ultimoPayload: payload || null,
    }),

  setErroWebhook: (mensagem, payload) =>
    set({
      leadErro: mensagem,
      ultimoPayload: payload,
    }),

  resetWizard: () =>
    set((state) => ({
      currentStep: 0,
      prescricaoStatus: 'ok',
      prescricaoMeses: 0,
      leadRevelado: false,
      leadMensagem: '',
      leadErro: '',
      ultimoPayload: null,
      resultado: null,
      respostas: { ...RESPOSTAS_INICIAIS },
      whatsappNumero: state.whatsappNumero,
      advogadaAtual: state.advogadaAtual,
    })),
}))

export default useWizardStore
