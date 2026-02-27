export const CONSTANTS = {
  SALARIO_MINIMO: 1518,
  HORAS_SEMANA_CLT: 44,
  HORAS_MES_CLT: 220,
  FGTS_PERCENTUAL: 0.08,
  MULTA_FGTS_SEM_JUSTA_CAUSA: 0.4,
  ADICIONAL_FERIAS: 1 / 3,
  ADICIONAL_HORA_EXTRA_UTIL: 0.5,
  ADICIONAL_HORA_EXTRA_DOMINGO: 1,
  ADICIONAL_NOTURNO: 0.2,
  ADICIONAL_INSALUBRIDADE_MINIMO: 0.1,
  ADICIONAL_INSALUBRIDADE_MEDIO: 0.2,
  ADICIONAL_INSALUBRIDADE_MAXIMO: 0.4,
  ADICIONAL_PERICULOSIDADE: 0.3,
  PRESCRICAO_BIENAL_MESES: 24,
  PRESCRICAO_QUINQUENAL_MESES: 60,
  SEGURO_DESEMPREGO: [
    { ate: 2106.08, percentual: 0.8 },
    { ate: 3513.34, percentual: 0.5 },
    { acima: 3513.34, fixo: 2251.5 },
  ],
  SEGURO_PARCELAS: [
    { meses_min: 6, meses_max: 11, parcelas: 3 },
    { meses_min: 12, meses_max: 23, parcelas: 4 },
    { meses_min: 24, meses_max: 999, parcelas: 5 },
  ],
}

export const FOTOS_ADVOGADOS = [
  {
    nome: 'Dra. Jacqueline Jianoti',
    url: 'https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/66be2d7ed04d7cce8ad03815_dra-jac%402x.jpg',
  },
  {
    nome: 'Dra. Raisa Vargas Soares',
    url: 'https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/68c87390ceef8c96e093f97c_Blog%20(72).avif',
  },
  {
    nome: 'Dra. Geovana Carvalho',
    url: 'https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/68dfdf91ae15be1779cd89c8_Blog%20(90).png',
  },
  {
    nome: 'Dra. Bruna Dutra',
    url: 'https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/66be2d7fd04d7cce8ad03836_dra-bruna-v2%402x.png',
  },
  {
    nome: 'Dra. Luana Sell',
    url: 'https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/68dfdf1ad5e3f868d406dd0c_Blog%20(89).png',
  },
  {
    nome: 'Dra. Gabriella Osiecki',
    url: 'https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/68472e9e5b61ab671ee16076_gabi.jpeg',
  },
]

export const FUNCOES = [
  {
    grupo: 'Construcao Civil',
    funcoes: [
      { id: 'pedreiro', label: 'Pedreiro', insalubridade: 'medio', periculosidade: false },
      { id: 'eletricista', label: 'Eletricista', insalubridade: false, periculosidade: true },
      { id: 'soldador', label: 'Soldador', insalubridade: false, periculosidade: true },
      {
        id: 'encanador',
        label: 'Encanador / Hidraulico',
        insalubridade: 'medio',
        periculosidade: false,
      },
      { id: 'pintor', label: 'Pintor', insalubridade: 'medio', periculosidade: false },
      { id: 'armador', label: 'Armador de Ferro', insalubridade: 'medio', periculosidade: false },
      {
        id: 'servente',
        label: 'Servente / Ajudante de Obra',
        insalubridade: 'minimo',
        periculosidade: false,
      },
      {
        id: 'mestre_obras',
        label: 'Mestre de Obras',
        insalubridade: 'minimo',
        periculosidade: false,
      },
      {
        id: 'carpinteiro',
        label: 'Carpinteiro / Marceneiro',
        insalubridade: 'minimo',
        periculosidade: false,
      },
    ],
  },
  {
    grupo: 'Limpeza e Conservacao',
    funcoes: [
      {
        id: 'aux_limpeza',
        label: 'Auxiliar de Limpeza',
        insalubridade: 'minimo',
        periculosidade: false,
      },
      { id: 'porteiro', label: 'Porteiro / Recepcionista', insalubridade: false, periculosidade: false },
      { id: 'zelador', label: 'Zelador', insalubridade: 'minimo', periculosidade: false },
      { id: 'gari', label: 'Gari / Coletor de Lixo', insalubridade: 'maximo', periculosidade: false },
      {
        id: 'limpador_vidros',
        label: 'Limpador de Vidros (altura)',
        insalubridade: 'medio',
        periculosidade: true,
      },
    ],
  },
  {
    grupo: 'Transporte e Logistica',
    funcoes: [
      {
        id: 'motorista',
        label: 'Motorista (carro/van/onibus)',
        insalubridade: false,
        periculosidade: false,
      },
      {
        id: 'caminhoneiro',
        label: 'Motorista de Caminhao',
        insalubridade: false,
        periculosidade: false,
      },
      {
        id: 'motoboy',
        label: 'Motoboy / Entregador de Moto',
        insalubridade: false,
        periculosidade: true,
      },
      {
        id: 'empilhadeirista',
        label: 'Operador de Empilhadeira',
        insalubridade: false,
        periculosidade: true,
      },
      {
        id: 'ajudante_entrega',
        label: 'Ajudante de Entrega',
        insalubridade: false,
        periculosidade: false,
      },
      {
        id: 'repositor',
        label: 'Repositor de Estoque',
        insalubridade: false,
        periculosidade: false,
      },
    ],
  },
  {
    grupo: 'Industria e Producao',
    funcoes: [
      {
        id: 'op_maquinas',
        label: 'Operador de Maquinas',
        insalubridade: 'medio',
        periculosidade: false,
      },
      {
        id: 'metalurgico',
        label: 'Metalurgico / Fundidor',
        insalubridade: 'maximo',
        periculosidade: true,
      },
      {
        id: 'tec_manutencao',
        label: 'Tecnico de Manutencao',
        insalubridade: 'medio',
        periculosidade: false,
      },
      {
        id: 'montador',
        label: 'Montador de Linha',
        insalubridade: 'minimo',
        periculosidade: false,
      },
      {
        id: 'op_producao',
        label: 'Auxiliar de Producao',
        insalubridade: 'minimo',
        periculosidade: false,
      },
      {
        id: 'quimico',
        label: 'Operador Quimico / Petroquimico',
        insalubridade: 'maximo',
        periculosidade: true,
      },
    ],
  },
  {
    grupo: 'Saude e Cuidados',
    funcoes: [
      {
        id: 'tec_enfermagem',
        label: 'Tecnico de Enfermagem',
        insalubridade: 'maximo',
        periculosidade: false,
      },
      {
        id: 'aux_saude',
        label: 'Auxiliar de Saude / Clinica',
        insalubridade: 'maximo',
        periculosidade: false,
      },
      { id: 'cuidador', label: 'Cuidador de Idosos', insalubridade: 'medio', periculosidade: false },
      {
        id: 'aux_veterinario',
        label: 'Auxiliar Veterinario',
        insalubridade: 'medio',
        periculosidade: false,
      },
    ],
  },
  {
    grupo: 'Alimentacao e Hospitalidade',
    funcoes: [
      { id: 'cozinheiro', label: 'Cozinheiro / Chef', insalubridade: 'minimo', periculosidade: false },
      {
        id: 'aux_cozinha',
        label: 'Auxiliar de Cozinha',
        insalubridade: 'minimo',
        periculosidade: false,
      },
      { id: 'garcom', label: 'Garcom / Garconete', insalubridade: false, periculosidade: false },
      { id: 'padeiro', label: 'Padeiro / Confeiteiro', insalubridade: 'minimo', periculosidade: false },
      {
        id: 'atendente_lanchonete',
        label: 'Atendente de Lanchonete / Fast Food',
        insalubridade: false,
        periculosidade: false,
      },
    ],
  },
  {
    grupo: 'Comercio e Varejo',
    funcoes: [
      { id: 'vendedor', label: 'Vendedor / Atendente de Loja', insalubridade: false, periculosidade: false },
      { id: 'caixa', label: 'Operador de Caixa', insalubridade: false, periculosidade: false },
      { id: 'estoquista', label: 'Estoquista / Almoxarife', insalubridade: false, periculosidade: false },
      {
        id: 'promotor',
        label: 'Promotor de Vendas / Demonstrador',
        insalubridade: false,
        periculosidade: false,
      },
    ],
  },
  {
    grupo: 'Seguranca',
    funcoes: [
      {
        id: 'vigilante',
        label: 'Vigilante / Seguranca (armado)',
        insalubridade: false,
        periculosidade: true,
      },
      {
        id: 'seguranca',
        label: 'Seguranca / Vigia (desarmado)',
        insalubridade: false,
        periculosidade: false,
      },
    ],
  },
  {
    grupo: 'Trabalho Domestico',
    funcoes: [
      {
        id: 'domestico',
        label: 'Empregado(a) Domestico(a)',
        insalubridade: false,
        periculosidade: false,
        regra_especial: 'LC_150_2015',
      },
      {
        id: 'baba',
        label: 'Baba / Cuidador de Criancas',
        insalubridade: false,
        periculosidade: false,
        regra_especial: 'LC_150_2015',
      },
      {
        id: 'diarista',
        label: 'Diarista (ate 2x por semana)',
        insalubridade: false,
        periculosidade: false,
        regra_especial: 'diarista',
      },
      {
        id: 'caseiro',
        label: 'Caseiro / Jardineiro Domestico',
        insalubridade: false,
        periculosidade: false,
        regra_especial: 'LC_150_2015',
      },
    ],
  },
  {
    grupo: 'Trabalho Rural',
    funcoes: [
      {
        id: 'trabalhador_rural',
        label: 'Trabalhador Rural / Agricultor',
        insalubridade: 'medio',
        periculosidade: false,
        regra_especial: 'rural',
      },
      {
        id: 'trabalhador_safra',
        label: 'Trabalhador de Safra / Temporario',
        insalubridade: 'medio',
        periculosidade: false,
        regra_especial: 'rural',
      },
      {
        id: 'pecuarista',
        label: 'Trabalhador em Pecuaria',
        insalubridade: 'minimo',
        periculosidade: false,
        regra_especial: 'rural',
      },
    ],
  },
  {
    grupo: 'Outros',
    funcoes: [{ id: 'outros', label: 'Outra funcao nao listada', insalubridade: false, periculosidade: false }],
  },
]

export const BENEFICIOS_GOVERNO = [
  {
    id: 'bpc_loas',
    label: 'BPC/LOAS',
    explicacao: 'Beneficio para pessoas com deficiencia ou idosos de baixa renda.',
    alerta:
      'Voce marcou BPC/LOAS. Alteracoes de renda formal podem impactar esse beneficio. Consulte um advogado antes de agir.',
  },
  {
    id: 'bolsa_familia',
    label: 'Bolsa Familia',
    explicacao: 'Programa de transferencia de renda cadastrado no CadUnico.',
    alerta:
      'Voce marcou Bolsa Familia. Sua renda no CadUnico pode ser reavaliada ao reconhecer vinculo. Um advogado pode orientar com seguranca.',
  },
  {
    id: 'seguro_desemprego',
    label: 'Seguro-desemprego',
    explicacao: 'Beneficio pago apos demissao sem justa causa.',
    alerta:
      'Voce marcou seguro-desemprego. Pode haver revisao ou complementacao desse direito conforme o reconhecimento do vinculo.',
  },
  {
    id: 'aposentadoria_invalidez',
    label: 'Aposentadoria por invalidez',
    explicacao: 'Beneficio do INSS por incapacidade permanente para o trabalho.',
    alerta:
      'Voce marcou aposentadoria por invalidez. Acoes judiciais podem exigir avaliacao previdenciaria conjunta.',
  },
  {
    id: 'nenhum',
    label: 'Nenhum desses',
    explicacao: '',
    alerta: '',
  },
]

export const MOTIVOS_RESCISAO = [
  { id: 'pedido_demissao', label: 'Pedido de demissao (eu mesmo pedi pra sair)' },
  { id: 'demitido_sem_justa_causa', label: 'Fui demitido sem justa causa (me mandaram embora sem motivo)' },
  { id: 'demitido_com_justa_causa', label: 'Fui demitido com justa causa (me mandaram embora por falta grave)' },
  { id: 'fim_contrato_experiencia', label: 'Fim do contrato de experiencia (o periodo de teste terminou)' },
  {
    id: 'rescisao_antecipada_empregador',
    label: 'Fui demitido antes do fim do contrato de experiencia (a empresa cancelou antes do prazo)',
  },
  {
    id: 'rescisao_antecipada_empregado',
    label: 'Sai antes do fim do contrato de experiencia (eu mesmo sai antes do prazo)',
  },
  {
    id: 'falecimento',
    label: 'Falecimento do empregado (caso esteja preenchendo por outra pessoa)',
  },
]

export const AVISO_PREVIO_OPTIONS = [
  { id: 'sim', label: 'Sim, cumpri aviso' },
  { id: 'nao', label: 'Nao, nao cumpri aviso' },
  { id: 'nao_aplica', label: 'Nao se aplica' },
]

export const HORAS_EXTRAS_FAIXAS = [
  { id: '1-2h', label: '1-2h', media: 1.5 },
  { id: '3-5h', label: '3-5h', media: 4 },
  { id: '6-10h', label: '6-10h', media: 8 },
  { id: 'mais-10h', label: 'Mais de 10h', media: 12 },
]

export const HORAS_NOTURNAS_FAIXAS = [
  { id: 'ate-2h', label: 'Ate 2h', media: 1.5 },
  { id: '2-4h', label: '2-4h', media: 3 },
  { id: 'mais-4h', label: 'Mais de 4h', media: 5 },
]
