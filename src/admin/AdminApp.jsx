import { useState, useEffect } from 'react'
import { getOrders, updateOrder, deleteOrder, getCustomPrices, saveCustomPrices, resetPrices } from '../utils/storage'
import { MATERIALIEN, VERGLASUNGEN } from '../data/windowData'
import './admin.css'

const ADMIN_PASSWORD = '1234'

const STATUS_CFG = {
  neu:            { label: 'Neu',            color: '#3b82f6', bg: '#eff6ff' },
  in_bearbeitung: { label: 'In Bearbeitung', color: '#f59e0b', bg: '#fffbeb' },
  versendet:      { label: 'Versendet',      color: '#8b5cf6', bg: '#f5f3ff' },
  abgeschlossen:  { label: 'Abgeschlossen',  color: '#10b981', bg: '#ecfdf5' },
  storniert:      { label: 'Storniert',      color: '#ef4444', bg: '#fef2f2' },
}

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.neu
  return (
    <span style={{
      background: c.bg, color: c.color, padding: '3px 11px',
      borderRadius: 20, fontSize: '.73rem', fontWeight: 700,
      border: `1px solid ${c.color}40`, whiteSpace: 'nowrap',
    }}>{c.label}</span>
  )
}

// ─── LOGIN ──────────────────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('admin_auth', '1'); onLogin() }
    else { setError(true); setShake(true); setTimeout(() => setShake(false), 500) }
  }

  return (
    <div className="admin-login">
      <div className={`admin-login__card${shake ? ' admin-login__card--shake' : ''}`}>
        <div className="admin-login__logo">🪟</div>
        <h1>Admin-Bereich</h1>
        <p>meinfenster24.de Verwaltung</p>
        <form onSubmit={submit}>
          <div className="admin-login__field">
            <label>Passwort</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              placeholder="Passwort eingeben"
              autoFocus
              className={error ? 'admin-login__input--error' : ''}
            />
            {error && <span className="admin-login__error">❌ Falsches Passwort. Bitte erneut versuchen.</span>}
          </div>
          <button type="submit" className="admin-login__btn">Anmelden →</button>
        </form>
      </div>
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────────────────────
function Dashboard({ orders }) {
  const nonCancelled = orders.filter(o => o.status !== 'storniert')
  const revenue = nonCancelled.reduce((s, o) => s + (o.price || 0), 0)
  const newOrders = orders.filter(o => o.status === 'neu').length
  const avg = nonCancelled.length ? revenue / nonCancelled.length : 0

  const matCount = {}
  orders.forEach(o => {
    const m = o.config?.material || 'unbekannt'
    matCount[m] = (matCount[m] || 0) + 1
  })

  const fmt = (n) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Willkommen zurück! Hier ist die aktuelle Übersicht.</p>
        </div>
        <div style={{ fontSize: '.82rem', color: '#718096' }}>
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="admin-stats">
        {[
          { label: 'Bestellungen gesamt', value: orders.length, icon: '📦', color: '#3b82f6' },
          { label: 'Gesamtumsatz',        value: `${fmt(revenue)} €`, icon: '💰', color: '#10b981' },
          { label: 'Neue Bestellungen',   value: newOrders, icon: '🆕', color: '#f59e0b' },
          { label: 'Ø Bestellwert',       value: `${fmt(avg)} €`, icon: '📊', color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__icon" style={{ background: `${s.color}18`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div className="admin-stat-card__value" style={{ color: s.color }}>{s.value}</div>
              <div className="admin-stat-card__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card__header">📈 Bestellungen nach Material</div>
          <div className="admin-card__body">
            {Object.entries(matCount).map(([mat, cnt]) => (
              <div key={mat} className="admin-bar">
                <div className="admin-bar__label" style={{ textTransform: 'capitalize' }}>{mat}</div>
                <div className="admin-bar__track">
                  <div className="admin-bar__fill" style={{ width: `${(cnt / orders.length) * 100}%` }}>
                    {cnt}×
                  </div>
                </div>
                <div className="admin-bar__pct">{Math.round((cnt / orders.length) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card__header">🕐 Letzte Bestellungen</div>
        {orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💭</div>
            Noch keine Bestellungen vorhanden.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bestell-Nr.</th><th>Datum</th><th>Kunde</th>
                <th>Material</th><th>Preis</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map(o => (
                <tr key={o.id}>
                  <td><code style={{ fontSize: '.8rem', color: '#1565c0', fontWeight: 700 }}>{o.id}</code></td>
                  <td style={{ fontSize: '.82rem', color: '#718096' }}>{new Date(o.date).toLocaleDateString('de-DE')}</td>
                  <td style={{ fontWeight: 600 }}>{o.customer?.vorname} {o.customer?.nachname}</td>
                  <td style={{ textTransform: 'capitalize', fontSize: '.85rem' }}>{o.config?.material || '–'}</td>
                  <td style={{ fontWeight: 700, color: '#1565c0' }}>{fmt(o.price || 0)} €</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────────────────────
function Orders({ orders: initOrders, onUpdate, onDelete }) {
  const [orders, setOrders] = useState(initOrders)
  const [filter, setFilter] = useState('alle')
  const [selected, setSelected] = useState(null)

  useEffect(() => setOrders(initOrders), [initOrders])

  const filtered = filter === 'alle' ? orders : orders.filter(o => o.status === filter)
  const fmt = (n) => (n || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })

  const changeStatus = (id, status) => {
    const updated = onUpdate(id, { status })
    setOrders(updated)
    if (selected?.id === id) setSelected(p => ({ ...p, status }))
  }

  const handleDelete = (id) => {
    if (!confirm('Bestellung wirklich löschen?')) return
    onDelete(id)
    setOrders(p => p.filter(o => o.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const TABS = [
    { id: 'alle', label: 'Alle' },
    { id: 'neu', label: 'Neu' },
    { id: 'in_bearbeitung', label: 'In Bearbeitung' },
    { id: 'versendet', label: 'Versendet' },
    { id: 'abgeschlossen', label: 'Abgeschlossen' },
    { id: 'storniert', label: 'Storniert' },
  ]

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div><h1>Bestellungen</h1><p>{orders.length} Bestellungen insgesamt</p></div>
      </div>

      <div className="admin-tabs">
        {TABS.map(t => {
          const cnt = t.id === 'alle' ? orders.length : orders.filter(o => o.status === t.id).length
          return (
            <button key={t.id} className={`admin-tab${filter === t.id ? ' admin-tab--active' : ''}`} onClick={() => setFilter(t.id)}>
              {t.label}
              {cnt > 0 && <span className="admin-tab__count">{cnt}</span>}
            </button>
          )
        })}
      </div>

      <div className="admin-card">
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💭</div>
            Keine Bestellungen in dieser Kategorie.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nr.</th><th>Datum</th><th>Kunde</th>
                <th>Fenster</th><th>Preis</th><th>Status</th><th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="admin-table__row--clickable" onClick={() => setSelected(o)}>
                  <td><code style={{ fontSize: '.78rem', color: '#1565c0', fontWeight: 700 }}>{o.id}</code></td>
                  <td style={{ fontSize: '.82rem', color: '#718096' }}>
                    {new Date(o.date).toLocaleDateString('de-DE')}
                    <div style={{ fontSize: '.72rem' }}>{new Date(o.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.customer?.vorname} {o.customer?.nachname}</div>
                    <div style={{ fontSize: '.75rem', color: '#718096' }}>{o.customer?.email}</div>
                  </td>
                  <td style={{ fontSize: '.82rem' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{o.config?.material}</span>
                    <span style={{ color: '#718096' }}> · {o.config?.width}×{o.config?.height} mm</span>
                    {o.config?.menge > 1 && <span style={{ color: '#1565c0' }}> ×{o.config?.menge}</span>}
                  </td>
                  <td style={{ fontWeight: 800, color: '#1565c0' }}>{fmt(o.price)} €</td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      value={o.status} onChange={e => changeStatus(o.id, e.target.value)}
                      className="admin-status-select"
                      style={{ borderColor: STATUS_CFG[o.status]?.color }}
                    >
                      {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="admin-btn admin-btn--sm admin-btn--primary" onClick={() => setSelected(o)}>Details</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(o.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div>
                <div className="admin-modal__header-sub">Bestelldetails</div>
                <h2>{selected.id}</h2>
              </div>
              <button className="admin-modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-detail-grid">
                <div className="admin-detail-section">
                  <div className="admin-detail-section__title">👤 Kundendaten</div>
                  {[
                    ['Name', `${selected.customer?.vorname} ${selected.customer?.nachname}`],
                    ['E-Mail', selected.customer?.email],
                    ['Telefon', selected.customer?.telefon || '–'],
                    ['Straße', selected.customer?.strasse || '–'],
                    ['PLZ / Ort', `${selected.customer?.plz} ${selected.customer?.ort}`],
                  ].map(([k, v]) => (
                    <div key={k} className="admin-detail-row">
                      <span className="admin-detail-row__key">{k}</span>
                      <span className="admin-detail-row__val">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="admin-detail-section">
                  <div className="admin-detail-section__title">🪟 Konfiguration</div>
                  {[
                    ['Fenstertyp', selected.config?.fenstertyp],
                    ['Material', selected.config?.material],
                    ['Profil', selected.config?.profil],
                    ['Maße', `${selected.config?.width} × ${selected.config?.height} mm`],
                    ['Stückzahl', selected.config?.menge],
                    ['Öffnungsart', selected.config?.oeffnungsart],
                    ['Verglasung', selected.config?.verglasung],
                    ['Farbe außen', selected.config?.farbeAussen],
                    ['Farbe innen', selected.config?.farbeInnen],
                    ['Beschläge', selected.config?.beschlaege],
                    ['Griff', selected.config?.griff],
                  ].map(([k, v]) => (
                    <div key={k} className="admin-detail-row">
                      <span className="admin-detail-row__key">{k}</span>
                      <span className="admin-detail-row__val">{v || '–'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-detail-section" style={{ marginTop: 16 }}>
                <div className="admin-detail-section__title">📋 Bestellinfo</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
                  {[
                    ['Datum', new Date(selected.date).toLocaleString('de-DE')],
                    ['Gesamtpreis', `${(selected.price || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
                    ['Zahlung', selected.payment || '–'],
                    ['Lieferung', selected.delivery || '–'],
                    ['Status', STATUS_CFG[selected.status]?.label],
                    ['Zubehör', (selected.config?.zubehoer || []).join(', ') || '–'],
                  ].map(([k, v]) => (
                    <div key={k} className="admin-detail-row">
                      <span className="admin-detail-row__key">{k}</span>
                      <span className="admin-detail-row__val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selected.notes && (
                <div className="admin-detail-section" style={{ marginTop: 16 }}>
                  <div className="admin-detail-section__title">💬 Anmerkungen</div>
                  <p style={{ fontSize: '.875rem', color: '#4a5568', lineHeight: 1.65 }}>{selected.notes}</p>
                </div>
              )}
            </div>
            <div className="admin-modal__footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '.85rem', fontWeight: 700 }}>Status ändern:</label>
                <select
                  value={selected.status}
                  onChange={e => changeStatus(selected.id, e.target.value)}
                  className="admin-status-select"
                >
                  {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(selected.id)}>Löschen</button>
                <button className="admin-btn admin-btn--ghost" onClick={() => setSelected(null)}>Schließen</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PRICES ───────────────────────────────────────────────────────────────────────────────────
function Prices() {
  const defaultPrices = MATERIALIEN.map(m => ({ id: m.id, label: m.labelFull, basePrice: m.basePrice, minPrice: m.minPrice }))
  const [prices, setPrices] = useState(() => getCustomPrices() || defaultPrices)
  const [saved, setSaved] = useState(false)

  const save = () => { saveCustomPrices(prices); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const reset = () => { resetPrices(); setPrices(defaultPrices) }
  const upd = (id, field, val) => setPrices(p => p.map(x => x.id === id ? { ...x, [field]: Number(val) || 0 } : x))

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div><h1>Preise verwalten</h1><p>Grundpreise für Materialien und Aufpreise anpassen</p></div>
      </div>

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card__header">
          💶 Grundpreise nach Material
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={reset}>↺ Standard</button>
            <button className={`admin-btn admin-btn--sm ${saved ? 'admin-btn--success' : 'admin-btn--primary'}`} onClick={save}>
              {saved ? '✓ Gespeichert!' : 'Speichern'}
            </button>
          </div>
        </div>
        <div className="admin-card__body">
          <table className="admin-table">
            <thead>
              <tr><th>Material</th><th>Grundpreis (€/m²)</th><th>Mindestpreis (€)</th></tr>
            </thead>
            <tbody>
              {prices.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700 }}>{p.label}</td>
                  <td>
                    <input type="number" value={p.basePrice} min={0} step={1}
                      onChange={e => upd(p.id, 'basePrice', e.target.value)}
                      className="admin-price-input" />
                    <span style={{ fontSize: '.8rem', color: '#718096', marginLeft: 6 }}>€/m²</span>
                  </td>
                  <td>
                    <input type="number" value={p.minPrice} min={0} step={1}
                      onChange={e => upd(p.id, 'minPrice', e.target.value)}
                      className="admin-price-input" />
                    <span style={{ fontSize: '.8rem', color: '#718096', marginLeft: 6 }}>€</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {saved && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#ecfdf5', borderRadius: 8, color: '#10b981', fontSize: '.85rem', fontWeight: 600 }}>
              ✓ Preise wurden erfolgreich gespeichert und sind ab sofort aktiv.
            </div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">🔍 Verglasung – Aufpreise (Übersicht)</div>
        <div className="admin-card__body">
          <table className="admin-table">
            <thead><tr><th>Verglasung</th><th>Aufpreis</th><th>Uw-Wert</th></tr></thead>
            <tbody>
              {VERGLASUNGEN.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.label}</td>
                  <td><span style={{ fontWeight: 700, color: v.priceAdd === 0 ? '#10b981' : '#1565c0' }}>
                    {v.priceAdd === 0 ? 'inklusive' : `+${v.priceAdd} €`}
                  </span></td>
                  <td style={{ color: '#718096', fontSize: '.85rem' }}>{v.uw}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '.75rem', color: '#718096', marginTop: 10 }}>
            * Verglasung-Aufpreise können in der Datei <code>src/data/windowData.js</code> angepasst werden.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ADMIN APP ──────────────────────────────────────────────────────────────────────────────
export default function AdminApp({ onExit }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('admin_auth') === '1')
  const [section, setSection] = useState('dashboard')
  const [orders, setOrders] = useState([])

  useEffect(() => { if (isLoggedIn) setOrders(getOrders()) }, [isLoggedIn])

  const handleUpdate = (id, updates) => { const u = updateOrder(id, updates); setOrders(u); return u }
  const handleDelete = (id) => { deleteOrder(id); setOrders(p => p.filter(o => o.id !== id)) }
  const handleLogout = () => { sessionStorage.removeItem('admin_auth'); setIsLoggedIn(false) }

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />

  const newCount = orders.filter(o => o.status === 'neu').length

  const NAV = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'orders',    icon: '📦', label: 'Bestellungen', badge: newCount },
    { id: 'prices',    icon: '💶', label: 'Preise verwalten' },
  ]

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <span style={{ fontSize: '1.6rem' }}>🪟</span>
          <div>
            <div className="admin-sidebar__logo-text">meinfenster24</div>
            <div className="admin-sidebar__logo-sub">Admin-Panel v2.0</div>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav__section">Navigation</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`admin-nav__item${section === item.id ? ' admin-nav__item--active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              {item.label}
              {item.badge > 0 && <span className="admin-nav__badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-nav__section">System</div>
          <button className="admin-nav__item" onClick={onExit}>
            <span className="admin-nav__icon">🌐</span> Zur Website
          </button>
          <button className="admin-nav__item" onClick={handleLogout}>
            <span className="admin-nav__icon">🚪</span> Abmelden
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {section === 'dashboard' && <Dashboard orders={orders} />}
        {section === 'orders'    && <Orders orders={orders} onUpdate={handleUpdate} onDelete={handleDelete} />}
        {section === 'prices'    && <Prices />}
      </main>
    </div>
  )
}
