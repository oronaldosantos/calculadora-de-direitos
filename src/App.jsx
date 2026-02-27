import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import WizardContainer from './components/wizard/WizardContainer'
import WhatsAppBadge from './components/ui/WhatsAppBadge'

function App() {
  return (
    <div className="min-h-screen bg-platinum font-inter text-midnight">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <WizardContainer />
      </main>
      <Footer />
      <WhatsAppBadge />
    </div>
  )
}

export default App
