import { ZUBEHOER, ZUBEHOER_CATEGORIES } from '../data/windowData'
import { formatPrice } from '../utils/priceCalculator'

export default function StepZubehoer({ config, onChange }) {
  const selected = config.zubehoer || []

  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id]
    onChange('zubehoer', next)
  }

  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 8: Zubehör wählen</h2>
        <p>Ergänzen Sie Ihr Fenster mit passendem Zubehör. Alles aus einer Hand.</p>
      </div>
      <div className="step-content__body">
        {ZUBEHOER_CATEGORIES.map(cat => {
          const items = ZUBEHOER.filter(z => z.category === cat.id)
          if (!items.length) return null
          return (
            <div className="zubehoer-category" key={cat.id}>
              <div className="zubehoer-category__title">{cat.label}</div>
              {items.map(z => (
                <div
                  key={z.id}
                  className={`checkbox-card ${selected.includes(z.id) ? 'checkbox-card--selected' : ''}`}
                  onClick={() => toggle(z.id)}
                >
                  <div className="checkbox-card__box">
                    {selected.includes(z.id) && <span style={{ fontSize: '.8rem' }}>✓</span>}
                  </div>
                  <div className="checkbox-card__info">
                    <div className="checkbox-card__label">
                      {z.label}
                      {z.badge && (
                        <span style={{
                          marginLeft: 8, fontSize: '.7rem', fontWeight: 700,
                          background: 'var(--accent)', color: '#fff',
                          padding: '1px 6px', borderRadius: 4,
                          textTransform: 'uppercase',
                        }}>
                          {z.badge}
                        </span>
                      )}
                    </div>
                    <div className="checkbox-card__desc">{z.desc}</div>
                  </div>
                  <div className="checkbox-card__price">
                    + {formatPrice(z.priceAdd)}
                    <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>pro Fenster</div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}

        {selected.length > 0 && (
          <div className="success-box">
            <b>✓ {selected.length} Zubehör gewählt:</b>{' '}
            {selected.map(id => ZUBEHOER.find(z => z.id === id)?.label).join(', ')}
          </div>
        )}

        <div className="info-box">
          <strong>Hinweis:</strong> Rolladen und Fensterbänke können mit dem Fenster zusammen
          montiert werden. Fragen Sie nach unserem Montageservice – bundesweit verfügbar.
        </div>
      </div>
    </div>
  )
}
