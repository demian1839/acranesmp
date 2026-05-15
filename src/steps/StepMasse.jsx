import { FENSTERTYPEN } from '../data/windowData'

export default function StepMasse({ config, onChange }) {
  const fenster = FENSTERTYPEN.find(f => f.id === config.fenstertyp) || {}
  const minW = fenster.minW || 300
  const maxW = fenster.maxW || 2500
  const minH = fenster.minH || 300
  const maxH = fenster.maxH || 2500

  const area  = ((config.width / 1000) * (config.height / 1000)).toFixed(2)
  const perimeter = (2 * (config.width + config.height) / 1000).toFixed(2)

  const handleWidth = (v) => {
    const n = Math.min(maxW, Math.max(minW, Number(v) || minW))
    onChange('width', n)
  }
  const handleHeight = (v) => {
    const n = Math.min(maxH, Math.max(minH, Number(v) || minH))
    onChange('height', n)
  }

  return (
    <div>
      <div className="step-content__header">
        <h2>Schritt 3: Maße eingeben</h2>
        <p>Geben Sie die Außenmaße (Rahmenmaß) Ihres Fensters ein. Alle Maße in Millimeter.</p>
      </div>
      <div className="step-content__body">
        <div className="dims-grid">
          {/* WIDTH */}
          <div className="dim-input">
            <label>Breite</label>
            <p className="dim-input__sub">Min. {minW} mm · Max. {maxW} mm</p>
            <div className="dim-slider-wrap">
              <input
                type="number"
                min={minW}
                max={maxW}
                step={10}
                value={config.width}
                onChange={e => handleWidth(e.target.value)}
                onBlur={e => handleWidth(e.target.value)}
              />
              <span className="dim-unit">mm</span>
            </div>
            <input
              type="range"
              min={minW}
              max={maxW}
              step={10}
              value={config.width}
              onChange={e => handleWidth(e.target.value)}
              style={{ marginTop: 6 }}
            />
            <p className="dim-hint">{(config.width / 10).toFixed(0)} cm · {(config.width / 1000).toFixed(2)} m</p>
          </div>

          {/* HEIGHT */}
          <div className="dim-input">
            <label>Höhe</label>
            <p className="dim-input__sub">Min. {minH} mm · Max. {maxH} mm</p>
            <div className="dim-slider-wrap">
              <input
                type="number"
                min={minH}
                max={maxH}
                step={10}
                value={config.height}
                onChange={e => handleHeight(e.target.value)}
                onBlur={e => handleHeight(e.target.value)}
              />
              <span className="dim-unit">mm</span>
            </div>
            <input
              type="range"
              min={minH}
              max={maxH}
              step={10}
              value={config.height}
              onChange={e => handleHeight(e.target.value)}
              style={{ marginTop: 6 }}
            />
            <p className="dim-hint">{(config.height / 10).toFixed(0)} cm · {(config.height / 1000).toFixed(2)} m</p>
          </div>
        </div>

        {/* Area info */}
        <div className="dims-area-info">
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <span>📐 Fläche: <b>{area} m²</b></span>
            <span>📏 Umfang: <b>{perimeter} m</b></span>
            <span>🪟 Lichtmaß ca.: <b>{config.width - 120} × {config.height - 120} mm</b></span>
          </div>
        </div>

        {/* Quantity */}
        <div className="qty-row">
          <label>Stückzahl:</label>
          <div className="qty-input">
            <button className="qty-btn" onClick={() => onChange('menge', Math.max(1, config.menge - 1))}>−</button>
            <input
              className="qty-val"
              type="number"
              min={1}
              max={50}
              value={config.menge}
              onChange={e => onChange('menge', Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            />
            <button className="qty-btn" onClick={() => onChange('menge', Math.min(50, config.menge + 1))}>+</button>
          </div>
          <span style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>
            {config.menge > 1 ? `(${config.menge} gleiche Fenster werden konfiguriert)` : ''}
          </span>
        </div>

        <div className="warning-box" style={{ marginTop: 16 }}>
          <strong>⚠️ Wichtiger Hinweis:</strong> Bitte geben Sie das Rohbaumaß ein und ziehen Sie
          das Einbaumaß ab. Wir empfehlen ca. 10–15 mm Fuge je Seite für den Ausgleich.
        </div>
      </div>
    </div>
  )
}
