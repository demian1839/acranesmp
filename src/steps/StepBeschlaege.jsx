import { BESCHLAEGE, GRIFFE } from '../data/windowData'

const SECURITY_ICONS = { standard: '🔒', rc1: '🛡️', rc2: '🛡️', rc3: '🔐' }

export default function StepBeschlaege({ config, onChange }) {
  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 7: Beschläge &amp; Griff wählen</h2>
        <p>Wählen Sie die Sicherheitsstufe der Beschläge und die Grifffarbe.</p>
      </div>
      <div className="step-content__body">
        {/* Beschläge */}
        <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>
          Beschläge / Einbruchschutz
        </h3>
        <div className="option-grid option-grid--2col">
          {BESCHLAEGE.map(b => (
            <div
              key={b.id}
              className={`option-card ${config.beschlaege === b.id ? 'option-card--selected' : ''}`}
              onClick={() => onChange('beschlaege', b.id)}
            >
              <div className="option-card__check">✓</div>
              {b.badge && (
                <div className={`option-card__badge ${b.badge === 'Empfohlen' ? 'option-card__badge--blue' : b.badge === 'Maximum' ? 'option-card__badge--green' : ''}`}>
                  {b.badge}
                </div>
              )}
              <div style={{ fontSize: '2rem', marginBottom: 4 }}>{SECURITY_ICONS[b.id]}</div>
              <div className="option-card__label">{b.label}</div>
              <div className="option-card__desc">{b.desc}</div>
              <div className="option-card__price">
                {b.priceAdd === 0
                  ? <span className="option-card__price--free">inklusive</span>
                  : `+ ${b.priceAdd} € Aufpreis`}
              </div>
            </div>
          ))}
        </div>

        {/* Griffe */}
        <h3 style={{ fontSize: '.95rem', fontWeight: 700, margin: '28px 0 14px', color: 'var(--text)' }}>
          Griff-Ausführung
        </h3>
        <div className="handle-grid">
          {GRIFFE.map(g => (
            <div
              key={g.id}
              className={`handle-card ${config.griff === g.id ? 'handle-card--selected' : ''}`}
              onClick={() => onChange('griff', g.id)}
            >
              <div className="handle-circle" style={{ background: g.hex, border: '2px solid rgba(0,0,0,.15)' }} />
              <div className="handle-label">{g.label}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                {g.priceAdd === 0 ? 'inkl.' : `+${g.priceAdd}€`}
              </div>
            </div>
          ))}
        </div>

        <div className="info-box" style={{ marginTop: 20 }}>
          <strong>Empfehlung Polizei:</strong> Einbruchschutz RC 2 bietet das beste Preis-Leistungs-
          Verhältnis und entspricht dem Mindeststandard für Versicherungen.
          RC 3 empfiehlt sich für Erdgeschoss- und Kellerfenster.
        </div>
      </div>
    </div>
  )
}
