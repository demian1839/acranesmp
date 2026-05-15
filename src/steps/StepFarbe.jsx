import { useState } from 'react'
import { FARBEN, COLOR_CATEGORIES } from '../data/windowData'

function ColorTab({ active, onClick, children }) {
  return (
    <div
      className={`color-tab ${active ? 'color-tab--active' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

function ColorPicker({ selected, onChange, label }) {
  const [catFilter, setCatFilter] = useState('weiss')

  const catColors = FARBEN.filter(c => c.category === catFilter)

  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>
        {label}
      </h3>
      <div className="color-tabs">
        {COLOR_CATEGORIES.map(cat => (
          <ColorTab key={cat.id} active={catFilter === cat.id} onClick={() => setCatFilter(cat.id)}>
            {cat.label}
          </ColorTab>
        ))}
      </div>

      <div className="color-grid">
        {catColors.map(c => (
          <div
            key={c.id}
            className={`color-swatch ${selected === c.id ? 'color-swatch--selected' : ''}`}
            onClick={() => onChange(c.id)}
            title={`${c.label} – ${c.ral}`}
          >
            <div
              className="color-swatch__circle"
              style={{
                background: c.woodTexture
                  ? `repeating-linear-gradient(90deg, ${c.hex} 0px, ${c.hex} 3px, ${adjustColor(c.hex, -20)} 3px, ${adjustColor(c.hex, -20)} 6px)`
                  : c.hex,
                borderColor: selected === c.id ? 'var(--primary)' : 'rgba(0,0,0,.12)',
              }}
            />
            <div className="color-swatch__label">
              {c.label}
              {c.priceAdd > 0 && (
                <div style={{ color: 'var(--primary)', fontSize: '.68rem' }}>+{c.priceAdd}€</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* selected color info */}
      {selected && (() => {
        const sel = FARBEN.find(c => c.id === selected)
        return sel ? (
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: 'var(--bg)', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: '.82rem', color: 'var(--text-2)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: sel.woodTexture
                ? `repeating-linear-gradient(90deg, ${sel.hex} 0px, ${sel.hex} 3px, ${adjustColor(sel.hex, -20)} 3px, ${adjustColor(sel.hex, -20)} 6px)`
                : sel.hex,
              border: '2px solid rgba(0,0,0,.15)', flexShrink: 0,
            }} />
            <div>
              <b>{sel.label}</b> – {sel.ral}
              {sel.priceAdd === 0
                ? <span style={{ color: 'var(--success)', marginLeft: 8, fontWeight: 600 }}>inklusive</span>
                : <span style={{ color: 'var(--primary)', marginLeft: 8, fontWeight: 600 }}>+{sel.priceAdd} € Aufpreis</span>}
            </div>
          </div>
        ) : null
      })()}
    </div>
  )
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

export default function StepFarbe({ config, onChange }) {
  const [tab, setTab] = useState('aussen')

  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 6: Farbe &amp; Oberfläche wählen</h2>
        <p>Wählen Sie Innen- und Außenfarbe unabhängig voneinander.</p>
      </div>
      <div className="step-content__body">
        {/* Innen/Außen Tab */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
          {[
            { id: 'aussen', label: '🏠 Außenfarbe' },
            { id: 'innen',  label: '🏡 Innenfarbe' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '10px 16px', border: 'none',
                background: tab === t.id ? 'var(--primary)' : 'var(--bg)',
                color: tab === t.id ? '#fff' : 'var(--text-2)',
                fontWeight: 600, fontFamily: 'inherit', fontSize: '.88rem',
                cursor: 'pointer', transition: 'all .15s',
                borderRadius: t.id === 'aussen' ? '8px 0 0 8px' : '0 8px 8px 0',
                borderRight: t.id === 'aussen' ? '1px solid var(--border-dark)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'aussen' ? (
          <ColorPicker
            selected={config.farbeAussen}
            onChange={v => onChange('farbeAussen', v)}
            label="Außenfarbe"
          />
        ) : (
          <ColorPicker
            selected={config.farbeInnen}
            onChange={v => onChange('farbeInnen', v)}
            label="Innenfarbe"
          />
        )}

        <div className="info-box">
          <strong>Zweifarbig möglich:</strong> Sie können Innen- und Außenfarbe individuell wählen.
          Die Innenfarbe wird mit 50% Aufpreis berechnet, wenn sie von der Außenfarbe abweicht.
          Weiß (RAL 9016 / RAL 9010) ist immer inklusive.
        </div>
      </div>
    </div>
  )
}
