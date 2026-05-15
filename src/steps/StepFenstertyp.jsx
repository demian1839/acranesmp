import { FENSTERTYPEN } from '../data/windowData'

const ICONS = {
  einfenster:   '🪟',
  zweifluegel:  '🪟',
  dreifluegel:  '🏠',
  festverglasung: '◻️',
  balkontuer:   '🚪',
  haustuer:     '🏠',
}

export default function StepFenstertyp({ config, onChange }) {
  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 1: Fenstertyp wählen</h2>
        <p>Wählen Sie den Typ Ihres Wunschfensters. Bei Fragen beraten wir Sie gerne.</p>
      </div>
      <div className="step-content__body">
        <div className="option-grid option-grid--2col">
          {FENSTERTYPEN.map(f => (
            <div
              key={f.id}
              className={`option-card ${config.fenstertyp === f.id ? 'option-card--selected' : ''}`}
              onClick={() => onChange('fenstertyp', f.id)}
            >
              <div className="option-card__check">✓</div>
              <div className="option-card__icon">{ICONS[f.id]}</div>
              <div className="option-card__label">{f.label}</div>
              <div className="option-card__desc">{f.desc}</div>
              <div className="option-card__desc" style={{ marginTop: 6, fontSize: '.75rem', color: 'var(--text-muted)' }}>
                Breite: {f.minW}–{f.maxW} mm · Höhe: {f.minH}–{f.maxH} mm
              </div>
            </div>
          ))}
        </div>
        <div className="info-box" style={{ marginTop: 20 }}>
          <strong>Tipp:</strong> Einfenster und Zweifliigelfenster sind unsere meistgekauften Produkte.
          Bei speziellen Anforderungen kontaktieren Sie uns – wir fertigen auch Sondergrößen.
        </div>
      </div>
    </div>
  )
}
