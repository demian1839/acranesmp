import { VERGLASUNGEN } from '../data/windowData'

function GlassIcon({ verglasung }) {
  const isTriple = verglasung.id === 'dreifach' || verglasung.id === 'schallschutz3'
  const isFrosted = verglasung.frosted
  const layers = isTriple ? 3 : 2

  return (
    <svg width={60} height={50} viewBox="0 0 60 50">
      {Array.from({ length: layers }).map((_, i) => (
        <rect
          key={i}
          x={6 + i * 16}
          y={6}
          width={8}
          height={38}
          fill={isFrosted ? 'rgba(240,245,252,0.9)' : verglasung.glassColor || 'rgba(200,228,255,0.5)'}
          stroke="rgba(100,160,220,0.6)"
          strokeWidth={1}
          rx={1}
        />
      ))}
    </svg>
  )
}

export default function StepVerglasung({ config, onChange }) {
  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 5: Verglasung wählen</h2>
        <p>Die Verglasung bestimmt Wärmedämmung, Schallschutz und Sicherheit.</p>
      </div>
      <div className="step-content__body">
        <div className="option-grid option-grid--2col">
          {VERGLASUNGEN.map(v => (
            <div
              key={v.id}
              className={`option-card ${config.verglasung === v.id ? 'option-card--selected' : ''}`}
              onClick={() => onChange('verglasung', v.id)}
            >
              <div className="option-card__check">✓</div>
              {v.badge && <div className="option-card__badge option-card__badge--blue">{v.badge}</div>}
              <GlassIcon verglasung={v} />
              <div className="option-card__label">{v.label}</div>
              <div className="option-card__desc">{v.desc}</div>
              <div style={{ marginTop: 8 }}>
                {v.details.map(d => (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.78rem', color: 'var(--text-2)', marginBottom: 2 }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '.75rem' }}>✓</span>
                    {d}
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 8, padding: '4px 8px',
                background: 'var(--primary-light)', borderRadius: 4,
                fontSize: '.78rem', color: 'var(--primary)', fontWeight: 600,
              }}>
                {v.uw}
              </div>
              <div className="option-card__price">
                {v.priceAdd === 0
                  ? <span className="option-card__price--free">inklusive</span>
                  : `+ ${v.priceAdd} € Aufpreis`}
              </div>
            </div>
          ))}
        </div>

        <div className="info-box" style={{ marginTop: 20 }}>
          <strong>Empfehlung:</strong> 3-fach Wärmedämmglas (Uw bis 0,9 W/m²K) spart langfristig
          Heizkosten und ist mit KfW-Förderprogrammen kombinierbar. Schallschutzglas empfehlen wir
          bei Straßenbahnlinien oder Hauptverkehrsstraßen in der Nähe.
        </div>
      </div>
    </div>
  )
}
