import WindowPreview from './WindowPreview'
import { calculatePrice, getPriceBreakdown, formatPrice } from '../utils/priceCalculator'
import { MATERIALIEN, FENSTERTYPEN } from '../data/windowData'

export default function PriceSidebar({ config }) {
  const price     = calculatePrice(config)
  const breakdown = getPriceBreakdown(config)
  const mat       = MATERIALIEN.find(m => m.id === config.material)
  const fenster   = FENSTERTYPEN.find(f => f.id === config.fenstertyp)

  return (
    <aside className="sidebar">
      {/* Window Preview */}
      <div className="sidebar-card">
        <div className="sidebar-card__header">
          🪟 Fenster-Vorschau
        </div>
        <div className="window-preview">
          <WindowPreview config={config} />
        </div>
        {fenster && (
          <div className="sidebar-card__body" style={{ paddingTop: 10, paddingBottom: 12 }}>
            <div style={{ fontSize: '.8rem', color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span><b>{fenster.label}</b></span>
              {mat && <span>{mat.labelFull}</span>}
              <span>{config.width} × {config.height} mm</span>
            </div>
          </div>
        )}
      </div>

      {/* Price Box */}
      <div className="sidebar-card">
        <div className="sidebar-card__header">
          💰 Ihr Preis
        </div>
        <div className="sidebar-card__body">
          {price === 0 ? (
            <p className="price-box__empty">
              Bitte konfigurieren Sie Ihr Fenster, um den Preis zu berechnen.
            </p>
          ) : (
            <>
              {breakdown.slice(0, 6).map((item, i) => (
                <div key={i} className="price-box__row">
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.price)}</span>
                </div>
              ))}
              {breakdown.length > 6 && (
                <div className="price-box__row">
                  <span>Weitere Positionen ({breakdown.length - 6})</span>
                  <span style={{ fontWeight: 600 }}>
                    {formatPrice(breakdown.slice(6).reduce((s, i) => s + i.price, 0))}
                  </span>
                </div>
              )}
              <div className="price-box__row price-box__row--total">
                <span>Gesamt {config.menge > 1 ? `(${config.menge}×)` : ''}</span>
                <span className="price-box__total-price">{formatPrice(price)}</span>
              </div>
              <p className="price-box__incl">inkl. 19% MwSt. · zzgl. Versand</p>
            </>
          )}
        </div>
      </div>

      {/* Trust Box */}
      <div className="sidebar-card">
        <div className="sidebar-card__body" style={{ padding: '14px 16px' }}>
          {[
            { icon: '🚚', text: 'Lieferzeit: 10–15 Werktage' },
            { icon: '🛡️', text: 'bis zu 15 Jahre Garantie' },
            { icon: '✅', text: 'Maßfenster nach Maß' },
            { icon: '📞', text: 'Kostenlose Beratung: 0800 123 456' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '.82rem', color: 'var(--text-2)' }}>
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
