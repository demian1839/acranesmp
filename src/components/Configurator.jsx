import { useState, useReducer } from 'react'
import { STEPS, INITIAL_CONFIG, PROFILE, FENSTERTYPEN } from '../data/windowData'
import StepBar from './StepBar'
import PriceSidebar from './PriceSidebar'
import StepFenstertyp    from '../steps/StepFenstertyp'
import StepMaterial      from '../steps/StepMaterial'
import StepMasse         from '../steps/StepMasse'
import StepOeffnungsart  from '../steps/StepOeffnungsart'
import StepVerglasung    from '../steps/StepVerglasung'
import StepFarbe         from '../steps/StepFarbe'
import StepBeschlaege    from '../steps/StepBeschlaege'
import StepZubehoer      from '../steps/StepZubehoer'
import StepZusammenfassung from '../steps/StepZusammenfassung'
import StepCheckout      from '../steps/StepCheckout'
import { formatPrice, calculatePrice } from '../utils/priceCalculator'

function configReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.key]: action.value }
    case 'RESET':     return { ...INITIAL_CONFIG }
    default:          return state
  }
}

function canProceed(step, config) {
  switch (step) {
    case 1:  return !!config.fenstertyp
    case 2:  return !!config.material && !!config.profil
    case 3:  return config.width >= 100 && config.height >= 100
    case 4:  return !!config.oeffnungsart || !!FENSTERTYPEN.find(f => f.id === config.fenstertyp)?.noOpening
    case 5:  return !!config.verglasung
    case 6:  return !!config.farbeAussen && !!config.farbeInnen
    case 7:  return !!config.beschlaege && !!config.griff
    case 8:  return true
    case 9:  return true
    case 10: return true
    default: return true
  }
}

// ─── ORDER CONFIRMATION ────────────────────────────────────────────────────────────────────────────────
function OrderConfirmation({ order, onNewOrder }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        padding: '48px 40px', maxWidth: 600, width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,.1)',
        textAlign: 'center', border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 16, animation: 'pop .4s ease' }}>✅</div>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
          Vielen Dank für Ihre Bestellung!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '.95rem', marginBottom: 28, lineHeight: 1.6 }}>
          Ihre Bestellung wurde erfolgreich aufgenommen. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>

        <div style={{ background: 'var(--primary-light)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
          {[
            ['Bestell-Nr.',    order.id],
            ['Gesamtbetrag',   formatPrice(order.price)],
            ['Name',           `${order.customer?.vorname} ${order.customer?.nachname}`],
            ['E-Mail',         order.customer?.email],
            ['Lieferzeit',     order.delivery === 'express' ? '5–7 Werktage' : '10–15 Werktage'],
            ['Zahlungsart',    order.payment === 'rechnung' ? 'Kauf auf Rechnung' : order.payment === 'vorkasse' ? 'Vorkasse' : 'PayPal'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(21,101,192,.12)', fontSize: '.875rem' }}>
              <span style={{ color: 'var(--primary-dark)', fontWeight: 500 }}>{k}</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn--primary" onClick={onNewOrder}>
            🪟 Neues Fenster konfigurieren
          </button>
          <button className="btn btn--ghost" onClick={() => window.print()}>
            🖨️ Drucken
          </button>
        </div>
      </div>
      <style>{`@keyframes pop { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }`}</style>
    </div>
  )
}

// ─── CONFIGURATOR ───────────────────────────────────────────────────────────────────────────────────
export default function Configurator({ onAddToCart }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [config, dispatch] = useReducer(configReducer, INITIAL_CONFIG)
  const [orderConfirmed, setOrderConfirmed] = useState(null)

  const handleChange = (key, value) => {
    dispatch({ type: 'SET_FIELD', key, value })
    if (key === 'material' && PROFILE[value]) {
      dispatch({ type: 'SET_FIELD', key: 'profil', value: PROFILE[value][0].id })
    }
  }

  const goNext = () => {
    if (!canProceed(currentStep, config)) return
    setCompletedSteps(prev => [...new Set([...prev, currentStep])])
    setCurrentStep(s => Math.min(10, s + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goPrev = () => {
    setCurrentStep(s => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToStep = (id) => {
    if (id <= currentStep || completedSteps.includes(id)) {
      setCurrentStep(id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleOrderPlaced = (order) => {
    setOrderConfirmed(order)
    onAddToCart && onAddToCart(config)
  }

  const handleNewOrder = () => {
    setOrderConfirmed(null)
    setCurrentStep(1)
    setCompletedSteps([])
    dispatch({ type: 'RESET' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (orderConfirmed) {
    return <OrderConfirmation order={orderConfirmed} onNewOrder={handleNewOrder} />
  }

  const ready = canProceed(currentStep, config)
  const props = { config, onChange: handleChange }

  const STEP_COMPONENTS = {
    1:  <StepFenstertyp   {...props} />,
    2:  <StepMaterial     {...props} />,
    3:  <StepMasse        {...props} />,
    4:  <StepOeffnungsart {...props} />,
    5:  <StepVerglasung   {...props} />,
    6:  <StepFarbe        {...props} />,
    7:  <StepBeschlaege   {...props} />,
    8:  <StepZubehoer     {...props} />,
    9:  <StepZusammenfassung {...props} onContinue={goNext} onStepClick={goToStep} />,
    10: <StepCheckout     {...props} onOrderPlaced={handleOrderPlaced} />,
  }

  return (
    <>
      <StepBar currentStep={currentStep} completedSteps={completedSteps} onStepClick={goToStep} />

      <div className="configurator">
        <div className="step-content">
          {STEP_COMPONENTS[currentStep]}
        </div>

        <PriceSidebar config={config} />

        <div className="configurator-nav">
          <div className="configurator-nav__info">
            Schritt {currentStep} von {STEPS.length} – <b>{STEPS[currentStep - 1]?.label}</b>
          </div>
          <div className="configurator-nav__btns">
            {currentStep > 1 && (
              <button className="btn btn--ghost" onClick={goPrev}>← Zurück</button>
            )}
            {currentStep < 9 && (
              <button className="btn btn--primary" onClick={goNext} disabled={!ready}
                title={!ready ? 'Bitte treffen Sie zuerst eine Auswahl' : ''}>
                Weiter →
              </button>
            )}
            {currentStep === 9 && (
              <button className="btn btn--accent btn--lg" onClick={goNext}>
                Zur Bestellung →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
