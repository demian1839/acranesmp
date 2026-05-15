import { FENSTERTYPEN, FARBEN, VERGLASUNGEN, OEFFNUNGSARTEN } from '../data/windowData'

const FRAME = 14
const SASH  = 10
const W     = 240
const H     = 280

function OpeningSymbol({ symbol, x, y, w, h }) {
  const mx = x + w / 2
  const my = y + h / 2
  const strokeProps = { stroke: 'rgba(30,80,150,0.5)', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' }

  switch (symbol) {
    case 'fixed': return null
    case 'dreh-l':
      return (
        <g>
          <line x1={x+w} y1={y} x2={x} y2={my} {...strokeProps} />
          <line x1={x+w} y1={y+h} x2={x} y2={my} {...strokeProps} />
        </g>
      )
    case 'dreh-r':
      return (
        <g>
          <line x1={x} y1={y} x2={x+w} y2={my} {...strokeProps} />
          <line x1={x} y1={y+h} x2={x+w} y2={my} {...strokeProps} />
        </g>
      )
    case 'dk-l':
      return (
        <g>
          <line x1={x+w} y1={y} x2={x} y2={my} {...strokeProps} />
          <line x1={x+w} y1={y+h} x2={x} y2={my} {...strokeProps} />
          <line x1={x} y1={y} x2={x+w} y2={y} {...strokeProps} strokeDasharray="4 3" />
          <line x1={x} y1={y} x2={mx} y2={y+h} {...strokeProps} stroke="rgba(30,80,150,0.3)" />
        </g>
      )
    case 'dk-r':
      return (
        <g>
          <line x1={x} y1={y} x2={x+w} y2={my} {...strokeProps} />
          <line x1={x} y1={y+h} x2={x+w} y2={my} {...strokeProps} />
          <line x1={x} y1={y} x2={x+w} y2={y} {...strokeProps} strokeDasharray="4 3" />
          <line x1={x+w} y1={y} x2={mx} y2={y+h} {...strokeProps} stroke="rgba(30,80,150,0.3)" />
        </g>
      )
    case 'kipp':
      return (
        <g>
          <line x1={x} y1={y+h} x2={mx} y2={y} {...strokeProps} />
          <line x1={x+w} y1={y+h} x2={mx} y2={y} {...strokeProps} />
          <line x1={x} y1={y+h} x2={x+w} y2={y+h} {...strokeProps} strokeDasharray="4 3" />
        </g>
      )
    case 'dreh-o-l':
      return (
        <g>
          <line x1={x} y1={y+h} x2={mx} y2={y} {...strokeProps} />
          <line x1={x+w} y1={y+h} x2={mx} y2={y} {...strokeProps} />
        </g>
      )
    default: return null
  }
}

function Handle({ x, y, color, side }) {
  const hx = side === 'left' ? x + 14 : x - 8
  return (
    <g>
      <rect x={hx} y={y - 10} width={8} height={20} rx={4}
        fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth={0.8} />
    </g>
  )
}

function Sash({ x, y, w, h, glassColor, frosted, symbol, frameColor, handleColor, handleSide }) {
  const gx = x + SASH
  const gy = y + SASH
  const gw = w - SASH * 2
  const gh = h - SASH * 2

  return (
    <g>
      {/* sash frame */}
      <rect x={x} y={y} width={w} height={h} fill={frameColor}
        stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} rx={1} />
      {/* glass */}
      <rect x={gx} y={gy} width={gw} height={gh} fill={glassColor} rx={1} />
      {frosted && (
        <rect x={gx} y={gy} width={gw} height={gh}
          fill="url(#frostedPattern)" rx={1} opacity={0.7} />
      )}
      {/* glass reflection */}
      <rect x={gx+4} y={gy+4} width={gw * 0.2} height={gh * 0.7}
        fill="rgba(255,255,255,0.22)" rx={2} />
      {/* opening symbol */}
      <OpeningSymbol symbol={symbol} x={gx+4} y={gy+4} w={gw-8} h={gh-8} />
      {/* handle */}
      {symbol !== 'fixed' && (
        <Handle
          x={handleSide === 'left' ? gx + 10 : gx + gw - 10}
          y={gy + gh / 2}
          color={handleColor}
          side={handleSide}
        />
      )}
    </g>
  )
}

export default function WindowPreview({ config }) {
  const { fenstertyp, farbeAussen, verglasung, oeffnungsart, griff } = config

  const fenster   = FENSTERTYPEN.find(f => f.id === fenstertyp) || FENSTERTYPEN[0]
  const colorData = FARBEN.find(c => c.id === farbeAussen) || FARBEN[0]
  const glasData  = VERGLASUNGEN.find(v => v.id === verglasung) || VERGLASUNGEN[0]
  const oaData    = OEFFNUNGSARTEN.find(o => o.id === oeffnungsart) || OEFFNUNGSARTEN[3]

  const frameColor  = colorData.hex
  const glassColor  = glasData.glassColor || 'rgba(200,228,255,0.5)'
  const frosted     = glasData.frosted || false
  const handleColor = config.griff === 'gold' ? '#c8a84b'
    : config.griff === 'schwarz' || config.griff === 'anthrazit' ? '#3d4040'
    : config.griff === 'messing' ? '#b5a030'
    : '#c0c0c0'

  const isDoor = fenster.isDoor
  const svgH   = isDoor ? 320 : H
  const symbol = fenster.noOpening ? 'fixed' : oaData.symbol

  const handleSide = (symbol === 'dk-r' || symbol === 'dreh-r') ? 'right' : 'left'

  let sashCount = fenster.sashes || 1
  const outerW  = W
  const outerH  = svgH
  const innerW  = outerW - FRAME * 2
  const innerH  = outerH - FRAME * 2

  const sashW  = innerW / sashCount
  const sashH  = innerH

  return (
    <svg
      width={outerW + 20}
      height={outerH + 20}
      viewBox={`-10 -10 ${outerW + 20} ${outerH + 20}`}
    >
      <defs>
        <pattern id="frostedPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="8" x2="8" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </pattern>
        <filter id="frameShadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.25)" />
        </filter>
      </defs>

      {/* outer frame */}
      <rect x={0} y={0} width={outerW} height={outerH}
        fill={frameColor} rx={3}
        stroke="rgba(0,0,0,0.22)" strokeWidth={1}
        filter="url(#frameShadow)" />

      {/* sashes */}
      {Array.from({ length: sashCount }).map((_, i) => (
        <Sash
          key={i}
          x={FRAME + i * sashW}
          y={FRAME}
          w={sashW}
          h={sashH}
          glassColor={glassColor}
          frosted={frosted}
          symbol={symbol}
          frameColor={frameColor}
          handleColor={handleColor}
          handleSide={i === 0 ? handleSide : (handleSide === 'left' ? 'right' : 'left')}
        />
      ))}

      {/* center post for multi-sash */}
      {sashCount > 1 && Array.from({ length: sashCount - 1 }).map((_, i) => (
        <rect
          key={i}
          x={FRAME + (i + 1) * sashW - 3}
          y={FRAME}
          width={6}
          height={innerH}
          fill={frameColor}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={0.5}
        />
      ))}

      {/* dimension labels */}
      {config.width > 0 && config.height > 0 && (
        <g>
          <text x={outerW / 2} y={outerH + 14} textAnchor="middle"
            fontSize={9} fill="rgba(80,80,80,0.8)" fontFamily="sans-serif">
            {config.width} mm
          </text>
          <text x={outerW + 14} y={outerH / 2} textAnchor="middle"
            fontSize={9} fill="rgba(80,80,80,0.8)" fontFamily="sans-serif"
            transform={`rotate(90, ${outerW + 14}, ${outerH / 2})`}>
            {config.height} mm
          </text>
        </g>
      )}
    </svg>
  )
}
