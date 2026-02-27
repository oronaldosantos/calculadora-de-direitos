import dayjs from 'dayjs'
import {
  BENEFICIOS_GOVERNO,
  CONSTANTS,
  FUNCOES,
  HORAS_EXTRAS_FAIXAS,
  HORAS_NOTURNAS_FAIXAS,
} from '../constants/calcConstants'
import { calcularPeriodoEfetivo, parseCompetencia } from './dateUtils'

const MAPA_RESCISAO = {
  pedido_demissao: {
    feriasProporcionais: true,
    decimo: true,
    multaFgts: false,
    avisoPrevio: false,
    seguroDesemprego: false,
  },
  demitido_sem_justa_causa: {
    feriasProporcionais: true,
    decimo: true,
    multaFgts: true,
    avisoPrevio: true,
    seguroDesemprego: true,
  },
  demitido_com_justa_causa: {
    feriasProporcionais: false,
    decimo: false,
    multaFgts: false,
    avisoPrevio: false,
    seguroDesemprego: false,
  },
  fim_contrato_experiencia: {
    feriasProporcionais: true,
    decimo: true,
    multaFgts: false,
    avisoPrevio: false,
    seguroDesemprego: false,
  },
  rescisao_antecipada_empregador: {
    feriasProporcionais: true,
    decimo: true,
    multaFgts: true,
    avisoPrevio: true,
    seguroDesemprego: true,
  },
  rescisao_antecipada_empregado: {
    feriasProporcionais: true,
    decimo: true,
    multaFgts: false,
    avisoPrevio: false,
    seguroDesemprego: false,
  },
  falecimento: {
    feriasProporcionais: true,
    decimo: true,
    multaFgts: false,
    avisoPrevio: false,
    seguroDesemprego: false,
  },
}

const ROTULOS_SEM_CARTEIRA = {
  saldo_salario: 'Dias trabalhados não pagos',
  ferias_vencidas: 'Férias que você tinha direito e não recebeu',
  ferias_proporcionais: 'Férias proporcionais não pagas',
  decimo_terceiro: '13º salário não pago',
  fgts_total: 'FGTS não depositado — a receber na Justiça',
  fgts_registrado: 'FGTS do período registrado',
  fgts_sem_registro: 'FGTS do período sem registro (direito adicional)',
  multa_fgts: 'Multa por demissão sem justa causa — a receber na Justiça',
  aviso_previo: 'Aviso prévio — a receber na Justiça',
  indenizacao_479: 'Indenização do contrato de experiência (Art. 479 CLT)',
  horas_extras: 'Horas extras não pagas',
  domingos_feriados: 'Trabalho aos domingos e feriados',
  adicional_noturno: 'Adicional noturno não pago',
  insalubridade: 'Adicional de insalubridade não pago',
  periculosidade: 'Adicional de periculosidade não pago',
  seguro_desemprego: 'Seguro-desemprego — a receber na Justiça',
}

const ROTULOS_PADRAO = {
  saldo_salario: 'Saldo de salário',
  ferias_vencidas: 'Férias vencidas + 1/3',
  ferias_proporcionais: 'Férias proporcionais + 1/3',
  decimo_terceiro: '13º salário',
  fgts_total: 'FGTS acumulado',
  fgts_registrado: 'FGTS do período registrado',
  fgts_sem_registro: 'FGTS do período sem registro (direito adicional)',
  multa_fgts: 'Multa de 40% sobre FGTS',
  aviso_previo: 'Aviso prévio indenizado',
  indenizacao_479: 'Indenização por rescisão antecipada (Art. 479 CLT)',
  horas_extras: 'Horas extras em dias de semana',
  domingos_feriados: 'Trabalho aos domingos e feriados',
  adicional_noturno: 'Adicional noturno',
  insalubridade: 'Adicional de insalubridade',
  periculosidade: 'Adicional de periculosidade',
  seguro_desemprego: 'Seguro-desemprego (estimativa)',
}

export function formatCurrency(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor || 0))
}

function toNumberBR(valor) {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
  if (typeof valor !== 'string') return 0

  const limpo = valor.trim().replace(/[^\d,.-]/g, '')
  if (!limpo) return 0

  const ultimoSeparador = Math.max(limpo.lastIndexOf(','), limpo.lastIndexOf('.'))
  if (ultimoSeparador === -1) {
    const inteiro = limpo.replace(/[^\d-]/g, '')
    return Number(inteiro || 0)
  }

  const inteiro = limpo.slice(0, ultimoSeparador).replace(/[^\d-]/g, '')
  const decimal = limpo.slice(ultimoSeparador + 1).replace(/\D/g, '')
  return Number(`${inteiro || 0}.${decimal || 0}`)
}

function getMediaFaixa(faixas, id) {
  const item = faixas.find((faixa) => faixa.id === id)
  return item?.media ?? 0
}

function getFuncaoMeta(funcaoId) {
  for (const grupo of FUNCOES) {
    const encontrada = grupo.funcoes.find((f) => f.id === funcaoId)
    if (encontrada) {
      return { ...encontrada, grupo: grupo.grupo }
    }
  }
  return { id: 'outros', label: 'Outra função não listada', insalubridade: false, periculosidade: false, grupo: 'Outros' }
}

function getGrauInsalubridade(grau) {
  if (grau === 'minimo') return CONSTANTS.ADICIONAL_INSALUBRIDADE_MINIMO
  if (grau === 'medio') return CONSTANTS.ADICIONAL_INSALUBRIDADE_MEDIO
  if (grau === 'maximo') return CONSTANTS.ADICIONAL_INSALUBRIDADE_MAXIMO
  return 0
}

function adicionarVerba(verbas, verba) {
  if (verba.tipo === 'informativo') {
    verbas.push(verba)
    return
  }
  if (Number(verba.valor) > 0) {
    verbas.push(verba)
  }
}

function calcularParcelaSeguroDesemprego(salario) {
  const faixa1 = CONSTANTS.SEGURO_DESEMPREGO[0].ate
  const faixa2 = CONSTANTS.SEGURO_DESEMPREGO[1].ate
  const teto = CONSTANTS.SEGURO_DESEMPREGO[2].fixo

  if (salario <= faixa1) {
    return Math.min(salario * 0.8, teto)
  }
  if (salario <= faixa2) {
    const excedente = salario - faixa1
    return Math.min(faixa1 * 0.8 + excedente * 0.5, teto)
  }
  return teto
}

function calcularParcelasSeguroDesemprego(mesesReais) {
  if (mesesReais < 6) return 0
  if (mesesReais <= 11) return 3
  if (mesesReais <= 23) return 4
  return 5
}

function rotuloVerba(id, temCarteira) {
  return temCarteira ? ROTULOS_PADRAO[id] : ROTULOS_SEM_CARTEIRA[id] || ROTULOS_PADRAO[id]
}

function regimeRescisao(respostas) {
  if (respostas.aindaTrabalhando) {
    return {
      feriasProporcionais: true,
      decimo: true,
      multaFgts: false,
      avisoPrevio: false,
      seguroDesemprego: false,
    }
  }

  return MAPA_RESCISAO[respostas.motivoRescisao] || MAPA_RESCISAO.pedido_demissao
}

function calcularInicioFgtsDomestico(inicioEfetivo, funcaoMeta, alertas) {
  if (funcaoMeta.regra_especial !== 'LC_150_2015') return inicioEfetivo
  const limite = dayjs('2015-10-01')
  if (inicioEfetivo.isBefore(limite)) {
    alertas.push(
      'Antes de outubro de 2015, o FGTS para trabalhadores domésticos era facultativo. Calculamos apenas o período a partir dessa data.',
    )
    return limite
  }
  return inicioEfetivo
}

export function calcularDireitos(respostas) {
  const alertas = []
  const notas = []
  const verbas = []
  const informativos = []

  const funcaoMeta = getFuncaoMeta(respostas.funcaoId)
  const temCarteira = Boolean(respostas.temCarteira)
  const salarioInformado = toNumberBR(respostas.salario)
  const salarioBase = salarioInformado < CONSTANTS.SALARIO_MINIMO ? CONSTANTS.SALARIO_MINIMO : salarioInformado

  if (salarioInformado > 0 && salarioInformado < CONSTANTS.SALARIO_MINIMO) {
    alertas.push(
      `Você informou salário abaixo do mínimo. Consideramos ${formatCurrency(CONSTANTS.SALARIO_MINIMO)} para o cálculo.`,
    )
  }

  const valorPorFora = temCarteira && respostas.salarioPorFora ? toNumberBR(respostas.valorPorFora) : 0
  const salarioReal = salarioBase + valorPorFora

  const periodo = calcularPeriodoEfetivo(respostas.dataInicio, respostas.aindaTrabalhando ? null : respostas.dataSaida)
  const mesesEfetivos = periodo.mesesTotais
  const mesesReais = periodo.mesesReais

  if (periodo.periodoFoiCortado) {
    alertas.push(
      'Parte do período informado foi limitada pela prescrição legal de 5 anos. Um advogado pode avaliar se existe alguma exceção aplicável.',
    )
  }

  if (mesesEfetivos < 1) {
    alertas.push('Período inferior a 1 mês: algumas verbas podem depender de tempo mínimo de trabalho.')
  }

  if (funcaoMeta.id === 'diarista') {
    alertas.push(
      'Diarista até 2 vezes por semana no mesmo empregador normalmente não configura vínculo empregatício. Um advogado pode avaliar sua frequência real.',
    )
  }

  if (funcaoMeta.id === 'outros') {
    alertas.push(
      'Para função não listada, os adicionais de insalubridade e periculosidade podem variar por categoria. Consulte um advogado para validar.',
    )
  }

  if (funcaoMeta.regra_especial === 'rural') {
    notas.push(
      'Trabalho rural possui regras específicas por atividade. Esta estimativa usa base CLT e pode variar conforme convenção e safra.',
    )
  }

  if (respostas.motivoRescisao === 'falecimento') {
    alertas.push(
      'Em caso de falecimento, os valores podem ser transferidos a dependentes/herdeiros. Procure orientação jurídica para habilitação correta.',
    )
  }

  const regra = regimeRescisao(respostas)

  if (!respostas.aindaTrabalhando) {
    adicionarVerba(verbas, {
      id: 'saldo_salario',
      descricao: rotuloVerba('saldo_salario', temCarteira),
      base: 'Último mês considerado integral (estimativa conservadora)',
      valor: salarioReal,
      tipo: 'credito',
    })
    notas.push(
      'Calculamos o último mês como completo. Se você saiu antes do fim do mês, o valor exato pode ser menor.',
    )
  }

  if (mesesEfetivos >= 12) {
    adicionarVerba(verbas, {
      id: 'ferias_vencidas',
      descricao: rotuloVerba('ferias_vencidas', temCarteira),
      base: 'Último período completo de 12 meses',
      valor: salarioReal * (1 + CONSTANTS.ADICIONAL_FERIAS),
      tipo: 'credito',
    })
    notas.push(
      'Calculamos as férias do último período completo. Períodos anteriores podem existir e exigem análise documental.',
    )
  }

  if (regra.feriasProporcionais) {
    const mesesProporcional = mesesEfetivos % 12
    adicionarVerba(verbas, {
      id: 'ferias_proporcionais',
      descricao: rotuloVerba('ferias_proporcionais', temCarteira),
      base: `${mesesProporcional} mês(es) proporcionais no período aquisitivo`,
      valor: (salarioReal / 12) * mesesProporcional * (1 + CONSTANTS.ADICIONAL_FERIAS),
      tipo: 'credito',
    })
  }

  if (regra.decimo) {
    const referencia = respostas.aindaTrabalhando ? dayjs() : parseCompetencia(respostas.dataSaida)
    const inicioAno = referencia.startOf('year')
    const inicioContagem = periodo.inicioEfetivo && periodo.inicioEfetivo.isAfter(inicioAno) ? periodo.inicioEfetivo : inicioAno
    const mesesNoAno = Math.max(0, Math.min(12, referencia.diff(inicioContagem, 'month') + 1))
    adicionarVerba(verbas, {
      id: 'decimo_terceiro',
      descricao: rotuloVerba('decimo_terceiro', temCarteira),
      base: `${mesesNoAno} mês(es) no ano de referência`,
      valor: (salarioReal / 12) * mesesNoAno,
      tipo: 'credito',
    })
    notas.push(
      'Calculamos o 13º do ano corrente (ou do último ano trabalhado). Anos anteriores podem gerar diferenças adicionais.',
    )
  }

  let fgtsBaseMulta = 0
  const inicioFgts = calcularInicioFgtsDomestico(periodo.inicioEfetivo || dayjs(), funcaoMeta, alertas)

  if (temCarteira && respostas.registradoPrimeiroDia === false && respostas.dataRegistro) {
    const dataRegistro = parseCompetencia(respostas.dataRegistro)
    const inicioComRegistro = dataRegistro && dataRegistro.isAfter(inicioFgts) ? dataRegistro : inicioFgts

    const mesesSemRegistro = dataRegistro && dataRegistro.isAfter(inicioFgts) ? dataRegistro.diff(inicioFgts, 'month') : 0
    const mesesComRegistro = Math.max(0, (periodo.fimEfetivo || dayjs()).diff(inicioComRegistro, 'month'))

    const fgtsSemRegistro = salarioReal * CONSTANTS.FGTS_PERCENTUAL * mesesSemRegistro
    const fgtsComRegistro = salarioReal * CONSTANTS.FGTS_PERCENTUAL * mesesComRegistro
    fgtsBaseMulta = fgtsComRegistro

    adicionarVerba(verbas, {
      id: 'fgts_registrado',
      descricao: rotuloVerba('fgts_registrado', temCarteira),
      base: `${mesesComRegistro} mês(es) com registro`,
      valor: fgtsComRegistro,
      tipo: 'credito',
    })
    adicionarVerba(verbas, {
      id: 'fgts_sem_registro',
      descricao: rotuloVerba('fgts_sem_registro', temCarteira),
      base: `${mesesSemRegistro} mês(es) sem registro`,
      valor: fgtsSemRegistro,
      tipo: 'credito',
    })
  } else {
    const mesesFgts = Math.max(0, (periodo.fimEfetivo || dayjs()).diff(inicioFgts, 'month'))
    const fgtsTotal = salarioReal * CONSTANTS.FGTS_PERCENTUAL * mesesFgts
    fgtsBaseMulta = fgtsTotal
    adicionarVerba(verbas, {
      id: 'fgts_total',
      descricao: rotuloVerba('fgts_total', temCarteira),
      base: `${mesesFgts} mês(es) x 8% do salário`,
      valor: fgtsTotal,
      tipo: 'credito',
    })
  }

  if (regra.multaFgts) {
    adicionarVerba(verbas, {
      id: 'multa_fgts',
      descricao: rotuloVerba('multa_fgts', temCarteira),
      base: '40% sobre o FGTS base',
      valor: fgtsBaseMulta * CONSTANTS.MULTA_FGTS_SEM_JUSTA_CAUSA,
      tipo: 'credito',
    })
  }

  if (regra.avisoPrevio && respostas.cumpriuAviso === 'nao') {
    const anosCompletos = Math.floor(mesesReais / 12)
    const diasAviso = Math.min(90, 30 + anosCompletos * 3)
    adicionarVerba(verbas, {
      id: 'aviso_previo',
      descricao: rotuloVerba('aviso_previo', temCarteira),
      base: `${diasAviso} dia(s) de aviso prévio proporcional`,
      valor: (salarioReal / 30) * diasAviso,
      tipo: 'credito',
    })
  }

  if (respostas.motivoRescisao === 'rescisao_antecipada_empregador') {
    const diasContrato = 90
    const diasTrabalhados = mesesReais * 30
    const diasRestantes = Math.max(0, diasContrato - diasTrabalhados)
    adicionarVerba(verbas, {
      id: 'indenizacao_479',
      descricao: rotuloVerba('indenizacao_479', temCarteira),
      base: `${diasRestantes} dia(s) restantes x 150%`,
      valor: (salarioReal / 30) * diasRestantes * 1.5,
      tipo: 'credito',
    })
    notas.push(
      'A indenização do contrato de experiência foi estimada com duração padrão de 90 dias.',
    )
  }

  if (respostas.motivoRescisao === 'rescisao_antecipada_empregado') {
    alertas.push(
      'Quando o empregado sai antes do fim do contrato de experiência, pode haver multa contratual. O cálculo exato depende do contrato.',
    )
  }

  const valorHora = salarioReal / CONSTANTS.HORAS_MES_CLT
  const semanasEfetivas = mesesEfetivos * 4.33

  if (respostas.fazHorasExtras) {
    const horasExtrasSemanais = getMediaFaixa(HORAS_EXTRAS_FAIXAS, respostas.horasExtrasSemana)
    adicionarVerba(verbas, {
      id: 'horas_extras',
      descricao: rotuloVerba('horas_extras', temCarteira),
      base: `${horasExtrasSemanais}h/semana (média)`,
      valor: horasExtrasSemanais * semanasEfetivas * (valorHora * (1 + CONSTANTS.ADICIONAL_HORA_EXTRA_UTIL)),
      tipo: 'credito',
    })
  }

  if (respostas.trabalhaDomingo) {
    adicionarVerba(verbas, {
      id: 'domingos_feriados',
      descricao: rotuloVerba('domingos_feriados', temCarteira),
      base: '1h por domingo/feriado por semana (estimativa conservadora)',
      valor: semanasEfetivas * (valorHora * (1 + CONSTANTS.ADICIONAL_HORA_EXTRA_DOMINGO)),
      tipo: 'credito',
    })
  }

  if (respostas.trabalhaNoturno) {
    const horasNoturnasSemanais = getMediaFaixa(HORAS_NOTURNAS_FAIXAS, respostas.horasNoturnas)
    adicionarVerba(verbas, {
      id: 'adicional_noturno',
      descricao: rotuloVerba('adicional_noturno', temCarteira),
      base: `${horasNoturnasSemanais}h noturnas/semana (média)`,
      valor: valorHora * CONSTANTS.ADICIONAL_NOTURNO * horasNoturnasSemanais * semanasEfetivas,
      tipo: 'credito',
    })
  }

  const grauInsalubridade = getGrauInsalubridade(funcaoMeta.insalubridade)
  if (grauInsalubridade > 0) {
    adicionarVerba(verbas, {
      id: 'insalubridade',
      descricao: rotuloVerba('insalubridade', temCarteira),
      base: `${Math.round(grauInsalubridade * 100)}% do salário mínimo por mês`,
      valor: CONSTANTS.SALARIO_MINIMO * grauInsalubridade * mesesEfetivos,
      tipo: 'credito',
    })
  }

  if (funcaoMeta.periculosidade) {
    adicionarVerba(verbas, {
      id: 'periculosidade',
      descricao: rotuloVerba('periculosidade', temCarteira),
      base: '30% do salário por mês',
      valor: salarioReal * CONSTANTS.ADICIONAL_PERICULOSIDADE * mesesEfetivos,
      tipo: 'credito',
    })
    if (grauInsalubridade > 0) {
      alertas.push('Insalubridade e periculosidade são excludentes. Normalmente aplica-se apenas o adicional mais vantajoso.')
    }
  }

  if (regra.seguroDesemprego) {
    const parcelas = calcularParcelasSeguroDesemprego(mesesReais)
    if (parcelas > 0) {
      const valorParcela = calcularParcelaSeguroDesemprego(salarioReal)
      adicionarVerba(verbas, {
        id: 'seguro_desemprego',
        descricao: rotuloVerba('seguro_desemprego', temCarteira),
        base: `${parcelas} parcela(s) de ${formatCurrency(valorParcela)}`,
        valor: parcelas * valorParcela,
        tipo: 'credito',
      })
      notas.push(
        'Seguro-desemprego é estimado. O valor oficial depende do histórico completo validado pelo governo.',
      )
    } else {
      alertas.push('Você precisa de pelo menos 6 meses de trabalho para ter direito ao seguro-desemprego.')
    }
  }

  if (!temCarteira) {
    informativos.push(
      'A falta de registro em carteira também sujeita a empresa a multa administrativa de R$ 3.000,00 (Art. 47 CLT), mas esse valor não é pago ao trabalhador.',
      'Com o reconhecimento do vínculo, o INSS de todo o período será recolhido e contará para sua aposentadoria.',
      'Você tem direito à anotação retroativa da carteira de trabalho desde a data real de início.',
      'Dependendo da categoria, pode existir direito a vale-transporte e vale-refeição retroativos.',
      'Se recebia abaixo do piso da categoria, pode haver diferenças salariais retroativas.',
    )
  }

  if (Array.isArray(respostas.beneficiosGoverno) && respostas.beneficiosGoverno.length) {
    respostas.beneficiosGoverno
      .filter((id) => id !== 'nenhum')
      .forEach((id) => {
        const beneficio = BENEFICIOS_GOVERNO.find((b) => b.id === id)
        if (beneficio?.alerta) alertas.push(beneficio.alerta)
      })
  }

  const direitosIdentificados = [
    ...new Set(
      verbas
        .filter((v) => v.tipo === 'credito' && v.valor > 0)
        .map((v) => v.descricao),
    ),
  ]

  const totalEstimado = verbas
    .filter((v) => v.tipo !== 'informativo')
    .reduce((acc, verba) => acc + Number(verba.valor || 0), 0)

  const badgeGlobal = temCarteira ? 'A receber na rescisão' : 'A receber na Justiça do Trabalho'

  return {
    temCarteira,
    salarioReal,
    periodo,
    funcaoMeta,
    periodoFoiCortadoPorPrescricao: periodo.periodoFoiCortado,
    badgeGlobal,
    verbas,
    totalEstimado,
    direitosIdentificados,
    alertas,
    notas,
    informativos,
  }
}
