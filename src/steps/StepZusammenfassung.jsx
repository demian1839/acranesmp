import { FENSTERTYPEN, MATERIALIEN, PROFILE, OEFFNUNGSARTEN, VERGLASUNGEN, FARBEN, BESCHLAEGE, GRIFFE, ZUBEHOER } from '../data/windowData'
import { calculatePrice, getPriceBreakdown, formatPrice } from '../utils/priceCalculator'

function Row({ label, value }) {
  return (
    <div className="summary-row">
      <span className="summary-row__key">{label}</span>
      <span className="summary-row__val">{value}</span>
    </div>
  )
}

export default function StepZusammenfassung({ config, onAddToCart, onStepClick }) {
  const price     = calculatePrice(config)
  const breakdown = getPriceBreakdown(config)

  const fenster  = FENSTERTYPEN.find(f => f.id === config.fenstertyp)
  const mat      = MATERIALIEN.find(m => m.id === config.material)
  const profil   = (PROFILE[config.material] || []).find(p => p.id === config.profil)
  const oa       = OEFFNUNGSARTEN.find(o => o.id === config.oeffnungsart)
  const glas     = VERGLASUNGEN.find(v => v.id === config.verglasung)
  const fAussen  = FARBEN.find(c => c.id === config.farbeAussen)
  const fInnen   = FARBEN.find(c => c.id === config.farbeInnen)
  const besc     = BESCHLAEGE.find(b => b.id === config.beschlaege)
  const griff    = GRIFFE.find(g => g.id === config.griff)
  const zubehoerList = (config.zubehoer || []).map(id => ZUBEHOER.find(z => z.id === id)?.label).filter(Boolean)

  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 9: Zusammenfassung &amp; Bestellen</h2>
        <p>Bitte überprüfen Sie Ihre Konfiguration und legen Sie das Fenster in den Warenkorb.</p>
      </div>
      <div className="step-content__body">

        {/* Summary Grid */}
        <div className="summary-grid">
          <div className="summary-section">
            <div className="summary-section__title">Fenstertyp &amp; Maße</div>
            <Row label="Fenstertyp"    value={fenster?.label || '–'} />
            <Row label="Breite"        value={`${config.width} mm`} />
            <Row label="Höhe"          value={`${config.height} mm`} />
            <Row label="Stückzahl"     value={`${config.menge} Stk.`} />
            <Row label="Fläche"        value={`${((config.width/1000)*(config.height/1000)).toFixed(2)} m²`} />
          </div>

          <div className="summary-section">
            <div className="summary-section__title">Material &amp; Profil</div>
            <Row label="Material"   value={mat?.labelFull || '–'} />
            <Row label="Profil"     value={profil?.label || '–'} />
          </div>

          <div className="summary-section">
            <div className="summary-section__title">Öffnung &amp; Verglasung</div>
            <Row label="Öffnungsart"  value={oa?.label || '–'} />
            <Row label="Verglasung"   value={glas?.shortLabel || '–'} />
            <Row label="Uw-Wert"      value={glas?.uw || '–'} />
          </div>

          <div className="summary-section">
            <div className="summary-section__title">Farbe &amp; Beschläge</div>
            <Row label="Farbe außen"  value={fAussen ? `${fAussen.label} (${fAussen.ral})` : '–'} />
            <Row label="Farbe innen"  value={fInnen  ? `${fInnen.label} (${fInnen.ral})`  : '–'} />
            <Row label="Beschläge"    value={besc?.label || '–'} />
            <Row label="Griff"        value={griff?.label || '–'} />
          </div>
        </div>

        {/* Accessories */}
        {zubehoerList.length > 0 && (
          <div className="summary-section" style={{ marginBottom: 16 }}>
            <div className="summary-section__title">Zubehör</div>
            {zubehoerList.map(z => (
              <div className="summary-row" key={z}>
                <span className="summary-row__key">{z}</span>
                <span className="summary-row__val" style={{ color: 'var(--success)' }}>✓</span>
              </div>
            ))}
          </div>
        )}

        {/* Price Breakdown */}
        <div style={{
          background: 'var(--bg)', borderRadius: 8, padding: '16px 20px', marginBottom: 20,
        }}>
          <div style={{ fontSize: '.85rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Preisaufstellung
          </div>
          {breakdown.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '.875rem', borderBottom: '1px solid var(--border)', color: 'var(--text-2)' }}>
              <span>{item.label}</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(item.price)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="summary-total">
          <div>
            <div className="summary-total__label">
              Gesamtpreis {config.menge > 1 ? `(${config.menge} Stk.)` : ''}
            </div>
            <div className="summary-total__sub">inkl. 19% MwSt. · zzgl. Versand</div>
          </div>
          <div>
            <div className="summary-total__price">{formatPrice(price)}</div>
            {config.menge > 1 && (
              <div className="summary-total__sub">
                {formatPrice(price / config.menge)} pro Stk.
              </div>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="order-btn-wrap">
          <button className="btn btn--accent btn--lg" onClick={onAddToCart}>
            🛒 In den Warenkorb
          </button>
          <button className="btn btn--primary" onClick={() => onStepClick(1)}>
            ✏️ Konfiguration bearbeiten
          </button>
          <button className="btn btn--ghost" onClick={() => window.print()}>
            🖨️ Drucken / PDF
          </button>
        </div>

        {/* Delivery Info */}
        <div style={{
          marginTop: 20, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10,
        }}>
          {[
            { icon: '🚚', title: '10–15 Werktage', sub: 'Lieferzeit ab Auftragsbestätigung' },
            { icon: '🛡️', title: 'Garantie', sub: 'Bis zu 15 Jahre Herstellergarantie' },
            { icon: '📏', title: 'Maßgenau', sub: 'Gefertigt nach Ihren Angaben' },
            { icon: '📞', title: '0800 123 456', sub: 'Kostenlose Expertenberatung' },
          ].map(item => (
            <div key={item.icon} style={{
              background: 'var(--primary-light)', borderRadius: 8, padding: '12px',
              display: 'flex', flexDirection: 'column', gap: 3,
            }}>
              <div style={{ fontSize: '1.3rem' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.85rem', color: 'var(--primary)' }}>{item.title}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-2)' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
