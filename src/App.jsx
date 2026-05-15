import { useState, useEffect } from 'react'
import Configurator from './components/Configurator'
import AdminApp from './admin/AdminApp'
import { calculatePrice, formatPrice } from './utils/priceCalculator'

function Toast({ items, onClose }) {
  if (!items.length) return null
  return (
    <div className="toast">
      <span>✅</span>
      <span>Fenster wurde dem Warenkorb hinzugefügt!</span>
    </div>
  )
}

export default function App() {
  const [cartItems, setCartItems] = useState([])
  const [toast, setToast]         = useState(false)
  const [cartOpen, setCartOpen]   = useState(false)
  const [isAdmin, setIsAdmin]     = useState(() => window.location.hash === '#admin')

  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (isAdmin) return <AdminApp onExit={() => { window.location.hash = ''; setIsAdmin(false) }} />

  const handleAddToCart = (config) => {
    const price = calculatePrice(config)
    setCartItems(prev => [...prev, { config, price, id: Date.now() }])
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const cartTotal = cartItems.reduce((s, i) => s + i.price, 0)

  return (
    <div>
      {/* HEADER */}
      <header className="site-header">
        <div className="site-header__inner">
          <a href="/" className="site-header__logo">
            <div className="site-header__logo-icon">🪟</div>
            <span className="site-header__logo-text">
              mein<span>fenster</span>24.de
            </span>
          </a>

          <nav className="site-header__nav">
            <a href="#">Fenster</a>
            <a href="#">Türen</a>
            <a href="#">Rolladen</a>
            <a href="#">Konfigurator</a>
            <a href="#">Ratgeber</a>
            <a href="#">Kontakt</a>
          </nav>

          <button className="site-header__cart" onClick={() => setCartOpen(o => !o)}>
            🛒 Warenkorb
            {cartItems.length > 0 && (
              <span className="site-header__cart-count">{cartItems.length}</span>
            )}
          </button>
        </div>
      </header>

      {/* Cart Dropdown */}
      {cartOpen && cartItems.length > 0 && (
        <div style={{
          position: 'fixed', top: 64, right: 16, zIndex: 200,
          background: '#fff', borderRadius: 10,
          boxShadow: '0 8px 30px rgba(0,0,0,.18)',
          minWidth: 320, padding: 20,
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 14, fontSize: '.95rem' }}>
            🛒 Warenkorb ({cartItems.length} Positionen)
          </div>
          {cartItems.map((item, i) => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: '1px solid var(--border)',
              fontSize: '.85rem',
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {item.config.width}×{item.config.height} mm – {item.config.material || 'Kunststoff'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '.78rem' }}>
                  {item.config.menge}× · {item.config.verglasung}
                </div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                {formatPrice(item.price)}
              </div>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between', fontWeight: 800,
            fontSize: '1rem', marginTop: 12, paddingTop: 8,
            borderTop: '2px solid var(--border-dark)',
          }}>
            <span>Gesamt</span>
            <span style={{ color: 'var(--primary)' }}>{formatPrice(cartTotal)}</span>
          </div>
          <button className="btn btn--accent btn--lg" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}>
            Zur Kasse →
          </button>
          <button
            onClick={() => setCartOpen(false)}
            style={{ width: '100%', marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '.82rem' }}
          >
            Weiter einkaufen
          </button>
        </div>
      )}

      {/* PAGE TITLE */}
      <div className="page-title-bar">
        <div className="page-title-bar__inner">
          <div>
            <h1>Fenster-Konfigurator</h1>
            <p className="page-title-bar__sub">
              Konfigurieren Sie Ihr Wunschfenster in wenigen Schritten – mit Live-Preisberechnung
            </p>
          </div>
          <div className="breadcrumb">
            <a href="#">Start</a>
            <span className="breadcrumb-sep">›</span>
            <a href="#">Fenster</a>
            <span className="breadcrumb-sep">›</span>
            <span>Konfigurator</span>
          </div>
        </div>
      </div>

      {/* CONFIGURATOR */}
      <Configurator onAddToCart={handleAddToCart} />

      {/* TRUST BAR */}
      <div style={{
        background: 'var(--white)', borderTop: '1px solid var(--border)',
        padding: '20px 24px',
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center',
          alignItems: 'center',
        }}>
          {[
            { icon: '⭐', text: '4,8/5 Sterne – 12.000+ Bewertungen' },
            { icon: '🚚', text: 'Kostenloser Versand ab 500 €' },
            { icon: '🛡️', text: 'Bis zu 15 Jahre Garantie' },
            { icon: '📞', text: '0800 123 456 – Mo–Fr 8–18 Uhr' },
            { icon: '🏾d', text: 'Hergestellt in Deutschland' },
            { icon: '♻️', text: 'Nachhaltige Produktion, ISO 9001' },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '.82rem', color: 'var(--text-2)', fontWeight: 500,
            }}>
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div>
            <h4>🪟 meinfenster24.de</h4>
            <p style={{ fontSize: '.82rem', lineHeight: 1.6, marginBottom: 12 }}>
              Ihr Online-Shop für Fenster und Türen nach Maß.
              Seit über 20 Jahren Ihr verlässlicher Partner.
            </p>
            <div className="trust-badges">
              <span className="trust-badge">⭐ TÜV geprüft</span>
              <span className="trust-badge">🛡️ SSL-gesichert</span>
              <span className="trust-badge">🏾d Made in DE</span>
            </div>
          </div>
          <div>
            <h4>Produkte</h4>
            <a href="#">Kunststofffenster</a>
            <a href="#">Holzfenster</a>
            <a href="#">Holz-Alu-Fenster</a>
            <a href="#">Alufenster</a>
            <a href="#">Haustüren</a>
            <a href="#">Rolladen</a>
          </div>
          <div>
            <h4>Service</h4>
            <a href="#">Konfigurator</a>
            <a href="#">Musterbestellung</a>
            <a href="#">Montageservice</a>
            <a href="#">Ratgeber &amp; FAQ</a>
            <a href="#">Kontakt</a>
          </div>
          <div>
            <h4>Rechtliches</h4>
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
            <a href="#">AGB</a>
            <a href="#">Widerrufsrecht</a>
            <a href="#">Versandkosten</a>
          </div>
        </div>
        <div className="site-footer__bottom">
          © 2024 meinfenster24.de – Alle Preise inkl. 19% MwSt. · Irrtümer und Preisänderungen vorbehalten.
        </div>
      </footer>

      {/* Toast notification */}
      {toast && <Toast items={cartItems} onClose={() => setToast(false)} />}
    </div>
  )
}
