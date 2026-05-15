import { MATERIALIEN, PROFILE } from '../data/windowData'

export default function StepMaterial({ config, onChange }) {
  const profiles = config.material ? PROFILE[config.material] : []

  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 2: Material &amp; Profil wählen</h2>
        <p>Das Material bestimmt Optik, Dämmwerte und Preis Ihres Fensters.</p>
      </div>
      <div className="step-content__body">

        {/* Material selection */}
        <div className="option-grid option-grid--2col">
          {MATERIALIEN.map(m => (
            <div
              key={m.id}
              className={`option-card ${config.material === m.id ? 'option-card--selected' : ''}`}
              onClick={() => { onChange('material', m.id); onChange('profil', PROFILE[m.id][0].id) }}
            >
              <div className="option-card__check">✓</div>
              {m.badge && (
                <div className={`option-card__badge ${m.badge === 'Premium' ? 'option-card__badge--blue' : ''}`}>
                  {m.badge}
                </div>
              )}
              {/* Color dot */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: m.frameColor,
                border: '2px solid rgba(0,0,0,0.12)',
                marginBottom: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,.15)',
              }} />
              <div className="option-card__label">{m.label}</div>
              <div className="option-card__desc">{m.desc}</div>
              <ul className="option-card__features">
                {m.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="option-card__price" style={{ marginTop: 10 }}>
                ab {m.basePrice} €/m²
              </div>
            </div>
          ))}
        </div>

        {/* Profile selection */}
        {config.material && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>
              Profil-Serie wählen
            </h3>
            <div className="option-grid">
              {profiles.map(p => (
                <div
                  key={p.id}
                  className={`option-card ${config.profil === p.id ? 'option-card--selected' : ''}`}
                  onClick={() => onChange('profil', p.id)}
                  style={{ padding: '14px 16px' }}
                >
                  <div className="option-card__check">✓</div>
                  {p.badge && (
                    <div className={`option-card__badge ${
                      p.badge === 'Passivhaus' ? 'option-card__badge--green' :
                      p.badge === 'Top Dämmung' || p.badge === 'Top' ? 'option-card__badge--blue' : ''
                    }`}>{p.badge}</div>
                  )}
                  <div className="option-card__label" style={{ fontSize: '.88rem' }}>{p.label}</div>
                  <div className="option-card__desc" style={{ fontSize: '.76rem', marginTop: 4 }}>{p.desc}</div>
                  <div className="option-card__price">
                    {p.priceAdd === 0 ? <span className="option-card__price--free">inklusive</span> : `+ ${p.priceAdd} €/m²`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-box">
          <strong>Hinweis:</strong> Alle Profile entsprechen den aktuellen EnEV- und GEG-Anforderungen.
          3-fach Verglasung (Schritt 5) erhöht den Uw-Wert weiter.
        </div>
      </div>
    </div>
  )
}
