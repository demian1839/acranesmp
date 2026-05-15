import { useState } from 'react'
import { saveOrder } from '../utils/storage'
import { calculatePrice, formatPrice } from '../utils/priceCalculator'

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard-Lieferung', sub: '10–15 Werktage', price: 0 },
  { id: 'express',  label: 'Express-Lieferung',  sub: '5–7 Werktage',   price: 99, badge: 'Schnell' },
]
const PAYMENT_OPTIONS = [
  { id: 'rechnung',  label: 'Kauf auf Rechnung', sub: 'Zahlung innerhalb 30 Tagen', icon: '📄' },
  { id: 'vorkasse',  label: 'Vorkasse',           sub: '2% Skonto bei Überweisung',  icon: '🏦' },
  { id: 'paypal',    label: 'PayPal',             sub: 'Sofortige Zahlung',           icon: '💳' },
]

function Field({ label, required, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '.83rem', fontWeight: 700, color: error ? '#ef4444' : 'var(--text)' }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: '.75rem', color: '#ef4444', fontWeight: 600 }}>⚠ {error}</span>}
    </div>
  )
}

const inputStyle = (err) => ({
  padding: '10px 14px',
  border: `2px solid ${err ? '#ef4444' : 'var(--border)'}`,
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'inherit', fontSize: '.9rem',
  outline: 'none', transition: 'border-color .15s',
  background: '#fff', color: 'var(--text)',
})

export default function StepCheckout({ config, onOrderPlaced }) {
  const totalPrice = calculatePrice(config)
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('rechnung')
  const [agb, setAgb] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    vorname: '', nachname: '', email: '', telefon: '',
    strasse: '', plz: '', ort: '', notes: '',
  })

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.vorname.trim())  e.vorname  = 'Vorname erforderlich'
    if (!form.nachname.trim()) e.nachname = 'Nachname erforderlich'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Gültige E-Mail erforderlich'
    if (!form.strasse.trim())  e.strasse  = 'Straße erforderlich'
    if (!form.plz.trim() || !/^\d{5}$/.test(form.plz)) e.plz = 'Gültige PLZ (5 Ziffern)'
    if (!form.ort.trim())      e.ort      = 'Ort erforderlich'
    if (!agb)                  e.agb      = 'Bitte AGB akzeptieren'
    return e
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    const deliveryAdd = DELIVERY_OPTIONS.find(d => d.id === delivery)?.price || 0
    const finalPrice = totalPrice + deliveryAdd

    const order = saveOrder({
      customer: form,
      config,
      price: finalPrice,
      delivery,
      payment,
      notes: form.notes,
    })

    setTimeout(() => {
      setSubmitting(false)
      onOrderPlaced(order)
    }, 800)
  }

  const deliveryExtra = DELIVERY_OPTIONS.find(d => d.id === delivery)?.price || 0

  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 10: Bestellung aufgeben</h2>
        <p>Geben Sie Ihre Kontaktdaten ein und schließen Sie die Bestellung ab.</p>
      </div>
      <div className="step-content__body">
        <form onSubmit={submit} noValidate>

          {/* Customer Info */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.78rem', fontWeight: 800 }}>1</span>
              Persönliche Daten
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Vorname" required error={errors.vorname}>
                <input style={inputStyle(errors.vorname)} value={form.vorname}
                  onChange={e => set('vorname', e.target.value)} placeholder="Max" />
              </Field>
              <Field label="Nachname" required error={errors.nachname}>
                <input style={inputStyle(errors.nachname)} value={form.nachname}
                  onChange={e => set('nachname', e.target.value)} placeholder="Mustermann" />
              </Field>
              <Field label="E-Mail-Adresse" required error={errors.email}>
                <input type="email" style={inputStyle(errors.email)} value={form.email}
                  onChange={e => set('email', e.target.value)} placeholder="max@beispiel.de" />
              </Field>
              <Field label="Telefon" error={errors.telefon}>
                <input type="tel" style={inputStyle()} value={form.telefon}
                  onChange={e => set('telefon', e.target.value)} placeholder="+49 123 456789" />
              </Field>
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.78rem', fontWeight: 800 }}>2</span>
              Lieferadresse
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
              <Field label="Straße und Hausnummer" required error={errors.strasse}>
                <input style={inputStyle(errors.strasse)} value={form.strasse}
                  onChange={e => set('strasse', e.target.value)} placeholder="Musterstraße 42" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14 }}>
                <Field label="PLZ" required error={errors.plz}>
                  <input style={inputStyle(errors.plz)} value={form.plz}
                    onChange={e => set('plz', e.target.value)} placeholder="12345" maxLength={5} />
                </Field>
                <Field label="Ort" required error={errors.ort}>
                  <input style={inputStyle(errors.ort)} value={form.ort}
                    onChange={e => set('ort', e.target.value)} placeholder="Berlin" />
                </Field>
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 14, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.78rem', fontWeight: 800 }}>3</span>
              Lieferoption
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DELIVERY_OPTIONS.map(d => (
                <label key={d.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  border: `2px solid ${delivery === d.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  background: delivery === d.id ? 'var(--primary-light)' : '#fff',
                  transition: 'all .15s',
                }}>
                  <input type="radio" name="delivery" value={d.id} checked={delivery === d.id}
                    onChange={() => setDelivery(d.id)} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      🚚 {d.label}
                      {d.badge && <span style={{ fontSize: '.68rem', background: 'var(--accent)', color: '#fff', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>{d.badge}</span>}
                    </div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{d.sub}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: d.price === 0 ? 'var(--success)' : 'var(--primary)', whiteSpace: 'nowrap' }}>
                    {d.price === 0 ? 'kostenlos' : `+ ${formatPrice(d.price)}`}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 14, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.78rem', fontWeight: 800 }}>4</span>
              Zahlungsart
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
              {PAYMENT_OPTIONS.map(p => (
                <label key={p.id} style={{
                  display: 'flex', flexDirection: 'column', gap: 6,
                  padding: '14px 16px', cursor: 'pointer',
                  border: `2px solid ${payment === p.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  background: payment === p.id ? 'var(--primary-light)' : '#fff',
                  transition: 'all .15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="radio" name="payment" value={p.id} checked={payment === p.id}
                      onChange={() => setPayment(p.id)} style={{ accentColor: 'var(--primary)' }} />
                    <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '.88rem' }}>{p.label}</span>
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', paddingLeft: 26 }}>{p.sub}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 24 }}>
            <Field label="Anmerkungen zur Bestellung (optional)">
              <textarea
                rows={3} style={{ ...inputStyle(), resize: 'vertical', lineHeight: 1.5 }}
                value={form.notes} onChange={e => set('notes', e.target.value)}
                placeholder="z.B. besondere Lieferhinweise, Maßdetails..."
              />
            </Field>
          </div>

          {/* Price Summary */}
          <div style={{
            background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '16px 20px',
            marginBottom: 20, border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '.875rem', color: 'var(--text-2)' }}>
              <span>Fensterkonfiguration</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(totalPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '.875rem', color: 'var(--text-2)', borderBottom: '1px solid var(--border)' }}>
              <span>Lieferung ({DELIVERY_OPTIONS.find(d => d.id === delivery)?.label})</span>
              <span style={{ fontWeight: 600 }}>{deliveryExtra === 0 ? 'kostenlos' : formatPrice(deliveryExtra)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '1.05rem', fontWeight: 800 }}>
              <span>Gesamtbetrag</span>
              <span style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>{formatPrice(totalPrice + deliveryExtra)}</span>
            </div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: 2 }}>inkl. 19% MwSt.</div>
          </div>

          {/* AGB */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
            padding: '12px 14px',
            border: `2px solid ${errors.agb ? '#ef4444' : agb ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)', marginBottom: 20,
            background: agb ? 'var(--primary-light)' : '#fff', transition: 'all .15s',
          }}>
            <input type="checkbox" checked={agb} onChange={e => { setAgb(e.target.checked); setErrors(p => ({ ...p, agb: '' })) }}
              style={{ width: 18, height: 18, marginTop: 1, accentColor: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '.83rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
              Ich habe die{' '}
              <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Allgemeinen Geschäftsbedingungen</a>{' '}
              und die{' '}
              <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Datenschutzerklärung</a>{' '}
              gelesen und akzeptiert. *
            </span>
          </label>
          {errors.agb && <div style={{ color: '#ef4444', fontSize: '.78rem', fontWeight: 600, marginBottom: 12, marginTop: -14 }}>⚠ {errors.agb}</div>}

          <button
            type="submit"
            className="btn btn--accent btn--lg"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem' }}
            disabled={submitting}
          >
            {submitting
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,.5)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
                  Wird verarbeitet...
                </span>
              : '✅ Jetzt verbindlich bestellen'}
          </button>
          <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
            Mit Klick auf „Jetzt verbindlich bestellen“ erteilen Sie uns einen Auftrag gemäß unseren AGB.
          </p>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
