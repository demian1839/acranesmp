import { OEFFNUNGSARTEN, FENSTERTYPEN } from '../data/windowData'

function OpeningSVG({ symbol, size = 70 }) {
  const s = size
  const m = s / 2
  const p = 6
  const st = { stroke: '#1a5f9e', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' }
  const frame = { fill: '#e0e8f0', stroke: '#7a9cbf', strokeWidth: 1.5, rx: 2 }

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="option-card__svg">
      {/* frame */}
      <rect x={2} y={2} width={s-4} height={s-4} {...frame} />
      {/* glass */}
      <rect x={p} y={p} width={s-p*2} height={s-p*2} fill="rgba(180,218,255,0.5)" rx={1} />

      {symbol === 'fixed' && null}

      {symbol === 'dreh-l' && (
        <g>
          <line x1={s-p} y1={p} x2={p} y2={m} {...st} />
          <line x1={s-p} y1={s-p} x2={p} y2={m} {...st} />
        </g>
      )}
      {symbol === 'dreh-r' && (
        <g>
          <line x1={p} y1={p} x2={s-p} y2={m} {...st} />
          <line x1={p} y1={s-p} x2={s-p} y2={m} {...st} />
        </g>
      )}
      {symbol === 'dk-l' && (
        <g>
          <line x1={s-p} y1={p} x2={p} y2={m} {...st} />
          <line x1={s-p} y1={s-p} x2={p} y2={m} {...st} />
          <line x1={p} y1={p} x2={s-p} y2={p} {...st} strokeDasharray="4 3" />
          <line x1={p} y1={p} x2={m} y2={s-p} {...st} stroke="rgba(26,95,158,0.4)" />
        </g>
      )}
      {symbol === 'dk-r' && (
        <g>
          <line x1={p} y1={p} x2={s-p} y2={m} {...st} />
          <line x1={p} y1={s-p} x2={s-p} y2={m} {...st} />
          <line x1={p} y1={p} x2={s-p} y2={p} {...st} strokeDasharray="4 3" />
          <line x1={s-p} y1={p} x2={m} y2={s-p} {...st} stroke="rgba(26,95,158,0.4)" />
        </g>
      )}
      {symbol === 'kipp' && (
        <g>
          <line x1={p} y1={s-p} x2={m} y2={p} {...st} />
          <line x1={s-p} y1={s-p} x2={m} y2={p} {...st} />
          <line x1={p} y1={s-p} x2={s-p} y2={s-p} {...st} strokeDasharray="4 3" />
        </g>
      )}
      {symbol === 'dreh-o-l' && (
        <g>
          <line x1={p} y1={s-p} x2={m} y2={p} {...st} />
          <line x1={s-p} y1={s-p} x2={m} y2={p} {...st} />
        </g>
      )}
    </svg>
  )
}

export default function StepOeffnungsart({ config, onChange }) {
  const fenster = FENSTERTYPEN.find(f => f.id === config.fenstertyp)
  const isFixed = fenster?.noOpening

  if (isFixed) {
    return (
      <div>
        <div className="step-content__header">
          <h2>Schritt 4: Öffnungsart</h2>
        </div>
        <div className="step-content__body">
          <div className="success-box">
            Das gewählte Fenster (Festverglasung) hat keine Öffnungsfunktion.
            Dieser Schritt ist nicht erforderlich.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 4: Öffnungsart wählen</h2>
        <p>Wählen Sie, wie Ihr Fenster geöffnet werden soll. DIN links = Anschlag links, Griff rechts.</p>
      </div>
      <div className="step-content__body">
        <div className="option-grid option-grid--narrow">
          {OEFFNUNGSARTEN.map(oa => (
            <div
              key={oa.id}
              className={`option-card ${config.oeffnungsart === oa.id ? 'option-card--selected' : ''}`}
              onClick={() => onChange('oeffnungsart', oa.id)}
              style={{ alignItems: 'center', textAlign: 'center' }}
            >
              <div className="option-card__check">✓</div>
              {oa.badge && <div className="option-card__badge">{oa.badge}</div>}
              <OpeningSVG symbol={oa.symbol} />
              <div className="option-card__label" style={{ fontSize: '.82rem' }}>{oa.label}</div>
              <div className="option-card__desc" style={{ fontSize: '.73rem', textAlign: 'center' }}>{oa.desc}</div>
              <div className="option-card__price">
                {oa.priceMultiplier === 1 ? <span className="option-card__price--free">inklusive</span>
                  : `+${Math.round((oa.priceMultiplier - 1) * 100)} %`}
              </div>
            </div>
          ))}
        </div>

        <div className="info-box" style={{ marginTop: 20 }}>
          <strong>Dreh-Kipp</strong> ist die beliebteste Öffnungsart: Drehen zum Lüften, Kippen für
          kontrollierten Luftaustausch – beides mit einem Griff.
        </div>
      </div>
    </div>
  )
}
