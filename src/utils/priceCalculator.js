import {
  MATERIALIEN, PROFILE, OEFFNUNGSARTEN, VERGLASUNGEN,
  FARBEN, BESCHLAEGE, GRIFFE, ZUBEHOER,
} from '../data/windowData'

export function calculatePrice(config) {
  const {
    material, profil, width, height,
    oeffnungsart, verglasung,
    farbeAussen, farbeInnen,
    beschlaege, griff, zubehoer, menge,
  } = config

  if (!material || !width || !height) return 0

  const mat = MATERIALIEN.find(m => m.id === material)
  if (!mat) return 0

  const w = Math.max(width, 100) / 1000
  const h = Math.max(height, 100) / 1000
  const area = w * h

  // Base price from area
  let price = Math.max(area * mat.basePrice, mat.minPrice)

  // Profile surcharge
  const profiles = PROFILE[material] || []
  const selectedProfile = profiles.find(p => p.id === profil)
  if (selectedProfile) {
    price += area * selectedProfile.priceAdd
  }

  // Opening type multiplier
  const oa = OEFFNUNGSARTEN.find(o => o.id === oeffnungsart)
  if (oa) {
    price *= oa.priceMultiplier
  }

  // Glazing surcharge
  const glas = VERGLASUNGEN.find(v => v.id === verglasung)
  if (glas) {
    price += glas.priceAdd
  }

  // Color surcharges (outside)
  const colorOut = FARBEN.find(c => c.id === farbeAussen)
  if (colorOut) price += colorOut.priceAdd

  // Color surcharges (inside, only if different from outside)
  const colorIn = FARBEN.find(c => c.id === farbeInnen)
  if (colorIn && farbeInnen !== farbeAussen) {
    price += colorIn.priceAdd * 0.5  // half price for second color
  }

  // Hardware
  const besc = BESCHLAEGE.find(b => b.id === beschlaege)
  if (besc) price += besc.priceAdd

  // Handle
  const gr = GRIFFE.find(g => g.id === griff)
  if (gr) price += gr.priceAdd

  // Accessories
  const selectedZubehoer = zubehoer || []
  selectedZubehoer.forEach(zid => {
    const z = ZUBEHOER.find(z => z.id === zid)
    if (z) price += z.priceAdd
  })

  // Quantity
  const qty = menge || 1
  return Math.round(price * qty * 100) / 100
}

export function getPriceBreakdown(config) {
  const {
    material, profil, width, height,
    oeffnungsart, verglasung,
    farbeAussen, farbeInnen,
    beschlaege, griff, zubehoer, menge,
  } = config

  if (!material || !width || !height) return []

  const mat = MATERIALIEN.find(m => m.id === material)
  if (!mat) return []

  const w = Math.max(width, 100) / 1000
  const h = Math.max(height, 100) / 1000
  const area = w * h
  const items = []

  let basePrice = Math.max(area * mat.basePrice, mat.minPrice)

  // Profile
  const profiles = PROFILE[material] || []
  const selectedProfile = profiles.find(p => p.id === profil)
  let profileAdd = 0
  if (selectedProfile) {
    profileAdd = area * selectedProfile.priceAdd
    basePrice += profileAdd
  }

  items.push({ label: `${mat.labelFull} – ${w.toFixed(2)}×${h.toFixed(2)} m (${area.toFixed(2)} m²)`, price: basePrice })

  // Opening type
  const oa = OEFFNUNGSARTEN.find(o => o.id === oeffnungsart)
  if (oa && oa.priceMultiplier > 1) {
    const add = basePrice * (oa.priceMultiplier - 1)
    items.push({ label: `Aufpreis Öffnungsart: ${oa.label}`, price: add })
    basePrice += add
  }

  // Glazing
  const glas = VERGLASUNGEN.find(v => v.id === verglasung)
  if (glas && glas.priceAdd > 0) {
    items.push({ label: `Aufpreis Verglasung: ${glas.shortLabel}`, price: glas.priceAdd })
  }

  // Colors
  const colorOut = FARBEN.find(c => c.id === farbeAussen)
  if (colorOut && colorOut.priceAdd > 0) {
    items.push({ label: `Farbe außen: ${colorOut.label} (${colorOut.ral})`, price: colorOut.priceAdd })
  }
  const colorIn = FARBEN.find(c => c.id === farbeInnen)
  if (colorIn && farbeInnen !== farbeAussen && colorIn.priceAdd > 0) {
    items.push({ label: `Farbe innen: ${colorIn.label} (${colorIn.ral})`, price: Math.round(colorIn.priceAdd * 0.5 * 100) / 100 })
  }

  // Hardware
  const besc = BESCHLAEGE.find(b => b.id === beschlaege)
  if (besc && besc.priceAdd > 0) {
    items.push({ label: `Beschläge: ${besc.label}`, price: besc.priceAdd })
  }

  // Handle
  const gr = GRIFFE.find(g => g.id === griff)
  if (gr && gr.priceAdd > 0) {
    items.push({ label: `Griff: ${gr.label}`, price: gr.priceAdd })
  }

  // Accessories
  const selectedZubehoer = zubehoer || []
  selectedZubehoer.forEach(zid => {
    const z = ZUBEHOER.find(z => z.id === zid)
    if (z) items.push({ label: z.label, price: z.priceAdd })
  })

  return items
}

export function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price)
}
