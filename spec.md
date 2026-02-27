# SPEC.md — Calculadora de Direitos Trabalhistas Jianoti

> Documento de especificação completa para desenvolvimento no Cursor IDE.  
> Versão 1.0 — Fevereiro 2026  
> Pode e deve ser editado conforme o projeto evolui.

-----

## 1. Visão Geral do Produto

### O que é

Uma calculadora de direitos trabalhistas 100% client-side (sem backend, sem admin) embarcada como landing page no domínio jianoti.com.br. O objetivo é conscientizar trabalhadores brasileiros — especialmente blue collar — sobre seus direitos, calcular valores estimados e capturar leads qualificados para o escritório de advocacia trabalhista Jianoti.

### Diferencial central

**Funciona para trabalhadores COM e SEM carteira assinada.** A maioria das calculadoras existentes só atende quem tem registro formal. Esta calculadora informa explicitamente ao trabalhador sem carteira que ele tem os mesmos direitos garantidos por lei e pode reivindicá-los na Justiça do Trabalho.

### Objetivo de negócio

Geração de leads via formulário de captura com gatilho de revelação de resultado. O lead é enviado via webhook POST para n8n, que dispara o resultado por WhatsApp e e-mail.

-----

## 2. Stack Técnica

|Camada     |Tecnologia                         |Justificativa                                          |
|-----------|-----------------------------------|-------------------------------------------------------|
|Framework  |React 18 + Vite                    |Build leve, rápido, ideal para SPA estático            |
|Estilo     |Tailwind CSS (utility-first)       |Sem lib pesada, total controle visual                  |
|Estado     |Zustand                            |~1kb, simples, sem boilerplate                         |
|Formulários|React Hook Form                    |Sem re-renders desnecessários                          |
|Datas      |Day.js                             |Muito mais leve que moment.js                          |
|Ícones     |SVG inline                         |Zero dependência externa                               |
|Fontes     |Google Fonts (Sora + Inter)        |Conforme brand guidelines                              |
|Deploy     |Build estático (HTML/JS/CSS)       |Pode ser hospedado no Webflow via embed ou qualquer CDN|
|Integração |Fetch API nativo (POST webhook n8n)|Sem biblioteca extra                                   |

### Restrições de performance

- Bundle final: **máximo 400kb** (gzipped) — permite microinterações, transições e visual mais rico
- Animações CSS permitidas: transições suaves entre etapas do wizard, micro-feedbacks em botões e inputs, efeito de reveal no resultado. Manter `prefers-reduced-motion` respeitado.
- Lazy loading por etapa do wizard
- Target de conexão: **Wi-Fi doméstico ou 4G** — não precisa funcionar em 3G
- Pode usar fontes via Google Fonts com `display=swap`
- Imagens/ilustrações leves permitidas (SVG ou WebP otimizado)
- Sem localStorage nem cookies (LGPD-safe por padrão)
- **Não há backend, não há banco de dados, não há autenticação**

-----

## 3. Design System

### Paleta de cores (Brand Guidelines Jianoti 2024)

```css
--color-neon-blue: #5D6EEC;   /* Principal — CTAs, destaques, links */
--color-midnight: #1E2243;    /* Fundo escuro, textos, header */
--color-violet: #4653B1;      /* Hover states, elementos secundários */
--color-platinum: #E9E9E9;    /* Fundos claros, backgrounds */
--color-silver: #AFAFAF;      /* Textos secundários, placeholders */
--color-raspberry: #C63968;   /* Alertas críticos, avisos importantes */
--color-clay: #DC6242;        /* Avisos moderados, deduções na tabela */
--color-white: #FFFFFF;       /* Textos sobre fundos escuros */
```

### Tipografia

- **Sora** — fonte primária: títulos, headings, valores numéricos de destaque
- **Inter** — fonte secundária: corpo de texto, labels, descrições, tabelas

### Tom visual

Geométrico, limpo, confiante. Elementos decorativos em arco/quarto de círculo (conforme brand). Sem sombras pesadas, sem gradientes complexos.

### Linguagem

100% português brasileiro. Linguagem simples, direta, sem juridiquês. Todo termo técnico jurídico que precisar aparecer deve vir acompanhado de explicação em parênteses ou tooltip. Exemplo: *“FGTS (dinheiro que a empresa guarda todo mês no seu nome)”*.

-----

## 4. Arquitetura de Componentes

```
src/
├── main.jsx
├── App.jsx
├── store/
│   └── wizardStore.js          # Zustand — estado global do wizard
├── assets/
│   └── (imagens estáticas — ex: fallback-avatar.svg, logo.svg)
│       # Fotos das advogadas são carregadas via URL do CDN Webflow (calcConstants.js)
│       # Não armazenar fotos das advogadas aqui — manter via CDN para facilitar atualização
├── constants/
│   ├── calcConstants.js        # Salário mínimo, percentuais CLT, tabelas, FOTOS_ADVOGADOS
│   └── whatsappNumbers.js      # Lista de números de atendimento (único lugar para editar)
├── utils/
│   ├── dateUtils.js            # Cálculos de período, prescrição
│   ├── calcEngine.js           # Motor de cálculo (todas as verbas)
│   ├── webhookService.js       # POST para n8n
│   └── whatsappService.js      # Sortear número, gerar links, mensagens padrão
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── wizard/
│   │   ├── WizardContainer.jsx # Gerencia etapas, navegação, progresso
│   │   ├── ProgressBar.jsx
│   │   ├── Step1Periodo.jsx
│   │   ├── Step2Vinculo.jsx
│   │   ├── Step3Detalhes.jsx
│   │   ├── Step4Rescisao.jsx
│   │   ├── Step5Jornada.jsx
│   │   └── StepPrescricao.jsx  # Tela de bloqueio por prescrição
│   ├── result/
│   │   ├── ResultContainer.jsx
│   │   ├── ResultBlurred.jsx   # Total embaçado + CTA revelar
│   │   ├── LeadForm.jsx        # Formulário nome/WhatsApp/email
│   │   ├── Rightslist.jsx      # Lista de direitos identificados
│   │   └── CalcTable.jsx       # Tabela de verbas e valores
│   └── ui/
│       ├── Button.jsx
│       ├── Select.jsx
│       ├── Input.jsx
│       ├── Toggle.jsx
│       ├── Tooltip.jsx         # Para explicar termos técnicos
│       ├── AlertBanner.jsx     # Banners informativos (azul/amarelo/vermelho)
│       ├── MonthYearPicker.jsx # Seletor mês/ano customizado
│       └── WhatsAppBadge.jsx   # Badge flutuante fixo (renderizado em App.jsx)
```

-----

## 5. Fluxo do Wizard — UX Detalhada

### Visão geral do fluxo

O wizard tem dois caminhos paralelos a partir do Step 2 (com ou sem carteira), que convergem no Step 4 em diante. O Step 4 só aparece se o usuário já saiu do emprego.

```
[Step 1: Período]
    │
    ├─ data de saída preenchida? → verificar prescrição
    │       ├─ prescrito (> 24 meses): → [Tela Prescrição] ← FIM (com CTA WhatsApp)
    │       └─ ok: continuar
    │
    ▼
[Step 2: Vínculo] — "Tinha carteira assinada?"
    │
    ├─ SIM → [Banner: direitos com carteira] → [Step 3a: Detalhes CLT]
    │                                               │
    └─ NÃO → [Banner: mesmos direitos sem carteira] → [Step 3b: Detalhes sem carteira]
                                                          │
                                          ┌───────────────┘
                                          ▼
                            [Step 4: Rescisão] — só exibido se aindaTrabalhando === false
                                          │
                                          ▼
                                  [Step 5: Jornada]
                                          │
                                          ▼
                              [Resultado Bloqueado + total blur]
                                          │
                                          ▼
                                  [Formulário Lead]
                                          │
                                          ▼
                              [Resultado Revelado completo]
```

**Regras de navegação do WizardContainer:**

- Step 3a e Step 3b são mutuamente exclusivos — renderizar apenas um conforme `temCarteira`
- Step 4 só é inserido na sequência se `aindaTrabalhando === false`
- Se `aindaTrabalhando === true`: sequência é Step1 → Step2 → Step3 → Step5 → Resultado
- Se `aindaTrabalhando === false`: sequência é Step1 → Step2 → Step3 → Step4 → Step5 → Resultado
- A ProgressBar deve refletir o número correto de etapas conforme o caminho do usuário

-----

### Step 1 — Período de Trabalho

**Campos:**

- Mês e ano de início (seletor mês/ano — sem dia)
- Mês e ano de saída (seletor mês/ano) OU checkbox “Ainda estou trabalhando nesse emprego”
- Função/profissão (select agrupado — ver Seção 7)
- Salário mensal em R$ (input numérico — aceitar vírgula e ponto)

**Lógica de prescrição (executada ao sair do campo de data de saída):**

```
SE data_saida existe:
  meses_desde_saida = diferença em meses entre data_saida e hoje
  
  SE meses_desde_saida > 24:
    → redirecionar para StepPrescricao (tela de bloqueio)
  
  SE meses_desde_saida entre 18 e 24:
    → exibir alerta amarelo: "Atenção: seu prazo está acabando. 
       Você tem até 2 anos após sair do emprego para entrar com 
       ação na Justiça do Trabalho."
```

**Tela de Prescrição (StepPrescricao):**

Exibir card com fundo Midnight (`#1E2243`) e texto branco:

> **“Seu prazo para essa ação pode ter passado”**
> 
> A lei trabalhista dá 2 anos depois que você sai de um emprego para entrar com uma ação na Justiça do Trabalho. Pelo que você informou, esse tempo já passou para esse vínculo.
> 
> Mas não desista sem falar com um advogado — em alguns casos especiais esse prazo pode ser diferente, e um especialista pode avaliar sua situação de graça.

CTA primário: **“Falar com um advogado agora”** → link gerado via `gerarLinkWhatsApp(numero, MENSAGENS_WHATSAPP.prescricao)` — usar número do Zustand store (Seção 12)
CTA secundário: **“Calcular outro emprego”** → reinicia wizard (resetar todo o estado do Zustand, exceto `whatsappNumero` e `advogadoAleatorio` que permanecem os mesmos)

-----

### Step 2 — Vínculo Empregatício

**Pergunta:** “Você tinha carteira assinada nesse emprego?”

Dois botões grandes (não radio button pequeno):

- ✅ **Sim, tinha carteira assinada**
- 📋 **Não, trabalhava sem carteira**

**Se SEM carteira → exibir AlertBanner antes de continuar:**

> 🔵 **Mesmo sem carteira, você tem os mesmos direitos!**
> 
> A lei brasileira garante que todo trabalhador tem direito a FGTS, férias, 13º salário, horas extras e muito mais — mesmo que a empresa nunca tenha assinado sua carteira. Na Justiça do Trabalho, você pode reivindicar tudo isso, incluindo o registro retroativo na sua carteira, recolhimento do INSS e até seguro-desemprego.
> 
> Vamos calcular tudo o que você tem direito a receber.

-----

### Step 3a — Detalhes (COM carteira assinada)

**Campos:**

- “Você foi registrado desde o primeiro dia de trabalho?” (Sim / Não)
  - Se Não: “Em que mês e ano foi registrado?” (seletor mês/ano)
- “Você recebia algum valor em dinheiro fora do seu contracheque?” (Sim / Não)
  - *Explicação abaixo: “Às vezes chamado de ‘pagamento por fora’ ou ‘caixa dois’ — quando o patrão paga parte do salário em espécie, sem aparecer no recibo.”*
  - Se Sim: “Quanto recebia por fora por mês?” (input R$)

-----

### Step 3b — Detalhes (SEM carteira assinada)

**Pergunta:** “Você recebia algum benefício do governo nesse período?”

Checkboxes (pode marcar mais de um):

|Benefício                  |Explicação exibida na tela                                     |
|---------------------------|---------------------------------------------------------------|
|BPC/LOAS                   |Benefício para pessoas com deficiência ou idosos de baixa renda|
|Bolsa Família              |Programa de transferência de renda cadastrado no CadÚnico      |
|Seguro-desemprego          |Benefício pago após demissão sem justa causa                   |
|Aposentadoria por invalidez|Benefício do INSS por incapacidade permanente para o trabalho  |
|Nenhum desses              |—                                                              |

**Cada benefício marcado gera um alerta amarelo no resultado**, explicando o possível impacto (não bloqueia o cálculo).

-----

### Step 4 — Rescisão (só exibido se já saiu do emprego)

**Campo 1 — Motivo da saída:**

Select com as opções:

1. Pedido de demissão *(eu mesmo pedi pra sair)*
1. Fui demitido sem justa causa *(me mandaram embora sem motivo)*
1. Fui demitido com justa causa *(me mandaram embora por falta grave)*
1. Fim do contrato de experiência *(o período de teste terminou)*
1. Fui demitido antes do fim do contrato de experiência *(a empresa cancelou antes do prazo)*
1. Saí antes do fim do contrato de experiência *(eu mesmo saí antes do prazo)*
1. Falecimento do empregado *(caso esteja preenchendo por outra pessoa)*

**Campo 2 — Aviso prévio:**
“Você cumpriu/trabalhou o aviso prévio?” (Sim / Não / Não se aplica)

- *Explicação: “Aviso prévio é o período de 30 dias (ou mais) que você trabalha após ser demitido ou pedir demissão, para a empresa ter tempo de te substituir.”*

-----

### Step 5 — Jornada de Trabalho

**Campos:**

- “Você fazia horas extras?” (Sim / Não)
  - Se Sim: “Quantas horas extras por semana, em média?” (select: 1-2h / 3-5h / 6-10h / mais de 10h)
- “Você trabalhava no período da noite?” (Sim / Não)
  - *Explicação: “Trabalho noturno é o feito entre 22h e 5h da manhã. Quem trabalha nesse horário tem direito a receber 20% a mais por hora.”*
  - Se Sim: “Quantas horas por noite, em média?” (select: até 2h / 2-4h / mais de 4h)
- “Você trabalhava aos domingos ou feriados?” (Sim / Não)
  - *Explicação: “Trabalhar no domingo ou feriado sem folga compensatória dá direito a receber o dobro por essas horas.”*

-----

## 6. Motor de Cálculo (`calcEngine.js`)

### Constantes (atualizáveis em `calcConstants.js`)

```javascript
export const CONSTANTS = {
  SALARIO_MINIMO: 1518.00,           // Atualizar anualmente
  HORAS_SEMANA_CLT: 44,
  HORAS_MES_CLT: 220,
  FGTS_PERCENTUAL: 0.08,
  MULTA_FGTS_SEM_JUSTA_CAUSA: 0.40,
  ADICIONAL_FERIAS: 1 / 3,
  ADICIONAL_HORA_EXTRA_UTIL: 0.50,
  ADICIONAL_HORA_EXTRA_DOMINGO: 1.00,
  ADICIONAL_NOTURNO: 0.20,
  ADICIONAL_INSALUBRIDADE_MINIMO: 0.10,
  ADICIONAL_INSALUBRIDADE_MEDIO: 0.20,
  ADICIONAL_INSALUBRIDADE_MAXIMO: 0.40,
  ADICIONAL_PERICULOSIDADE: 0.30,
  PRESCRICAO_BIENAL_MESES: 24,
  PRESCRICAO_QUINQUENAL_MESES: 60,

  // Tabela seguro-desemprego 2025 (MTE) — faixas de salário
  SEGURO_DESEMPREGO: [
    { ate: 2106.08, percentual: 0.80 },
    { ate: 3513.34, percentual: 0.50 },
    { acima: 3513.34, fixo: 2251.50 },
  ],

  // Parcelas seguro-desemprego por tempo de serviço
  SEGURO_PARCELAS: [
    { meses_min: 6,  meses_max: 11, parcelas: 3 },
    { meses_min: 12, meses_max: 23, parcelas: 4 },
    { meses_min: 24, meses_max: 999, parcelas: 5 },
  ],
}
```

-----

### Lógica de prescrição aplicada nos cálculos

```javascript
function calcularPeriodoEfetivo(dataInicio, dataSaida, temCarteira) {
  const hoje = dayjs()
  const saida = dataSaida || hoje  // se ainda trabalhando, usa hoje

  // Retroativo máximo permitido por lei
  let dataMinima
  if (!dataSaida) {
    // Ainda trabalhando → prescrição quinquenal (5 anos)
    dataMinima = hoje.subtract(60, 'month')
  } else {
    // Já saiu → prescrição bienal (2 anos após saída)
    // Os cálculos retroativos são limitados a 5 anos antes da saída
    dataMinima = saida.subtract(60, 'month')
  }

  const inicioEfetivo = dayjs(dataInicio).isBefore(dataMinima)
    ? dataMinima
    : dayjs(dataInicio)

  return {
    inicioEfetivo,
    fimEfetivo: saida,
    mesesTotais: saida.diff(inicioEfetivo, 'month'),
    mesesReais: saida.diff(dayjs(dataInicio), 'month'),
    periodoFoiCortado: dayjs(dataInicio).isBefore(dataMinima),
  }
}
```

-----

### Cálculo do salário base real

```javascript
// "Salário por fora" é exclusivo de trabalhadores COM carteira assinada (Step 3a).
// Trabalhadores SEM carteira NÃO têm esse campo — salarioReal é sempre o salário informado.
const salarioReal = (respostas.temCarteira && respostas.salarioPorFora)
  ? respostas.salario + respostas.valorPorFora
  : respostas.salario
```

-----

### Verbas calculadas — fórmulas detalhadas

#### 1. Saldo de Salário

```
// SE aindaTrabalhando === true:
//   Não calcular saldo de salário — o empregado ainda está recebendo normalmente.
//   Não exibir essa linha na tabela de resultado.

// SE aindaTrabalhando === false:
//   O wizard coleta apenas mês e ano de saída (sem dia exato).
//   Assumir mês completo trabalhado como estimativa conservadora.
//   valor = salarioReal (salário integral do último mês)
```

Exibir nota no resultado: *“Calculamos o último mês como completo. Se você saiu antes do fim do mês, o valor exato será menor — um advogado pode calcular com precisão.”*

#### 2. Férias Vencidas + 1/3

```
Considerar apenas o último período aquisitivo completo (últimos 12 meses).
Períodos anteriores NÃO entram no cálculo — a calculadora é uma estimativa
conservadora e períodos mais antigos dependem de prova documental.

SE mesesTotais >= 12:
  valor = salarioReal * 1 * (1 + 1/3)   // apenas 1 período (o último)
SENÃO:
  valor = 0  // ainda no primeiro período aquisitivo, sem férias vencidas
```

Exibir nota no resultado: *“Calculamos as férias do último período completo de 12 meses. Se você trabalhou mais tempo sem tirar férias, pode ter direito a períodos anteriores também — um advogado pode avaliar isso.”*

#### 3. Férias Proporcionais + 1/3

```
// Meses trabalhados dentro do período aquisitivo em curso (após o último
// aniversário de contrato, ou desde o início se menos de 12 meses)
mesesProporcional = mesesTotais % 12
// Fração >= 15 dias conta como mês completo
valor = (salarioReal / 12) * mesesProporcional * (1 + 1/3)
```

#### 4. 13º Salário

```
// Considerar apenas o ano calendário corrente (ou o último ano se já saiu).
// Anos anteriores NÃO entram no cálculo pela mesma razão das férias.

mesesNoAno = meses trabalhados de janeiro até o mês de saída
             (ou até o mês atual, se ainda trabalhando)
             limitado a 12

// Fração >= 15 dias conta como mês completo
valor = (salarioReal / 12) * mesesNoAno
```

Exibir nota no resultado: *“Calculamos o 13º do ano atual (ou do último ano trabalhado). Se houver 13º de anos anteriores em aberto, isso também pode ser reivindicado — consulte um advogado.”*

#### 5. FGTS Acumulado

```
// CENÁRIO A — Trabalhador COM carteira, registrado desde o 1º dia
fgtsAcumulado = salarioReal * 0.08 * mesesEfetivos

// CENÁRIO B — Trabalhador COM carteira, mas registrado depois do 1º dia
// Calcular dois períodos separados e somar:
//   Período sem registro: do dataInicio até dataMesRegistro (exclusive)
//   Período com registro: de dataMesRegistro até fimEfetivo
mesesSemRegistro  = dataMesRegistro.diff(dataInicioEfetivo, 'month')
mesesComRegistro  = fimEfetivo.diff(dataMesRegistro, 'month')
fgtsSemRegistro   = salarioReal * 0.08 * mesesSemRegistro  // direito adicional
fgtsComRegistro   = salarioReal * 0.08 * mesesComRegistro
fgtsAcumulado     = fgtsComRegistro  // base para multa 40%

// Exibir como duas linhas no resultado:
// - "FGTS do período registrado" → fgtsComRegistro
// - "FGTS do período sem registro (direito adicional)" → fgtsSemRegistro

// CENÁRIO C — Trabalhador SEM carteira
// dataInicioEfetivo = max(dataInicio, hoje - 60 meses)
fgtsAcumulado = salarioReal * 0.08 * mesesEfetivos
// Exibir como "FGTS não depositado — a receber na Justiça"
// A multa de 40% se aplica sobre o total (fgtsAcumulado) se configurar dispensa sem justa causa
```

- **Cenário A:** saldo disponível para saque
- **Cenário B:** separa o que está na conta (com registro) do direito adicional (sem registro)
- **Cenário C:** valor total não depositado, acessível apenas via ação judicial

#### 6. Multa de 40% sobre FGTS

Aplicada nos seguintes casos de rescisão:

- Dispensa sem justa causa
- Rescisão antecipada do contrato pelo empregador

```
valor = fgtsAcumulado * 0.40
```

#### 7. Aviso Prévio Indenizado

Aplicado quando o trabalhador não cumpriu aviso prévio (foi dispensado de cumprir) e foi dispensado sem justa causa:

```
diasAviso = 30 + (3 * anosCompletos trabalhados), máximo 90 dias
valor = (salarioReal / 30) * diasAviso
```

*Base: Art. 487 + 488 CLT + Lei 12.506/2011*

#### 7b. Indenização por Rescisão Antecipada do Contrato de Experiência (pelo empregador)

Aplicado exclusivamente quando motivoRescisao === “rescisao_antecipada_empregador”:

```
// O empregador deve indenizar os dias restantes do contrato + 50% (Art. 479 CLT)
// Como não perguntamos a duração total do contrato de experiência no wizard,
// assumir duração padrão de 90 dias (máximo legal) como estimativa conservadora.

diasContrato = 90  // duração padrão assumida
diasTrabalhados = mesesReais * 30  // aproximação
diasRestantes = max(0, diasContrato - diasTrabalhados)
valor = (salarioReal / 30) * diasRestantes * 1.50
```

Exibir nota: *“Calculamos com base no contrato de experiência padrão de 90 dias. O valor exato depende da duração real do seu contrato.”*

#### 8. Horas Extras

As horas extras de dias úteis e de domingos são calculadas **separadamente** e exibidas como duas linhas distintas na tabela. Isso evita dupla contagem: as horas informadas pelo usuário no Step 5 representam horas extras de dias úteis; o trabalho aos domingos é uma verba separada calculada com base em 1 domingo por semana como estimativa conservadora.

```
valorHoraCLT = salarioReal / 220
semanasEfetivas = mesesEfetivos * 4.33

// LINHA 1 — Horas extras em dias úteis (adicional de 50%)
// Usar as horas semanais informadas pelo usuário no Step 5
// Mapear faixa selecionada para valor numérico:
//   "1-2h"       → 1.5h (média)
//   "3-5h"       → 4h   (média)
//   "6-10h"      → 8h   (média)
//   "mais de 10h"→ 12h  (estimativa conservadora)
horasSemanaisDiasUteis = mediaHorasFaixa(horasExtrasSemana)
totalHorasExtrasUteis = horasSemanaisDiasUteis * semanasEfetivas * (valorHoraCLT * 1.50)

// LINHA 2 — Trabalho aos domingos/feriados (adicional de 100%)
// Só calcular se trabalhaDomingo === true (Step 5)
// Assumir 1 domingo trabalhado por semana como estimativa conservadora
// Assumir 1h de hora extra por domingo (além da jornada normal)
totalDomingos = trabalhaDomingo
  ? semanasEfetivas * 1 * (valorHoraCLT * 2.00)
  : 0
```

Exibir como duas linhas separadas no resultado:

- *“Horas extras em dias de semana”* → totalHorasExtrasUteis
- *“Trabalho aos domingos e feriados”* → totalDomingos

#### 9. Adicional Noturno

```
valorHoraCLT = salarioReal / 220
semanasEfetivas = mesesEfetivos * 4.33

// Mapear faixa selecionada no Step 5 para valor numérico:
//   "até 2h"    → 1.5h (média)
//   "2-4h"      → 3h   (média)
//   "mais de 4h"→ 5h   (estimativa conservadora)
horasNoturnasSemanais = mediaHorasNoturnasFaixa(horasNoturnas)

adicional = valorHoraCLT * 0.20 * horasNoturnasSemanais * semanasEfetivas
```

Nota: hora noturna CLT tem redução ficta de 52min30s (equivale a 1h normal), mas para simplificar a estimativa usar hora cheia — diferença é marginal e favorece o trabalhador.

#### 10. Adicional de Insalubridade

```
grau = definido pela função (ver Seção 7)
valor = SALARIO_MINIMO * grau * mesesEfetivos
```

*Base: Art. 192 CLT + NR-15*

#### 11. Adicional de Periculosidade

```
valor = salarioReal * 0.30 * mesesEfetivos
```

*Base: Art. 193 CLT + NR-16*
*Obs: Insalubridade e periculosidade são excludentes — trabalhador escolhe o mais vantajoso. A calculadora exibe os dois e informa isso.*

#### 12. Seguro-Desemprego (estimativa)

A tabela MTE usa faixas progressivas — não é um percentual simples sobre o salário total. A fórmula abaixo implementa as três faixas corretamente:

```
// Constantes (atualizar em calcConstants.js conforme reajuste do MTE)
FAIXA1_TETO = 2106.08
FAIXA2_TETO = 3513.34
VALOR_MAXIMO = 2251.50

function calcularParcelaBruta(salario):
  SE salario <= FAIXA1_TETO:
    // Faixa 1: 80% do salário integral
    parcela = salario * 0.80

  SENÃO SE salario <= FAIXA2_TETO:
    // Faixa 2: 80% da FAIXA1_TETO + 50% do que exceder FAIXA1_TETO
    excedente = salario - FAIXA1_TETO
    parcela = (FAIXA1_TETO * 0.80) + (excedente * 0.50)

  SENÃO:
    // Faixa 3: valor fixo máximo
    parcela = VALOR_MAXIMO

  RETORNAR min(parcela, VALOR_MAXIMO)  // nunca ultrapassar o teto

// Número de parcelas conforme meses trabalhados (mesesReais, não mesesEfetivos)
function calcularNumeroParcelas(mesesReais):
  SE mesesReais < 6:   RETORNAR 0  // sem direito
  SE mesesReais <= 11: RETORNAR 3
  SE mesesReais <= 23: RETORNAR 4
  SENÃO:               RETORNAR 5

// Total estimado
numeroParcelas = calcularNumeroParcelas(mesesReais)
valorParcela   = calcularParcelaBruta(salarioReal)
totalSeguro    = numeroParcelas * valorParcela

// SE sem direito (mesesReais < 6): não exibir linha na tabela
// SE com direito: exibir como "X parcelas de R$ Y.YYY,YY"
```

Exibir com nota: *“Esse é um valor estimado. O valor exato depende do seu histórico completo e é calculado pelo governo.”*
Exibir nota adicional se mesesReais < 6: *“Você precisa ter trabalhado pelo menos 6 meses para ter direito ao seguro-desemprego.”*

-----

### Matriz de verbas por tipo de rescisão

|Verba                                     |Pedido demissão|Disp. s/ justa causa|Disp. c/ justa causa|Fim contrato exp.|Rescisão antecip. empregador|Rescisão antecip. empregado|
|------------------------------------------|:-------------:|:------------------:|:------------------:|:---------------:|:--------------------------:|:-------------------------:|
|Saldo salário                             |✅              |✅                   |✅                   |✅                |✅                           |✅                          |
|Férias vencidas + 1/3                     |✅              |✅                   |✅                   |✅                |✅                           |✅                          |
|Férias proporcionais + 1/3                |✅              |✅                   |❌                   |✅                |✅                           |✅                          |
|13º proporcional                          |✅              |✅                   |❌                   |✅                |✅                           |✅                          |
|FGTS acumulado                            |✅              |✅                   |✅                   |✅                |✅                           |✅                          |
|Multa 40% FGTS                            |❌              |✅                   |❌                   |❌                |✅                           |❌                          |
|Aviso prévio indenizado                   |❌              |✅ *                 |❌                   |❌                |✅                           |❌                          |
|Indeniz. dias restantes contrato (item 7b)|❌              |❌                   |❌                   |❌                |✅                           |❌                          |
|Seguro-desemprego                         |❌              |✅                   |❌                   |❌                |✅                           |❌                          |
|Multa pela saída antecipada               |❌              |❌                   |❌                   |❌                |❌                           |⚠️ alerta                   |

** Somente se não cumpriu aviso prévio*

-----

### Verbas completas para trabalhador SEM carteira assinada

O trabalhador sem carteira tem direito a **exatamente as mesmas verbas** de quem tem registro formal. Na Justiça do Trabalho, a ação de reconhecimento de vínculo empregatício garante o cálculo retroativo de tudo — limitado à prescrição de 5 anos se ainda estiver trabalhando, ou 2 anos após a saída (com retroativo de até 5 anos).

O motor de cálculo deve rodar **todas as verbas da matriz de rescisão normalmente**, apenas alterando os rótulos e sinalizações na interface. Adicionalmente, incluir as verbas abaixo como exclusivas desse cenário:

#### Verbas calculadas (mesmas do trabalhador com carteira)

Todas as verbas da matriz de rescisão se aplicam normalmente:

|Verba                         |Como aparece no resultado                                  |
|------------------------------|-----------------------------------------------------------|
|Saldo de salário              |“Dias trabalhados não pagos”                               |
|Férias vencidas + 1/3         |“Férias que você tinha direito e não recebeu”              |
|Férias proporcionais + 1/3    |“Férias proporcionais não pagas”                           |
|13º salário proporcional      |“13º salário não pago”                                     |
|FGTS (8%/mês)                 |“FGTS não depositado — a receber na Justiça”               |
|Multa 40% sobre FGTS          |“Multa por demissão sem justa causa — a receber na Justiça”|
|Aviso prévio indenizado       |“Aviso prévio — a receber na Justiça”                      |
|Horas extras                  |“Horas extras não pagas”                                   |
|Adicional noturno             |“Adicional noturno não pago”                               |
|Adicional de insalubridade    |“Adicional de insalubridade não pago”                      |
|Adicional de periculosidade   |“Adicional de periculosidade não pago”                     |
|Seguro-desemprego (estimativa)|“Seguro-desemprego — a receber na Justiça”                 |

#### Verbas e direitos exclusivos de quem não tinha carteira

Além de tudo acima, incluir no resultado as seguintes verbas/direitos:

**1. Notificação sobre multa administrativa (Art. 47 CLT) — informativo**
A multa do Art. 47 da CLT (R$ 3.000,00 por empregado não registrado, conforme Lei 13.467/2017) tem **natureza administrativa** e é aplicada pelo Ministério do Trabalho ao empregador. Ela **não reverte financeiramente ao trabalhador** — vai para a Fazenda Nacional. Portanto, **não entra no cálculo** e não aparece na tabela de verbas.

Exibir apenas como alerta informativo no resultado:

> *“A falta de registro em carteira também sujeita a empresa a uma multa de R$ 3.000,00 aplicada pelo Ministério do Trabalho — mas esse valor não vai para você. O que você tem direito a receber são todas as verbas listadas acima.”*

**2. INSS não recolhido (informativo)**
Não calcular valor monetário direto (pois o recolhimento vai para a Previdência, não para o trabalhador). Exibir como direito informativo:

> *“Com o reconhecimento do vínculo, o INSS de todo o período será recolhido. Isso conta como tempo de contribuição para sua aposentadoria.”*

**3. Anotação retroativa em CTPS**
Sem valor monetário. Exibir como direito informativo com destaque:

> *“Você tem direito a ter sua carteira de trabalho assinada retroativamente, a partir da data real de início do trabalho.”*

**4. Seguro-desemprego retroativo**
Calcular a estimativa normalmente (mesmo cálculo do trabalhador com carteira, se o caso configurar dispensa sem justa causa). Exibir com nota:

> *“Com o reconhecimento do vínculo e demissão sem justa causa reconhecida, você pode ter direito ao seguro-desemprego. Valor estimado sujeito a análise.”*

**5. Vale-transporte e vale-refeição não pagos (informativo)**
Não calcular valor (depende de convenção coletiva da categoria). Exibir como alerta:

> *“Dependendo da sua categoria profissional, você também pode ter direito a vale-transporte e vale-refeição retroativos. Um advogado pode verificar isso pela convenção coletiva da sua área.”*

**6. Diferenças salariais (se recebia abaixo do piso da categoria)**
Não calcular automaticamente (depende de convenção coletiva). Exibir como alerta:

> *“Se você recebia menos do que o valor mínimo definido para a sua profissão, você tem direito a receber a diferença de todo o período.”*

#### Rótulo global no resultado para trabalhador sem carteira

Todas as verbas calculadas devem aparecer com o badge **“A receber na Justiça do Trabalho”** em Neon Blue (`#5D6EEC`) em vez de “A receber na rescisão”.

**Banner destacado no topo do resultado:**

> 🔵 **“Mesmo sem carteira assinada, a lei garante todos esses direitos para você.”**
> 
> *Tudo que você vê abaixo pode ser reivindicado na Justiça do Trabalho — inclusive o registro retroativo na sua carteira, recolhimento do INSS de todo o período e direito ao seguro-desemprego. Um advogado trabalhista pode entrar com essa ação por você, muitas vezes sem custo inicial.*

-----

## 7. Mapa de Funções → Adicionais

### Select agrupado de funções

```javascript
export const FUNCOES = [
  {
    grupo: "Construção Civil",
    funcoes: [
      { id: "pedreiro", label: "Pedreiro", insalubridade: "medio", periculosidade: false },
      { id: "eletricista", label: "Eletricista", insalubridade: false, periculosidade: true },
      { id: "soldador", label: "Soldador", insalubridade: false, periculosidade: true },
      { id: "encanador", label: "Encanador / Hidráulico", insalubridade: "medio", periculosidade: false },
      { id: "pintor", label: "Pintor", insalubridade: "medio", periculosidade: false },
      { id: "armador", label: "Armador de Ferro", insalubridade: "medio", periculosidade: false },
      { id: "servente", label: "Servente / Ajudante de Obra", insalubridade: "minimo", periculosidade: false },
      { id: "mestre_obras", label: "Mestre de Obras", insalubridade: "minimo", periculosidade: false },
      { id: "carpinteiro", label: "Carpinteiro / Marceneiro", insalubridade: "minimo", periculosidade: false },
    ]
  },
  {
    grupo: "Limpeza e Conservação",
    funcoes: [
      { id: "aux_limpeza", label: "Auxiliar de Limpeza", insalubridade: "minimo", periculosidade: false },
      { id: "porteiro", label: "Porteiro / Recepcionista", insalubridade: false, periculosidade: false },
      { id: "zelador", label: "Zelador", insalubridade: "minimo", periculosidade: false },
      { id: "gari", label: "Gari / Coletor de Lixo", insalubridade: "maximo", periculosidade: false },
      { id: "limpador_vidros", label: "Limpador de Vidros (altura)", insalubridade: "medio", periculosidade: true },
    ]
  },
  {
    grupo: "Transporte e Logística",
    funcoes: [
      { id: "motorista", label: "Motorista (carro/van/ônibus)", insalubridade: false, periculosidade: false },
      { id: "caminhoneiro", label: "Motorista de Caminhão", insalubridade: false, periculosidade: false },
      { id: "motoboy", label: "Motoboy / Entregador de Moto", insalubridade: false, periculosidade: true },
      { id: "empilhadeirista", label: "Operador de Empilhadeira", insalubridade: false, periculosidade: true },
      { id: "ajudante_entrega", label: "Ajudante de Entrega", insalubridade: false, periculosidade: false },
      { id: "repositor", label: "Repositor de Estoque", insalubridade: false, periculosidade: false },
    ]
  },
  {
    grupo: "Indústria e Produção",
    funcoes: [
      { id: "op_maquinas", label: "Operador de Máquinas", insalubridade: "medio", periculosidade: false },
      { id: "metalurgico", label: "Metalúrgico / Fundidor", insalubridade: "maximo", periculosidade: true },
      { id: "tec_manutencao", label: "Técnico de Manutenção", insalubridade: "medio", periculosidade: false },
      { id: "montador", label: "Montador de Linha", insalubridade: "minimo", periculosidade: false },
      { id: "op_producao", label: "Auxiliar de Produção", insalubridade: "minimo", periculosidade: false },
      { id: "quimico", label: "Operador Químico / Petroquímico", insalubridade: "maximo", periculosidade: true },
    ]
  },
  {
    grupo: "Saúde e Cuidados",
    funcoes: [
      { id: "tec_enfermagem", label: "Técnico de Enfermagem", insalubridade: "maximo", periculosidade: false },
      { id: "aux_saude", label: "Auxiliar de Saúde / Clínica", insalubridade: "maximo", periculosidade: false },
      { id: "cuidador", label: "Cuidador de Idosos", insalubridade: "medio", periculosidade: false },
      { id: "aux_veterinario", label: "Auxiliar Veterinário", insalubridade: "medio", periculosidade: false },
    ]
  },
  {
    grupo: "Alimentação e Hospitalidade",
    funcoes: [
      { id: "cozinheiro", label: "Cozinheiro / Chef", insalubridade: "minimo", periculosidade: false },
      { id: "aux_cozinha", label: "Auxiliar de Cozinha", insalubridade: "minimo", periculosidade: false },
      { id: "garcom", label: "Garçom / Garçonete", insalubridade: false, periculosidade: false },
      { id: "padeiro", label: "Padeiro / Confeiteiro", insalubridade: "minimo", periculosidade: false },
      { id: "atendente_lanchonete", label: "Atendente de Lanchonete / Fast Food", insalubridade: false, periculosidade: false },
    ]
  },
  {
    grupo: "Comércio e Varejo",
    funcoes: [
      { id: "vendedor", label: "Vendedor / Atendente de Loja", insalubridade: false, periculosidade: false },
      { id: "caixa", label: "Operador de Caixa", insalubridade: false, periculosidade: false },
      { id: "estoquista", label: "Estoquista / Almoxarife", insalubridade: false, periculosidade: false },
      { id: "promotor", label: "Promotor de Vendas / Demonstrador", insalubridade: false, periculosidade: false },
    ]
  },
  {
    grupo: "Segurança",
    funcoes: [
      { id: "vigilante", label: "Vigilante / Segurança (armado)", insalubridade: false, periculosidade: true },
      { id: "seguranca", label: "Segurança / Vigia (desarmado)", insalubridade: false, periculosidade: false },
    ]
  },
  {
    grupo: "Trabalho Doméstico",
    funcoes: [
      { id: "domestico", label: "Empregado(a) Doméstico(a)", insalubridade: false, periculosidade: false, regra_especial: "LC_150_2015" },
      { id: "baba", label: "Babá / Cuidador de Crianças", insalubridade: false, periculosidade: false, regra_especial: "LC_150_2015" },
      { id: "diarista", label: "Diarista (até 2x por semana)", insalubridade: false, periculosidade: false, regra_especial: "diarista" },
      { id: "caseiro", label: "Caseiro / Jardineiro Doméstico", insalubridade: false, periculosidade: false, regra_especial: "LC_150_2015" },
    ]
  },
  {
    grupo: "Trabalho Rural",
    funcoes: [
      { id: "trabalhador_rural", label: "Trabalhador Rural / Agricultor", insalubridade: "medio", periculosidade: false, regra_especial: "rural" },
      { id: "trabalhador_safra", label: "Trabalhador de Safra / Temporário", insalubridade: "medio", periculosidade: false, regra_especial: "rural" },
      { id: "pecuarista", label: "Trabalhador em Pecuária", insalubridade: "minimo", periculosidade: false, regra_especial: "rural" },
    ]
  },
  {
    grupo: "Outros",
    funcoes: [
      { id: "outros", label: "Outra função não listada", insalubridade: false, periculosidade: false },
    ]
  },
]
```

### Regras especiais por categoria

**Trabalho Doméstico (LC 150/2015):**

- FGTS obrigatório desde 01/10/2015 (anterior era facultativo)
- Jornada máxima 8h/dia, 44h/semana
- Adicional de horas extras: 50%
- Direito a seguro-desemprego
- Aviso prévio proporcional

**Regra de FGTS para domésticos com início anterior a outubro/2015:**

```
// Se funcaoId pertence ao grupo "Trabalho Doméstico" (exceto diarista):
SE dataInicio < "2015-10":
  // Período antes de out/2015: FGTS era facultativo — NÃO calcular
  mesesComFGTS  = fimEfetivo.diff(max(dataInicioEfetivo, "2015-10"), 'month')
  mesesSemFGTS  = max(0, dayjs("2015-10").diff(dataInicioEfetivo, 'month'))
  fgtsAcumulado = salarioReal * 0.08 * mesesComFGTS

  // Exibir alerta informativo:
  // "Antes de outubro de 2015, o FGTS para trabalhadores domésticos
  //  era facultativo. Calculamos apenas o período a partir dessa data."
SENÃO:
  // Normal — calcular sobre todo o período efetivo
  fgtsAcumulado = salarioReal * 0.08 * mesesEfetivos
```

**Diarista (até 2x por semana no mesmo empregador):**

- Não configura vínculo empregatício
- Exibir alerta específico explicando a situação

**Trabalho Rural (Lei 5.889/73):**

- Mesmos direitos da CLT + direitos específicos
- Intervalo para refeição: até 1h em atividade a céu aberto
- Exibir nota recomendando consulta para detalhes específicos

-----

## 8. Tela de Resultado

### 8.1 Resultado Bloqueado (antes do lead)

**Layout:**

```
┌─────────────────────────────────────────────┐
│  ✅ Calculamos seus direitos!                │
│                                             │
│  Identificamos X direitos trabalhistas      │
│  para você.                                 │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Valor estimado a receber:          │   │
│  │                                     │   │
│  │   R$ ██.███,██  ← EMBAÇADO (blur)  │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [🔓 REVELAR MEUS DIREITOS E VALORES]      │
│                                             │
│  Informe seus dados e receba o cálculo     │
│  completo no seu WhatsApp e e-mail.        │
└─────────────────────────────────────────────┘
```

**Implementação do blur:**

```css
.valor-embaçado {
  filter: blur(8px);
  user-select: none;
  pointer-events: none;
}
```

O valor real já está calculado e renderizado no DOM, apenas visualmente embaçado.

### 8.2 Formulário de Captura (LeadForm)

Campos:

- Nome completo (obrigatório)
- WhatsApp com DDD (obrigatório, validação de 11 dígitos)
- E-mail (obrigatório, validação de formato)

Ao submeter:

1. Validar campos
1. Exibir loading no botão
1. Fazer POST assíncrono para webhook n8n (não bloquear UX)
1. Exibir mensagem de sucesso imediatamente (não aguardar resposta do webhook)
1. Revelar resultado (remover blur)
1. Scroll suave até a tabela de cálculos

**Mensagem de sucesso:**

> ✅ *“Pronto! Enviamos seu resultado completo para o WhatsApp e e-mail informados. Agora confira tudo abaixo:”*

### 8.3 Payload do Webhook (POST para n8n)

```javascript
// POST para: [URL DO WEBHOOK N8N — configurar em .env ou constante]
// Content-Type: application/json

{
  "lead": {
    "nome": "string",
    "whatsapp": "string",
    "email": "string",
    "timestamp": "ISO 8601",
    "origem": "calculadora-jianoti",
    "whatsappAtendimento": "string"  // número sorteado nessa sessão — para rastreio no n8n
  },
  "respostas": {
    "dataInicio": "YYYY-MM",
    "dataSaida": "YYYY-MM | null",
    "aindaTrabalhando": "boolean",
    "temCarteira": "boolean",
    "funcaoId": "string",
    "funcaoLabel": "string",
    "salario": "number",
    "motivoRescisao": "string | null",
    "cumpriuAviso": "boolean | null",
    "registradoPrimeiroDia": "boolean | null",
    "salarioPorFora": "boolean",
    "valorPorFora": "number | null",
    "beneficiosGoverno": ["string"],
    "fazHorasExtras": "boolean",
    "horasExtrasSemana": "string | null",
    "trabalhaNoturno": "boolean",
    "horasNoturnas": "string | null",
    "trabalhaDomingo": "boolean"
  },
  "resultado": {
    "temCarteira": "boolean",
    "periodoFoiCortadoPorPrescricao": "boolean",
    "verbas": [
      {
        "id": "string",
        "descricao": "string",
        "base": "string",
        "valor": "number",
        "tipo": "credito | debito | informativo"
      }
    ],
    "totalEstimado": "number",
    "direitosIdentificados": ["string"],
    "alertas": ["string"]
  }
}
```

### 8.4 Resultado Revelado

**Seção 1 — Lista de Direitos Identificados**

Cards com ícone ✅ e texto simples. Exemplo:

- ✅ **Horas extras não pagas** — Você trabalhava além do horário combinado e tem direito a receber 50% a mais por cada hora extra.
- ✅ **FGTS não depositado** — A empresa deveria depositar 8% do seu salário todo mês em uma conta no seu nome. Esse dinheiro é seu.
- ✅ **Adicional de periculosidade** — Quem trabalha em situações de risco (como eletricidade ou inflamáveis) tem direito a receber 30% a mais no salário.

**Seção 2 — Tabela de Cálculo**

|O que você tem direito  |Como calculamos            |Valor estimado  |
|------------------------|---------------------------|----------------|
|Saldo de salário        |X dias trabalhados em [mês]|R$ X.XXX,XX     |
|Férias não tiradas + 1/3|X período(s) de 12 meses   |R$ X.XXX,XX     |
|…                       |…                          |…               |
|**Total estimado**      |                           |**R$ XX.XXX,XX**|

Linha de deduções em Clay (`#DC6242`).
Linha de total em Neon Blue (`#5D6EEC`) com fonte Sora bold.

**Nota de rodapé da tabela:**

> *“Esses valores são estimativas baseadas nas informações que você forneceu. O valor real pode ser maior ou menor dependendo de documentos e detalhes do seu caso. Consulte um advogado para uma análise completa e gratuita.”*

**Alertas de benefícios governamentais** (se aplicável):

> ⚠️ *“Você marcou que recebe [Bolsa Família]. Ao entrar com ação trabalhista, sua renda pode ser alterada no Cadastro Único, o que pode impactar esse benefício. Um advogado pode te orientar sobre como proceder.”*

**CTA final:**

```
┌─────────────────────────────────────────────┐
│  Quer receber o que é seu por direito?      │
│                                             │
│  [💬 FALAR COM ADVOGADO NO WHATSAPP]        │
│                                             │
│  Atendimento gratuito, sem compromisso.     │
│  Mais de 3.000 trabalhadores atendidos.     │
└─────────────────────────────────────────────┘
```

Link WhatsApp: gerado via `gerarLinkWhatsApp(numero, MENSAGENS_WHATSAPP.resultado)` — usar o número sorteado do Zustand store (Seção 12). **Nunca hardcodar o número diretamente neste componente.**

-----

## 9. Badge Flutuante de Atendimento (WhatsApp)

### Descrição

Botão flutuante fixo no canto inferior direito da tela, visível em **todas as etapas** do wizard e na tela de resultado. Persiste durante o scroll.

### Visual

```
┌──────────────────────────────────────┐
│  [foto]  Fale com um advogado agora  │
│  circular  pelo WhatsApp  📱         │
└──────────────────────────────────────┘
```

- **Foto:** imagem circular do(a) advogado(a) (arquivo: `src/assets/advogado-badge.webp`), 48x48px, borda branca de 2px. Fallback: avatar com iniciais “JJ” em fundo `#5D6EEC` caso a imagem não carregue.
- **Texto linha 1:** *“Fale com um advogado agora”* — fonte Sora, bold, cor `#1E2243`
- **Texto linha 2:** *“pelo WhatsApp”* — fonte Inter, cor `#5D6EEC`
- **Ícone WhatsApp:** SVG inline, cor `#25D366`, à direita do texto
- **Fundo:** branco, `border-radius: 50px` (pílula), `box-shadow: 0 4px 20px rgba(30,34,67,0.15)`
- **Animação de entrada:** slide-up suave ao carregar (300ms ease-out)
- **Pulse:** anel animado em `#5D6EEC` ao redor da foto — `animation: pulse 2s infinite` — chamada de atenção discreta

### Posicionamento

```css
position: fixed;
bottom: 24px;
right: 16px;
z-index: 1000;
```

### Comportamento mobile

- Em telas < 380px: colapsa para foto circular + ícone WhatsApp apenas (sem texto), expandindo ao toque
- Verificar sobreposição com botão “Avançar” do wizard — ajustar `bottom` se necessário para não cobrir a navegação

### Link

Usar o número sorteado globalmente (ver Seção — Roteamento de WhatsApp abaixo). O número é o mesmo em todos os CTAs da sessão.

### Fotos do time (randômicas)

O array `FOTOS_ADVOGADOS` é definido e mantido em `src/constants/calcConstants.js`. O componente importa de lá — **não redefine o array localmente**. Para adicionar ou trocar fotos, editar apenas `calcConstants.js`.

```javascript
// Em src/constants/calcConstants.js:
export const FOTOS_ADVOGADOS = [
  { nome: "Dra. Jacqueline Jianoti",  url: "https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/66be2d7ed04d7cce8ad03815_dra-jac%402x.jpg" },
  { nome: "Dra. Raisa Vargas Soares", url: "https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/68c87390ceef8c96e093f97c_Blog%20(72).avif" },
  { nome: "Dra. Geovana Carvalho",    url: "https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/68dfdf91ae15be1779cd89c8_Blog%20(90).png" },
  { nome: "Dra. Bruna Dutra",         url: "https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/66be2d7fd04d7cce8ad03836_dra-bruna-v2%402x.png" },
  { nome: "Dra. Luana Sell",          url: "https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/68dfdf1ad5e3f868d406dd0c_Blog%20(89).png" },
  { nome: "Dra. Gabriella Osiecki",   url: "https://cdn.prod.website-files.com/66bbc5741ba3db41a9543185/68472e9e5b61ab671ee16076_gabi.jpeg" },
]
```

A foto sorteada persiste durante toda a sessão via Zustand (ver FIX 2 abaixo). O componente apenas lê `advogadaAtual` do store.

- O **nome** da advogada aparece como tooltip ao passar o dedo/mouse sobre a foto
- Fallback se a imagem não carregar: avatar com iniciais em fundo `#5D6EEC`
- As URLs são do CDN Webflow do jianoti.com.br — se mudar, atualizar apenas `calcConstants.js`

### Componente

`src/components/ui/WhatsAppBadge.jsx` — renderizado em `App.jsx`, fora do `WizardContainer`, garantindo presença em todas as telas.

-----

## 10. Comportamento de Erros e Edge Cases

|Situação                          |Comportamento                                                                                                                                                                      |
|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Webhook n8n falha ou timeout      |Revelar resultado mesmo assim. Salvar payload em variável de estado. Exibir: *“Houve um problema ao enviar. Salve seu resultado agora.”* + botão copiar                            |
|Salário informado abaixo do mínimo|Usar salário mínimo como base e exibir alerta: *“Você informou um valor abaixo do salário mínimo. Isso também é um direito violado — você deveria receber pelo menos R$ X.XXX,XX.”*|
|Diarista (até 2x por semana)      |Exibir tela explicativa: sem vínculo empregatício, mas pode haver direitos dependendo da frequência real                                                                           |
|Função “outros”                   |Calcular sem adicional de insalubridade/periculosidade e sugerir consulta para verificar se a função específica tem adicional                                                      |
|Período inferior a 1 mês          |Calcular apenas saldo de salário e alertar que algumas verbas exigem tempo mínimo                                                                                                  |
|Falecimento do empregado          |Exibir nota orientando herdeiros a buscar advogado (direitos são transferíveis aos dependentes)                                                                                    |

-----

## 11. SEO e Meta Tags

```html
<title>Calculadora de Direitos Trabalhistas — Jianoti Advocacia</title>
<meta name="description" content="Descubra quanto você tem direito a receber. Funciona para trabalhadores com e sem carteira assinada. Cálculo gratuito e imediato.">
<meta property="og:title" content="Você sabe quanto tem direito a receber?">
<meta property="og:description" content="Calcule seus direitos trabalhistas em menos de 2 minutos. Com ou sem carteira assinada.">
<meta name="theme-color" content="#1E2243">
<link rel="canonical" href="https://jianoti.com.br/calculadora">
```

-----

## 12. Roteamento de WhatsApp

### Lógica de distribuição

Ao carregar a aplicação, um único número de WhatsApp é sorteado aleatoriamente e armazenado em memória (variável de estado global no Zustand). Esse número é usado em **todos os CTAs, links e redirecionamentos** da sessão — badge flutuante, botão do resultado, CTA final, tela de prescrição — garantindo consistência e distribuição de volume entre os atendentes.

### Lista de números (editar aqui quando necessário)

O único lugar para adicionar, remover ou reordenar números é o arquivo `src/constants/whatsappNumbers.js`:

```javascript
// src/constants/whatsappNumbers.js
// ─────────────────────────────────────────────────────────────
// MANUTENÇÃO: Para adicionar ou remover números de atendimento,
// edite apenas este array. O formato deve ser somente dígitos,
// sem espaços, traços ou parênteses, com código do país.
// Exemplo: "5541999999999"
// ─────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBERS = [
  "55419361811862",  // +55 (41) 93618-1862
  "55419350014527",  // +55 (41) 93500-4527
  "55419350014528",  // +55 (41) 93500-4528
  "55419350015243",  // +55 (41) 93500-5243
  "55419361812453",  // +55 (41) 93618-2453
  "55419361810775",  // +55 (41) 93618-0775
  "55419361811821",  // +55 (41) 93618-1821
  "55419361811958",  // +55 (41) 93618-1958
  "55419361812834",  // +55 (41) 93618-2834
  "55419361811826",  // +55 (41) 93618-1826
  "55419361813863",  // +55 (41) 93618-3863
  "55419361811818",  // +55 (41) 93618-1818
  "55419361811307",  // +55 (41) 93618-1307
  "55419361811314",  // +55 (41) 93618-1314
]
```

### Função de seleção e geração de link

```javascript
// src/utils/whatsappService.js

import { WHATSAPP_NUMBERS } from '../constants/whatsappNumbers'

// Executado uma única vez no carregamento — resultado guardado no Zustand
export function sortearNumero() {
  const index = Math.floor(Math.random() * WHATSAPP_NUMBERS.length)
  return WHATSAPP_NUMBERS[index]
}

// Usar em todos os CTAs da aplicação
export function gerarLinkWhatsApp(numero, mensagem) {
  const numeroLimpo = numero.replace(/\D/g, '')
  const msgEncoded = encodeURIComponent(mensagem)
  return `https://wa.me/${numeroLimpo}?text=${msgEncoded}`
}

// Mensagens padrão por contexto (editar aqui se quiser personalizar o texto)
export const MENSAGENS_WHATSAPP = {
  badge:     "Olá, vi a calculadora de direitos trabalhistas no site e gostaria de falar com um advogado.",
  resultado: "Olá, fiz o cálculo dos meus direitos no site e gostaria de falar com um advogado.",
  prescricao:"Olá, tentei usar a calculadora mas pode ter passado o prazo. Gostaria de falar com um advogado para entender minha situação.",
  geral:     "Olá, gostaria de falar com a advocacia.",
}
```

### Integração com Zustand

```javascript
// src/store/wizardStore.js — adicionar ao estado inicial

import { sortearNumero } from '../utils/whatsappService'
import { FOTOS_ADVOGADOS } from '../constants/calcConstants'

const useWizardStore = create((set) => ({
  // ... outros estados do wizard

  // Sorteados UMA VEZ ao montar o app — imutáveis durante toda a sessão,
  // inclusive ao reiniciar o wizard (resetar outros campos não afeta estes)
  whatsappNumero:  sortearNumero(),
  advogadaAtual:   FOTOS_ADVOGADOS[Math.floor(Math.random() * FOTOS_ADVOGADOS.length)],
}))
```

**Regra de reset:** ao reiniciar o wizard (botão “Calcular outro emprego” na tela de prescrição ou qualquer outro reset), resetar apenas os campos de respostas do usuário. `whatsappNumero` e `advogadaAtual` permanecem intocados.

### Como usar nos componentes

```javascript
// Em qualquer componente que precise de link WhatsApp:
import { gerarLinkWhatsApp, MENSAGENS_WHATSAPP } from '../utils/whatsappService'
import useWizardStore from '../store/wizardStore'

const numero = useWizardStore((state) => state.whatsappNumero)
const link = gerarLinkWhatsApp(numero, MENSAGENS_WHATSAPP.resultado)
```

### Regras

- O número é sorteado **uma única vez** por sessão (ao montar o app)
- **Nunca** usar o número fixo `5541995995000` diretamente nos componentes — sempre usar o número do store
- O número `5541995995000` pode ser mantido apenas como fallback no `config.js` caso o array esteja vazio
- Para rastrear qual número gerou mais conversões, o payload do webhook n8n já inclui o número usado (campo `lead.whatsappAtendimento`)

-----

## 13. Configurações de Ambiente

```javascript
// src/config.js — editar conforme ambiente
export const CONFIG = {
  WEBHOOK_URL: "https://SEU-N8N.com/webhook/calculadora-jianoti",
  // Números de atendimento: editar em src/constants/whatsappNumbers.js
  // Mensagens de WhatsApp: editar em src/utils/whatsappService.js (MENSAGENS_WHATSAPP)
  WHATSAPP_FALLBACK: "5541995995000",  // usado apenas se WHATSAPP_NUMBERS estiver vazio
  GA_ID: "", // Google Analytics (opcional)
}
```

-----

## 14. Checklist de Entrega

- [ ] Wizard com 5 etapas + tela de prescrição
- [ ] Motor de cálculo cobrindo todas as verbas da matriz de rescisão
- [ ] Lógica de adicionais por função
- [ ] Resultado embaçado com CTA de revelação
- [ ] Formulário de lead com validação
- [ ] POST webhook n8n com payload completo
- [ ] Tratamento de erro de webhook (revelar resultado mesmo assim)
- [ ] Banner especial para trabalhador sem carteira
- [ ] Alertas de benefícios governamentais
- [ ] Alertas de prescrição no wizard
- [ ] Tela de bloqueio por prescrição com CTA
- [ ] Design 100% responsivo (mobile-first)
- [ ] Fontes Sora + Inter via Google Fonts
- [ ] Cores conforme brand guidelines Jianoti
- [ ] Tooltips para termos técnicos
- [ ] Linguagem 100% simples (sem juridiquês)
- [ ] Bundle < 400kb gzipped
- [ ] Badge flutuante WhatsApp com foto randômica das advogadas
- [ ] Roteamento de WhatsApp — número sorteado uma vez por sessão
- [ ] Lista de números em whatsappNumbers.js (único ponto de edição)
- [ ] campo whatsappAtendimento no payload do webhook
- [ ] Animações e microinterações (transições entre etapas, reveal do resultado)
- [ ] Indenização por rescisão antecipada de contrato de experiência (Art. 479 CLT)
- [ ] Mapeamento de faixas de horas para valores numéricos (horas extras e adicional noturno)
- [ ] Três cenários de FGTS (com registro, sem registro desde início, sem carteira)
- [ ] Alerta de prescrição iminente (18-24 meses) além do bloqueio total (>24 meses)

-----

## 15. Notas Legais

Esta calculadora fornece **estimativas educativas** com base nas informações fornecidas pelo usuário e na legislação trabalhista brasileira vigente (CLT, CF/88, legislação complementar). Os valores apresentados **não constituem opinião jurídica** e podem divergir do resultado real de uma ação trabalhista, que depende de documentos, provas e análise individualizada. Incluir aviso de rodapé na tela de resultado.

Aviso a exibir:

> *“Esta calculadora é uma ferramenta educativa da Jianoti Advocacia Trabalhista. Os valores são estimativas e não substituem a análise de um advogado. Jianoti OAB 49993PR.”*

-----

*Fim da especificação v1.0*  
*Para dúvidas ou alterações, edite diretamente este arquivo e peça ao Cursor para re-avaliar o que já foi implementado.*
