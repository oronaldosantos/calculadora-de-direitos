import { Suspense, lazy, useEffect, useMemo } from 'react'
import ProgressBar from './ProgressBar'
import useWizardStore from '../../store/wizardStore'

const Step1Periodo = lazy(() => import('./Step1Periodo'))
const Step2Vinculo = lazy(() => import('./Step2Vinculo'))
const Step3Detalhes = lazy(() => import('./Step3Detalhes'))
const Step4Rescisao = lazy(() => import('./Step4Rescisao'))
const Step5Jornada = lazy(() => import('./Step5Jornada'))
const StepPrescricao = lazy(() => import('./StepPrescricao'))
const ResultContainer = lazy(() => import('../result/ResultContainer'))

function LoadingStep() {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">Carregando etapa...</p>
    </div>
  )
}

function WizardContainer() {
  const respostas = useWizardStore((state) => state.respostas)
  const currentStep = useWizardStore((state) => state.currentStep)
  const nextStep = useWizardStore((state) => state.nextStep)
  const prevStep = useWizardStore((state) => state.prevStep)
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep)
  const prescricaoStatus = useWizardStore((state) => state.prescricaoStatus)

  const steps = useMemo(() => {
    const caminho = [
      { id: 'periodo', component: Step1Periodo },
      { id: 'vinculo', component: Step2Vinculo },
      { id: 'detalhes', component: Step3Detalhes },
    ]

    if (!respostas.aindaTrabalhando) {
      caminho.push({ id: 'rescisao', component: Step4Rescisao })
    }

    caminho.push({ id: 'jornada', component: Step5Jornada })
    caminho.push({ id: 'resultado', component: ResultContainer })

    return caminho
  }, [respostas.aindaTrabalhando])

  useEffect(() => {
    if (currentStep > steps.length - 1) {
      setCurrentStep(steps.length - 1)
    }
  }, [currentStep, setCurrentStep, steps.length])

  if (prescricaoStatus === 'prescrito') {
    return (
      <Suspense fallback={<LoadingStep />}>
        <StepPrescricao />
      </Suspense>
    )
  }

  const etapaAtual = steps[currentStep]
  const Component = etapaAtual.component
  const total = steps.length

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      nextStep()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      prevStep()
    }
  }

  return (
    <div>
      <ProgressBar current={currentStep + 1} total={total} />
      <Suspense fallback={<LoadingStep />}>
        <Component
          onNext={handleNext}
          onBack={handleBack}
          onIrPrescricao={() => setCurrentStep(0)}
        />
      </Suspense>
    </div>
  )
}

export default WizardContainer
