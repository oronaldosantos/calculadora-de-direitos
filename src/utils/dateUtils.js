import dayjs from 'dayjs'
import { CONSTANTS } from '../constants/calcConstants'

export function parseCompetencia(valor) {
  if (!valor) return null
  return dayjs(`${valor}-01`)
}

export function diffMeses(base, ref) {
  if (!base || !ref) return 0
  return ref.diff(base, 'month')
}

export function verificarPrescricao(dataSaida) {
  const saida = parseCompetencia(dataSaida)
  if (!saida || !saida.isValid()) {
    return { status: 'ok', mesesDesdeSaida: 0 }
  }

  const hoje = dayjs()
  const mesesDesdeSaida = hoje.diff(saida, 'month')

  if (mesesDesdeSaida > CONSTANTS.PRESCRICAO_BIENAL_MESES) {
    return { status: 'prescrito', mesesDesdeSaida }
  }

  if (mesesDesdeSaida >= 18) {
    return { status: 'alerta', mesesDesdeSaida }
  }

  return { status: 'ok', mesesDesdeSaida }
}

export function calcularPeriodoEfetivo(dataInicio, dataSaida) {
  const hoje = dayjs()
  const inicio = parseCompetencia(dataInicio)
  const saida = dataSaida ? parseCompetencia(dataSaida) : hoje

  if (!inicio || !inicio.isValid() || !saida || !saida.isValid()) {
    return {
      inicioEfetivo: null,
      fimEfetivo: null,
      mesesTotais: 0,
      mesesReais: 0,
      periodoFoiCortado: false,
    }
  }

  const dataMinima = saida.subtract(CONSTANTS.PRESCRICAO_QUINQUENAL_MESES, 'month')
  const inicioEfetivo = inicio.isBefore(dataMinima) ? dataMinima : inicio

  return {
    inicioEfetivo,
    fimEfetivo: saida,
    mesesTotais: Math.max(0, saida.diff(inicioEfetivo, 'month')),
    mesesReais: Math.max(0, saida.diff(inicio, 'month')),
    periodoFoiCortado: inicio.isBefore(dataMinima),
  }
}

export function formatMesAno(data) {
  if (!data) return '-'
  return dayjs(`${data}-01`).format('MM/YYYY')
}
